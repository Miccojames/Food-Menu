import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const getBearer = (req) => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return null;
};

// Verifies the JWT and attaches { id, username, role } to req.user
export const protect = async (req, res, next) => {
  try {
    const token = getBearer(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    // `sub` is a string in JWTs — coerce to Int for Prisma
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId)) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    // Confirm the user still exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true },
    });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Like protect, but continues as anonymous when no/invalid token is present.
// Used on endpoints that behave differently for logged-in users (e.g. checkout).
export const optionalAuth = async (req, res, next) => {
  const token = getBearer(req);
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = Number(payload.sub);
    if (Number.isInteger(userId)) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, role: true },
      });
      if (user) req.user = user;
    }
  } catch {
    // Ignore invalid tokens on optional auth
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};
