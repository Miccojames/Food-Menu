import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, requireAdmin, createCategory);

router.route('/:id')
  .put(protect, requireAdmin, updateCategory)
  .delete(protect, requireAdmin, deleteCategory);

export default router;
