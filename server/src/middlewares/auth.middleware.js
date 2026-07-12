import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) throw new ApiError(401, 'Not authorized. No token provided.');

  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new ApiError(500, 'JWT secret not configured');

  const decoded = jwt.verify(token, secret);

  const user = await User.findOne({ _id: decoded.id, isDeleted: false }).select('_id role');
  if (!user) throw new ApiError(401, 'User no longer exists or account deleted');

  req.user = { id: decoded.id, role: decoded.role };
  next();
});

export const adminOnly = asyncHandler(async (req, _res, next) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'moderator') {
    throw new ApiError(403, 'Access denied. Administrative clearance required.');
  }
  next();
});

export const optionalProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const secret = process.env.JWT_ACCESS_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret);
        const user = await User.findOne({ _id: decoded.id, isDeleted: false }).select('_id role');
        if (user) {
          req.user = { id: decoded.id, role: decoded.role };
        }
      }
    } catch (err) {
      // Ignore errors, proceed as unauthenticated
    }
  }
  next();
});
