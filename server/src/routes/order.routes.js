import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  verifyPayment,
} from '../controllers/order.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);
router.patch('/:id/status', adminOnly, updateOrderStatus);
router.get('/', adminOnly, getAllOrders);

export default router;
