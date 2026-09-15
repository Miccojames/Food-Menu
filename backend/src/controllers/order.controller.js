import prisma from '../lib/prisma.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items, customerName, customerContact } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    let totalAmount = 0;
    const validatedItems = [];

    // Validate each item and calculate the correct total from DB prices
    for (const item of items) {
      const foodId = Number(item.food || item.foodId || item.id);
      const food = await prisma.food.findUnique({
        where: { id: foodId },
      });

      if (!food) {
        return res.status(400).json({ success: false, message: `Food with ID ${item.food || item.foodId || item.id} not found` });
      }

      if (!food.available) {
        return res.status(400).json({ success: false, message: `${food.name} is currently unavailable` });
      }

      const subtotal = food.price * item.quantity;
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
        items: {
          create: validatedItems,
        },
      },
      include: { items: true },
    });

    res.status(201).json({ success: true, message: 'Order created successfully', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: { items: { include: { food: true } } },
    });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { status },
      include: { items: true },
    });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(400).json({ success: false, message: error.message });
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
