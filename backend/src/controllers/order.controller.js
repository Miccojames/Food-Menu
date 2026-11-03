import { z } from 'zod';
import prisma from '../lib/prisma.js';

const ORDER_STATUSES = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        food: z.coerce.number().int().positive().optional(),
        foodId: z.coerce.number().int().positive().optional(),
        id: z.coerce.number().int().positive().optional(),
        quantity: z.coerce.number().int().positive().max(100, 'Quantity per item cannot exceed 100'),
      })
    )
    .min(1, 'No items in order')
    .max(50, 'Too many items in one order'),
  customerName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  customerContact: z.string().trim().min(5, 'Please provide a valid contact number').max(50),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  status: z.enum(ORDER_STATUSES).optional(),
});

// Serialize Prisma Decimal fields as plain numbers for the frontend
const serializeOrder = (order) => ({
  ...order,
  totalAmount: Number(order.totalAmount),
  items: order.items?.map((i) => ({
    ...i,
    price: Number(i.price),
    subtotal: Number(i.subtotal),
  })),
});

export const createOrder = async (req, res) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid order payload',
      });
    }
    const { items, customerName, customerContact } = parsed.data;

    const foodIds = [...new Set(items.map((i) => i.food ?? i.foodId ?? i.id))];
    const foods = await prisma.food.findMany({ where: { id: { in: foodIds } } });
    const foodById = new Map(foods.map((f) => [f.id, f]));

    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const foodId = item.food ?? item.foodId ?? item.id;
      const food = foodById.get(foodId);

      if (!food) {
        return res.status(400).json({ success: false, message: `Food with ID ${foodId} not found` });
      }
      if (!food.available) {
        return res.status(400).json({ success: false, message: `${food.name} is currently unavailable` });
      }

      const subtotal = Number(food.price) * item.quantity;
      totalAmount += subtotal;

      validatedItems.push({
        foodId: food.id,
        name: food.name,
        price: food.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    const order = await prisma.order.create({
      data: {
        totalAmount,
        customerName,
        customerContact,
        userId: req.user?.id ?? null,
        items: { create: validatedItems },
        statusHistory: {
          create: { fromStatus: null, toStatus: 'Pending', changedById: req.user?.id ?? null },
        },
      },
      include: { items: true },
    });

    res.status(201).json({ success: true, message: 'Order created successfully', data: serializeOrder(order) });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

// Admin: all orders with pagination + optional status filter
export const getOrders = async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid query parameters',
      });
    }
    const { page, limit, status } = parsed.data;

    const where = status ? { status } : {};
    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: orders.map(serializeOrder),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// Customer: only their own orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: orders.map(serializeOrder) });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { food: true } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Owner or admin only
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You do not have access to this order' });
    }

    res.status(200).json({ success: true, data: serializeOrder(order) });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const orderId = Number(req.params.id);

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${ORDER_STATUSES.join(', ')}`,
      });
    }

    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (existing.status === status) {
      return res.status(200).json({ success: true, message: 'Status unchanged', data: serializeOrder(existing) });
    }

    // Update status + record history atomically (cancelled orders are kept, not deleted)
    const [order] = await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          status,
          statusHistory: {
            create: { fromStatus: existing.status, toStatus: status, changedById: req.user.id },
          },
        },
        include: { items: true },
      }),
    ]);

    res.status(200).json({ success: true, data: serializeOrder(order) });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    await prisma.order.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    next(error);
  }
};

// Admin dashboard stats
export const getOrderStats = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [statusGroups, revenueAgg, topItems, dailyRaw] = await Promise.all([
      prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['Completed', 'Ready'] } },
      }),
      prisma.orderItem.groupBy({
        by: ['name'],
        _sum: { quantity: true },
        _count: { _all: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
    ]);

    const byStatus = Object.fromEntries(statusGroups.map((g) => [g.status, g._count._all]));

    // Orders per day for the last 30 days (fill gaps with 0)
    const dailyMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dailyMap[d.toISOString().slice(0, 10)] = 0;
    }
    for (const o of dailyRaw) {
      const key = o.createdAt.toISOString().slice(0, 10);
      if (key in dailyMap) dailyMap[key] += 1;
    }
    const daily = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.status(200).json({
      success: true,
      data: {
        totalOrders: statusGroups.reduce((s, g) => s + g._count._all, 0),
        byStatus,
        revenue: Number(revenueAgg._sum.totalAmount ?? 0),
        topItems: topItems.map((t) => ({ name: t.name, quantity: t._sum.quantity ?? 0 })),
        daily,
      },
    });
  } catch (error) {
    next(error);
  }
};
