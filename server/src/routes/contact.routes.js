import express from 'express';
import { submitContact, getContacts } from '../controllers/contact.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public — web/mobile contact form
router.post('/', submitContact);

// Admin — view all contact submissions
router.get('/', protect, adminOnly, getContacts);

export default router;
