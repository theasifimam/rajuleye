import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

interface JwtPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken as string;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) throw new ApiError(401, 'Not authorized. No token provided.');

  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new ApiError(500, 'JWT secret not configured');

  const decoded = jwt.verify(token, secret) as JwtPayload;

  const user = await User.findOne({ _id: decoded.id, isDeleted: false }).select('_id role');
  if (!user) throw new ApiError(401, 'User no longer exists or account deleted');

  req.user = { id: decoded.id, role: decoded.role };
  next();
});

export const adminOnly = asyncHandler(async (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'moderator') {
    throw new ApiError(403, 'Access denied. Administrative clearance required.');
  }
  next();
});
