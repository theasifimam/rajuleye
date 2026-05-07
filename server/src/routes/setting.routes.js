import express from 'express';
import { getSetting, updateSetting } from '../controllers/setting.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { uploadFields } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', getSetting);
router.put('/', protect, adminOnly, uploadFields([{ name: 'previewImage', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), updateSetting);

export default router;
