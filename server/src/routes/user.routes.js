import express from 'express';
import {
  getProfile,
  updateProfile,
  updateEyePower,
  addAddress,
  updateAddress,
  deleteAddress,
  deleteAccount,
  requestAccountDeletion,
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { uploadSingle } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.patch('/profile', uploadSingle('avatar'), updateProfile);
router.patch('/eye-power', (req, res, next) => {
  console.log("HIT /eye-power ROUTE", req.body);
  next();
}, updateEyePower);
router.post('/addresses', addAddress);
router.patch('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.post('/request-delete', requestAccountDeletion);
router.delete('/account', deleteAccount);

// Admin
router.get('/', adminOnly, getAllUsers);
router.post('/', adminOnly, createUser);
router.get('/:id', adminOnly, getUserById);
router.patch('/:id', adminOnly, updateUser);
router.delete('/:id', adminOnly, deleteUser);

export default router;
