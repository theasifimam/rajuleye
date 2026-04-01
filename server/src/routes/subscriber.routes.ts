import express from 'express';
import {
    subscribe,
    getSubscribers,
    sendNewsletter,
} from '../controllers/subscriber.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public route for subscription
router.post('/subscribe', subscribe);

// Admin-only routes for management and sending
router.get('/', protect, adminOnly, getSubscribers);
router.post('/send', protect, adminOnly, sendNewsletter);

export default router;
