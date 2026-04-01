import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Mongoose duplicate key
  if ((err as NodeJS.ErrnoException).name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
    const field = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue ?? {})[0] ?? 'field';
    res.status(409).json({ success: false, message: `${field} already exists` });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values((err as { errors?: Record<string, { message: string }> }).errors ?? {})
      .map((e) => e.message)
      .join(', ');
    res.status(400).json({ success: false, message: messages });
    return;
  }

  // Mongoose CastError (invalid ID)
  if (err.name === 'CastError') {
    res.status(400).json({ success: false, message: `Invalid ${(err as any).path}: ${(err as any).value}` });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token' });
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Token expired' });
    return;
  }

  // Multer errors
  if ((err as any).name === 'MulterError' || (err as any).code?.startsWith('LIMIT_')) {
    const message = (err as any).code === 'LIMIT_FILE_SIZE' ? 'Image size too large (max 10MB)' : err.message;
    res.status(400).json({ success: false, message });
    return;
  }

  // Generic fallback
  console.error('[Global Error Handler]:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};
