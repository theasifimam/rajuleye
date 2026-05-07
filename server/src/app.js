import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import cartRoutes from './routes/cart.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import reviewRoutes from './routes/review.routes.js';
import orderRoutes from './routes/order.routes.js';
import bannerRoutes from './routes/banner.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import subscriberRoutes from './routes/subscriber.routes.js';
import settingRoutes from './routes/setting.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Environment variables are loaded in the main entry point (index.js)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3000'
    ],
    credentials: true,
  })
);

// Body & Cookie Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health & Root
app.get('/', (_req, res) => {
  res.json({ success: true, message: '👓 Rajul Eye API is running' });
});
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/subscribers', subscriberRoutes);
app.use('/api/v1/settings', settingRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler — must be LAST
app.use(errorHandler);

export default app;
