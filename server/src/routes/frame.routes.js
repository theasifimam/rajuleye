import express from 'express';
import { getFrames, createFrame, updateFrame, deleteFrame } from '../controllers/frame.controller.js';
import { protect, adminOnly, optionalProtect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public — optionally attach user info if token present (for admin visibility)
router.get('/', optionalProtect, getFrames);

// Admin only
router.post('/', protect, adminOnly, createFrame);
router.patch('/:id', protect, adminOnly, updateFrame);
router.delete('/:id', protect, adminOnly, deleteFrame);

export default router;
