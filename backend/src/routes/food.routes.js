import express from 'express';
import {
  createFood,
  getFoods,
  getFood,
  updateFood,
  deleteFood
} from '../controllers/food.controller.js';
import { protect, requireAdmin, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getFoods)
  .post(protect, requireAdmin, createFood);

router.route('/:id')
  .get(getFood)
  .put(protect, requireAdmin, updateFood)
  .delete(protect, requireAdmin, deleteFood);

export default router;
