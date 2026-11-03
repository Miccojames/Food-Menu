import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

const registerSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(50),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const signToken = (user) =>
  jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d', subject: String(user.id) }
  );

const publicUser = (user) => ({ id: user.id, username: user.username, role: user.role });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid input',
      });
    }
    const { username, password } = parsed.data;

    // Self-registration always creates a customer (admin is seeded separately)
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashed, role: 'customer' },
    });

    const token = signToken(user);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { ...publicUser(user), token },
    });
  } catch (error) {
    // Unique constraint race (P2002) — treat as duplicate username
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid input',
      });
    }
    const { username, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { username } });

    // Same generic message for unknown user and wrong password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = signToken(user);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { ...publicUser(user), token },
    });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};
