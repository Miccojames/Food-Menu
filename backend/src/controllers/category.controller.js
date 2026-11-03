import { z } from 'zod';
import prisma from '../lib/prisma.js';

const categorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  description: z.string().trim().max(500).optional().nullable(),
});

export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { foods: true } } },
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid category payload',
      });
    }
    const category = await prisma.category.create({ data: parsed.data });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    const parsed = categorySchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid category payload',
      });
    }
    const category = await prisma.category.update({ where: { id }, data: parsed.data });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await prisma.category.delete({ where: { id } });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    // Category still has foods
    const msg = String(error.message || '');
    if (
      error.code === 'P2003' ||
      error.code === 'P2014' ||
      error.code === '23001' ||
      msg.includes('RESTRICT setting of foreign key')
    ) {
      return res.status(409).json({
        success: false,
        message: 'This category still contains foods — remove them first',
      });
    }
    next(error);
  }
};
