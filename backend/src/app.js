import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/notFound.middleware.js';

import foodRoutes from './routes/food.routes.js';
import categoryRoutes from './routes/category.routes.js';
import orderRoutes from './routes/order.routes.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(helmet({
  // Allow the Vue dev server / served frontend to load images from /uploads
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// Allow the web dev server AND the Capacitor app (WebView origin) to call the API
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:9000')
  .split(',')
  .concat(['https://localhost', 'http://localhost', 'capacitor://localhost']);
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Uploaded food images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window (raised: menu browsing is chatty)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Tighter limit for credential endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' },
});
app.use('/api/auth', authLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'BiteBoard API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
