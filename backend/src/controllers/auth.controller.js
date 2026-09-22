import prisma from '../lib/prisma.js';

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Only allow 'customer' role on self-registration (admin can only be seeded)
    const userRole = role === 'admin' ? 'customer' : 'customer';

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    // Store password as plain text (no authentication library required)
    const user = await prisma.user.create({
      data: { username, password, role: userRole }
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { id: user.id, username: user.username, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { id: user.id, username: user.username, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
