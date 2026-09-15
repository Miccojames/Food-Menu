import express from 'express';
import {
  getFoods,
  getFood,
  createFood,
  updateFood,
  deleteFood
} from '../controllers/food.controller.js';

const router = express.Router();

router.route('/')
  .get(getFoods)
  .post(createFood);

router.route('/:id')
  .get(getFood)
  .put(updateFood)
  .delete(deleteFood);

export default router;
