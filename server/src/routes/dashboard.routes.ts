import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/dashboard.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all routes and enforce admin role
router.use(protect);
router.use(adminOnly);

router.get('/metrics', getDashboardMetrics);

export default router;
