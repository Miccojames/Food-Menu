import prisma from '../lib/prisma.js';

// @desc    Get all foods (supports pagination, search, category filter)
// @route   GET /api/foods
export const getFoods = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query;

    const where = { available: true };

    // Category filter — look up the category by name
    if (category && category !== 'All') {
      where.category = { name: category };
    }

    // Search filter across name, description, and category name
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
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
    ]);

    // Flatten category name for frontend compatibility
    const data = foods.map((f) => ({
      ...f,
      category: f.category.name,
    }));

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
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
    const food = await prisma.food.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: true },
    });
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    res.status(200).json({ success: true, data: { ...food, category: food.category.name } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new food
// @route   POST /api/foods
export const createFood = async (req, res, next) => {
  try {
    const { name, category, price, description, image, spicy, vegetarian, available } = req.body;

    // Find or create the category
    const cat = await prisma.category.findFirst({ where: { name: category } });
    if (!cat) {
      return res.status(400).json({ success: false, message: `Category "${category}" not found` });
    }

    const food = await prisma.food.create({
      data: {
        name,
        categoryId: cat.id,
        price: Number(price),
        description,
        image,
        spicy: Boolean(spicy),
        vegetarian: Boolean(vegetarian),
        available: available !== undefined ? Boolean(available) : true,
      },
      include: { category: true },
    });

    res.status(201).json({ success: true, data: { ...food, category: food.category.name } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update food
// @route   PUT /api/foods/:id
export const updateFood = async (req, res, next) => {
  try {
    const { name, category, price, description, image, spicy, vegetarian, available } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (spicy !== undefined) updateData.spicy = Boolean(spicy);
    if (vegetarian !== undefined) updateData.vegetarian = Boolean(vegetarian);
    if (available !== undefined) updateData.available = Boolean(available);

    if (category !== undefined) {
      const cat = await prisma.category.findFirst({ where: { name: category } });
      if (!cat) {
        return res.status(400).json({ success: false, message: `Category "${category}" not found` });
      }
      updateData.categoryId = cat.id;
    }

    const food = await prisma.food.update({
      where: { id: Number(req.params.id) },
      data: updateData,
      include: { category: true },
    });

    res.status(200).json({ success: true, data: { ...food, category: food.category.name } });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete food
// @route   DELETE /api/foods/:id
export const deleteFood = async (req, res, next) => {
  try {
    await prisma.food.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    next(error);
  }
};
