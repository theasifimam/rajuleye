import User from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import Otp from '../models/otp.model.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendOTPEmail } from '../utils/sendEmail.js';

// GET /api/v1/users/profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'name slug images price discount');
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json(new ApiResponse('Profile fetched', user));
});

// PATCH /api/v1/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, mobile, gender, dateOfBirth } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  if (name) user.name = name;
  if (mobile) user.mobile = mobile;
  if (gender) user.gender = gender;
  if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);

  // Handle avatar upload
  if (req.file) {
    user.avatar = `/uploads/${req.file.filename}`;
  }

  await user.save();
  res.status(200).json(new ApiResponse('Profile updated', user));
});

// PATCH /api/v1/users/eye-power
export const updateEyePower = asyncHandler(async (req, res) => {
  const { left, right } = req.body;
  if (!left || !right) throw new ApiError(400, 'Eye power data required');

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { eyePower: { left, right } },
    { new: true, runValidators: true }
  );
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json(new ApiResponse('Eye power updated', user.eyePower));
});

// POST /api/v1/users/addresses
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  const addressData = req.body;

  // If new address is default, remove default from others
  if (addressData.isDefault) {
    user.addresses.forEach((a) => { a.isDefault = false; });
  }

  // If first address, auto set as default
  if (user.addresses.length === 0) {
    addressData.isDefault = true;
  }

  user.addresses.push(addressData );
  await user.save();
  res.status(201).json(new ApiResponse('Address added', user.addresses));
});

// PUT /api/v1/users/addresses/:addressId
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  const addr = user.addresses.find((a) => a._id?.toString() === req.params['addressId']);
  if (!addr) throw new ApiError(404, 'Address not found');

  const updates = req.body;

  if (updates.isDefault) {
    user.addresses.forEach((a) => { a.isDefault = false; });
  }

  Object.assign(addr, updates);
  await user.save();
  res.status(200).json(new ApiResponse('Address updated', user.addresses));
});

// DELETE /api/v1/users/addresses/:addressId
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  const idx = user.addresses.findIndex((a) => a._id?.toString() === req.params['addressId']);
  if (idx === -1) throw new ApiError(404, 'Address not found');

  user.addresses.splice(idx, 1);
  await user.save();
  res.status(200).json(new ApiResponse('Address deleted', user.addresses));
});

// POST /api/v1/users/request-delete
export const requestAccountDeletion = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + Number(process.env.OTP_EXPIRY_MINUTES ?? 10) * 60 * 1000);

  await Otp.findOneAndDelete({ email: user.email, purpose: 'account-deletion' });
  await Otp.create({ email: user.email, otp, purpose: 'account-deletion', expiresAt });

  await sendOTPEmail(user.email, otp, 'delete');

  res.status(200).json(new ApiResponse('Deletion OTP sent to your email', { email: user.email }));
});

// DELETE /api/v1/users/account
export const deleteAccount = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  if (!otp) throw new ApiError(400, 'OTP is required for account deletion');

  const otpDoc = await Otp.findOne({ email: user.email, purpose: 'account-deletion' });
  if (!otpDoc) throw new ApiError(400, 'OTP expired or not found. Please request a new one.');

  const isValid = await otpDoc.compareOTP(otp);
  if (!isValid) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    if (otpDoc.attempts >= 5) {
      await otpDoc.deleteOne();
      throw new ApiError(429, 'Too many failed attempts. Please request a new OTP.');
    }
    throw new ApiError(400, `Invalid OTP. ${5 - otpDoc.attempts} attempts remaining.`);
  }

  await otpDoc.deleteOne();

  // Soft deletion & Email renaming
  const originalEmail = user.email;
  user.email = `${originalEmail}_deleted_${Date.now()}`;
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.refreshToken = undefined;
  await user.save();

  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .status(200)
    .json(new ApiResponse('Account deleted successfully', null));
});

// GET /api/v1/users  (admin)
export const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find({}).select('-refreshToken');
  res.status(200).json(new ApiResponse('Users fetched', users));
});

// GET /api/v1/users/:id (admin)
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params['id']).select('-refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json(new ApiResponse('User fetched', user));
});

// PATCH /api/v1/users/:id (admin)
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params['id'],
    { $set: req.body },
    { new: true, runValidators: true }
  ).select('-refreshToken');

  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json(new ApiResponse('User updated by admin', user));
});

// POST /api/v1/users (admin)
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, isEmailVerified } = req.body;

  if (!name || !email) throw new ApiError(400, 'Name and email are required');

  // If no password provided, generate a secure random one
  const finalPassword = password || Math.random().toString(36).slice(-10) + 'A1@';

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    isEmailVerified: isEmailVerified ?? true,
  });

  const userResponse = await User.findById(user._id).select('-refreshToken');
  res.status(201).json(new ApiResponse('User created by admin', userResponse));
});

// DELETE /api/v1/users/:id (admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const targetId = req.params['id'];
  if (req.user.id !== targetId && req.user.role !== 'admin') {
    throw new ApiError(403, 'You do not have permission to delete this user');
  }

  const user = await User.findById(targetId);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.isDeleted) throw new ApiError(400, 'User is already deleted');

  // Soft deletion & Email renaming
  const originalEmail = user.email;
  user.email = `${originalEmail}_deleted_${Date.now()}`;
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.refreshToken = undefined;
  await user.save();

  res.status(200).json(new ApiResponse('User account deleted and archived successfully', user));
});
