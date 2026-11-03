import express from 'express';
import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
} from '../controllers/order.controller.js';
import { protect, requireAdmin, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin: full order list (with pagination/status filter) + dashboard stats
router.get('/', protect, requireAdmin, getOrders);
router.get('/stats', protect, requireAdmin, getOrderStats);

// Customer: their own orders
router.get('/mine', protect, getMyOrders);

// Checkout works for guests and logged-in users alike
router.post('/', optionalAuth, createOrder);

// Order details: owner or admin
router.get('/:id', protect, getOrder);

// Admin-only mutations
router.put('/:id/status', protect, requireAdmin, updateOrderStatus);
router.delete('/:id', protect, requireAdmin, deleteOrder);

export default router;
