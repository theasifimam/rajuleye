import express from 'express';
import { getSetting, updateSetting } from '../controllers/setting.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { uploadSingle } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', getSetting);
router.put('/', protect, adminOnly, uploadSingle('previewImage'), updateSetting);

export default router;
