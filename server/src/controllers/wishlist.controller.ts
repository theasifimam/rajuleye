import type { Response } from 'express';
import Wishlist from '../models/wishlist.model.js';
import Product from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

// GET /api/v1/wishlist
export const getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const wishlist = await Wishlist.findOne({ user: req.user!.id }).populate(
    'products',
    'name slug images price discount avgRating type gender isActive'
  );
  res.status(200).json(new ApiResponse('Wishlist fetched', wishlist ?? { products: [] }));
});

// POST /api/v1/wishlist/toggle/:productId
export const toggleWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  let wishlist = await Wishlist.findOne({ user: req.user!.id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user!.id, products: [] });
  }

  const idx = wishlist.products.findIndex((p) => p.toString() === productId);
  let action: string;
  if (idx !== -1) {
    wishlist.products.splice(idx, 1);
    action = 'removed';
  } else {
    wishlist.products.push(product._id as any);
    action = 'added';
  }

  await wishlist.save();
  res.status(200).json(new ApiResponse(`Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist`, { action, productId }));
});
