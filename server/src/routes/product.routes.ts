import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImages,
} from '../controllers/product.controller.js';
import {
  importProductsFromExcel,
  bulkUploadImages,
} from '../controllers/bulk.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { uploadMultiple, uploadExcel } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', protect, adminOnly, createProduct);
router.patch('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/bulk-import', protect, adminOnly, uploadExcel('excel'), importProductsFromExcel);
router.post('/bulk-images', protect, adminOnly, uploadMultiple('images', 50), bulkUploadImages);
router.post('/:id/images', protect, adminOnly, uploadMultiple('images', 6), addProductImages);

export default router;
