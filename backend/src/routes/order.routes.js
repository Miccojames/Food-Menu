import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder
} from '../controllers/order.controller.js';

const router = express.Router();

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrder)
  .delete(deleteOrder);

router.route('/:id/status')
  .put(updateOrderStatus);

export default router;
