import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 60) || 'image';
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const ALLOWED = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.includes(ext)) {
      return cb(new Error('Only image files are allowed (jpg, png, webp, gif, avif)'));
    }
    cb(null, true);
  },
});

const router = Router();

// POST /api/upload/image  (admin only) -> { url }
router.post('/image', protect, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }
  res.status(201).json({
    success: true,
    message: 'Image uploaded',
    data: { url: `/uploads/${req.file.filename}` },
  });
});

export default router;
