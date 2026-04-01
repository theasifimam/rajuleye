import express from 'express';
import { getProductReviews, createReview, deleteReview } from '../controllers/review.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadMultiple } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', protect, uploadMultiple('images', 3), createReview);
router.delete('/:id', protect, deleteReview);

export default router;
