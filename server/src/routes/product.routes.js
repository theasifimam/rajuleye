import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImages,
  uploadArModel,
  deleteArModel,
  getFilterOptions,
} from '../controllers/product.controller.js';
import {
  importProductsFromExcel,
  bulkUploadImages,
} from '../controllers/bulk.controller.js';
import { protect, adminOnly, optionalProtect } from '../middlewares/auth.middleware.js';
import { uploadMultiple, uploadExcel, uploadArModel as uploadArModelMiddleware } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/options/filters', getFilterOptions);
router.get('/', optionalProtect, getProducts);
router.get('/:slug', optionalProtect, getProductBySlug);
router.post('/', protect, adminOnly, createProduct);
router.patch('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/bulk-import', protect, adminOnly, uploadExcel('excel'), importProductsFromExcel);
router.post('/bulk-images', protect, adminOnly, uploadMultiple('images', 50), bulkUploadImages);
router.post('/:id/images', protect, adminOnly, uploadMultiple('images', 6), addProductImages);
router.post('/:id/ar-model', protect, adminOnly, uploadArModelMiddleware('arModel'), uploadArModel);
router.delete('/:id/ar-model', protect, adminOnly, deleteArModel);

export default router;
