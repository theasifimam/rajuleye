import express from 'express';
import {
    getBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
} from '../controllers/banner.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { uploadSingle } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', getBanners);
router.get('/:id', getBannerById);

router.post('/', protect, adminOnly, uploadSingle('image'), createBanner);
router.put('/:id', protect, adminOnly, uploadSingle('image'), updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

export default router;
