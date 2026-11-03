import { z } from 'zod';
import prisma from '../lib/prisma.js';

const foodSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  category: z.string().trim().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price cannot be negative').max(100000),
  description: z.string().trim().min(1, 'Description is required').max(2000),
  image: z.string().trim().min(1, 'Image is required').max(500),
  spicy: z.coerce.boolean().optional().default(false),
  vegetarian: z.coerce.boolean().optional().default(false),
  available: z.coerce.boolean().optional().default(true),
});

const foodPatchSchema = foodSchema.partial();

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  category: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).max(200).optional(),
  all: z.enum(['true', 'false']).optional(),
});

const serializeFood = (food) => ({
  ...food,
  price: Number(food.price),
  category: food.category?.name ?? food.category,
});

// @desc    Get all foods (pagination, search, category filter)
// @route   GET /api/foods  (?all=true is admin-only and includes unavailable items)
export const getFoods = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid query parameters',
      });
    }
    const { page, limit, category, search, all } = parsed.data;

    // Only admins may list unavailable foods
    const includeUnavailable = all === 'true' && req.user?.role === 'admin';

    const where = {};
    if (!includeUnavailable) where.available = true;

    if (category && category !== 'All') {
      where.category = { name: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [total, foods] = await Promise.all([
      prisma.food.count({ where }),
      prisma.food.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: foods.map(serializeFood),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food
// @route   GET /api/foods/:id
export const getFood = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    const food = await prisma.food.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    res.status(200).json({ success: true, data: serializeFood(food) });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new food
// @route   POST /api/foods
export const createFood = async (req, res, next) => {
  try {
    const parsed = foodSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid food payload',
      });
    }
    const { name, category, price, description, image, spicy, vegetarian, available } = parsed.data;

    const cat = await prisma.category.findFirst({ where: { name: category } });
    if (!cat) {
      return res.status(400).json({ success: false, message: `Category "${category}" not found` });
    }

    const food = await prisma.food.create({
      data: {
        name,
        categoryId: cat.id,
        price,
        description,
        image,
        spicy,
        vegetarian,
        available,
      },
      include: { category: true },
    });

    res.status(201).json({ success: true, data: serializeFood(food) });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food
// @route   PUT /api/foods/:id
export const updateFood = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    const parsed = foodPatchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid food payload',
      });
    }
    const data = { ...parsed.data };

    if (data.category !== undefined) {
      const cat = await prisma.category.findFirst({ where: { name: data.category } });
      if (!cat) {
        return res.status(400).json({ success: false, message: `Category "${data.category}" not found` });
      }
      data.categoryId = cat.id;
      delete data.category;
    }

    const food = await prisma.food.update({
      where: { id },
      data,
      include: { category: true },
    });

    res.status(200).json({ success: true, data: serializeFood(food) });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    next(error);
  }
};

// @desc    Delete food
// @route   DELETE /api/foods/:id
export const deleteFood = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    await prisma.food.delete({ where: { id } });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    // Referenced by order history (FK restrict) — Prisma surfaces this as
    // either a Prisma code or a raw Postgres 23001 in an unknown request error
    const msg = String(error.message || '');
    if (
      error.code === 'P2003' ||
      error.code === 'P2014' ||
      error.code === '23001' ||
      msg.includes('RESTRICT setting of foreign key')
    ) {
      return res.status(409).json({
        success: false,
        message: 'This item has order history and cannot be deleted — set it as unavailable instead',
      });
    }
    next(error);
  }
};
