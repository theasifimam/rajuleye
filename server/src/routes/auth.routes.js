import express from 'express';
import {
  register,
  verifyMobile,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-mobile', verifyMobile);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);

export default router;
