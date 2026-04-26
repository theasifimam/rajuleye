import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Otp from '../models/otp.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendOTPEmail } from '../utils/sendEmail.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

const generateTokens = (userId, role) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const accessToken = jwt.sign({ id: userId, role }, accessSecret, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY ?? '1d',
  });
  const refreshToken = jwt.sign({ id: userId, role }, refreshSecret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY ?? '7d',
  });
  return { accessToken, refreshToken };
};

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) throw new ApiError(400, 'Name, email and password are required');
  if (password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

  const existing = await User.findOne({ email, isDeleted: false });
  if (existing && existing.isEmailVerified) throw new ApiError(409, 'Email already registered');

  // Upsert unverified user
  let user = existing;
  if (!user) {
    user = new User({ name, email, password });
  } else {
    user.name = name;
    user.password = password;
  }
  await user.save();

  // Generate and store OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + Number(process.env.OTP_EXPIRY_MINUTES ?? 10) * 60 * 1000);
  await Otp.findOneAndDelete({ email, purpose: 'email-verify' });
  await Otp.create({ email, otp, purpose: 'email-verify', expiresAt });

  await sendOTPEmail(email, otp, 'verify');

  res.status(201).json(new ApiResponse('Registration successful. OTP sent to your email.', { email }));
});

// POST /api/v1/auth/verify-email
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new ApiError(400, 'Email and OTP are required');

  const otpDoc = await Otp.findOne({ email, purpose: 'email-verify' });
  if (!otpDoc) throw new ApiError(400, 'OTP expired or not found. Please register again.');

  if (otpDoc.attempts >= 5) {
    await otpDoc.deleteOne();
    throw new ApiError(429, 'Too many failed attempts. Please request a new OTP.');
  }

  const isValid = await otpDoc.compareOTP(otp);
  if (!isValid) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    throw new ApiError(400, `Invalid OTP. ${5 - otpDoc.attempts} attempts remaining.`);
  }

  await otpDoc.deleteOne();

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');

  user.isEmailVerified = true;
  const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);
  user.refreshToken = refreshToken;
  await user.save();

  res
    .cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 24 * 60 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .status(200)
    .json(
      new ApiResponse('Email verified. Welcome!', {
        accessToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      })
    );
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email, isDeleted: false }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password');
  if (!user.isEmailVerified) throw new ApiError(403, 'Please verify your email before logging in');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);
  user.refreshToken = refreshToken;
  await user.save();

  res
    .cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 24 * 60 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .status(200)
    .json(
      new ApiResponse('Login successful', {
        accessToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      })
    );
});

// POST /api/v1/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, 'Email is required');

  const user = await User.findOne({ email, isEmailVerified: true, isDeleted: false });
  if (!user) throw new ApiError(404, 'No verified account with this email');

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + Number(process.env.OTP_EXPIRY_MINUTES ?? 10) * 60 * 1000);
  await Otp.findOneAndDelete({ email, purpose: 'password-reset' });
  await Otp.create({ email, otp, purpose: 'password-reset', expiresAt });

  await sendOTPEmail(email, otp, 'reset');

  res.status(200).json(new ApiResponse('Password reset OTP sent to your email', { email }));
});

// POST /api/v1/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) throw new ApiError(400, 'Email, OTP and new password are required');
  if (newPassword.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

  const otpDoc = await Otp.findOne({ email, purpose: 'password-reset' });
  if (!otpDoc) throw new ApiError(400, 'OTP expired or not found');

  if (otpDoc.attempts >= 5) {
    await otpDoc.deleteOne();
    throw new ApiError(429, 'Too many failed attempts. Please request a new OTP.');
  }

  const isValid = await otpDoc.compareOTP(otp);
  if (!isValid) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    throw new ApiError(400, `Invalid OTP. ${5 - otpDoc.attempts} attempts remaining.`);
  }

  await otpDoc.deleteOne();

  const user = await User.findOne({ email, isDeleted: false });
  if (!user) throw new ApiError(404, 'User not found');

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse('Password reset successful. Please login.', null));
});

// POST /api/v1/auth/refresh-token
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken ?? (req.body).refreshToken;
  if (!token) throw new ApiError(401, 'Refresh token missing');

  const secret = process.env.JWT_REFRESH_SECRET;
  const decoded = jwt.verify(token, secret);

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) throw new ApiError(401, 'Invalid refresh token');

  const { accessToken, refreshToken: newRefresh } = generateTokens(user._id.toString(), user.role);
  user.refreshToken = newRefresh;
  await user.save();

  res
    .cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 24 * 60 * 60 * 1000 })
    .cookie('refreshToken', newRefresh, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .status(200)
    .json(new ApiResponse('Token refreshed', { accessToken }));
});

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, { $unset: { refreshToken: 1 } });
  }
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .status(200)
    .json(new ApiResponse('Logged out successfully', null));
});
