import express from 'express';
import { getCategories, getTopCategories, getCategoryById, getSubcategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { uploadSingle } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/top-nav', getTopCategories);
router.get('/:idOrSlug', getCategoryById);
router.get('/:id/subcategories', getSubcategories);
router.post('/', protect, adminOnly, uploadSingle('image'), createCategory);
router.put('/:id', protect, adminOnly, uploadSingle('image'), updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

export default router;
