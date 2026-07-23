import mongoose from 'mongoose';
import Review from '../models/review.model.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import Notification from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { sendEmail } from '../utils/sendEmail.js';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'therajuleye@gmail.com';

// GET /api/v1/reviews/product/:productId
export const getProductReviews = asyncHandler(async (req, res) => {
  const { page = '1', limit = '10' } = req.query;
  const productId = req.params['productId'];
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(20, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const [reviews, total] = await Promise.all([
    Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum),
    Review.countDocuments({ product: productId }),
  ]);

  res.status(200).json(
    new ApiResponse('Reviews fetched', {
      reviews,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

// POST /api/v1/reviews
export const createReview = asyncHandler(async (req, res) => {
  const { productId, orderId, rating, title, comment } = req.body;

  if (!productId || !orderId || !rating || !comment) {
    throw new ApiError(400, 'productId, orderId, rating and comment are required');
  }

  const productObjectId = new mongoose.Types.ObjectId(productId);
  const orderObjectId = new mongoose.Types.ObjectId(orderId);
  const userObjectId = new mongoose.Types.ObjectId(req.user.id);

  // Verify delivered order containing this product by this user
  const order = await Order.findOne({
    _id: orderObjectId,
    user: userObjectId,
    orderStatus: 'delivered',
    'items.product': productObjectId,
  });
  if (!order) throw new ApiError(403, 'You can only review products from delivered orders');

  // Check existing review
  const existing = await Review.findOne({ user: userObjectId, product: productObjectId });
  if (existing) throw new ApiError(409, 'You have already reviewed this product');

  const images = req.files
    ? req.files.map((f) => `/uploads/${f.filename}`)
    : [];

  const reviewData = {
    user: req.user.id,
    product: productId,
    order: orderId,
    rating,
    comment,
    images,
    isVerifiedPurchase: true,
  };
  if (title) reviewData['title'] = title;

  const review = await Review.create(reviewData);

  // Update product avg rating
  const stats = await Review.aggregate([
    { $match: { product: productObjectId } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      avgRating: Math.round(stats[0].avg * 10) / 10,
      totalReviews: stats[0].count,
    });
  }

  const populated = await Review.findById(review._id).populate('user', 'name avatar');

  // Fire admin notification + email (non-blocking)
  (() => {
    const stars = '★'.repeat(Number(rating)) + '☆'.repeat(5 - Number(rating));
    const body = `${stars} rated by user on product — "${(comment || '').slice(0, 100)}${comment?.length > 100 ? '…' : ''}")`;
    Notification.create({
      type: 'review',
      title: `New Review — ${stars}`,
      body,
      refId: review._id.toString(),
      refModel: 'Review',
    }).catch(() => {});

    const html = `<!DOCTYPE html><html><head><style>
      body{font-family:'Segoe UI',sans-serif;background:#f4f4f4;margin:0;padding:0;}
      .c{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1);}
      .h{background:#1a1a2e;padding:32px;text-align:center;}
      .h h1{color:#e2b96f;margin:0;font-size:22px;letter-spacing:1px;}
      .badge{display:inline-block;background:#f59e0b22;border:1px solid #f59e0b44;color:#f59e0b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-radius:100px;padding:4px 16px;margin-top:12px;}
      .b{padding:36px 32px;}
      .stars{font-size:28px;margin-bottom:16px;}
      .comment{background:#f9f9f9;border-radius:10px;padding:16px 20px;border-left:3px solid #f59e0b;color:#333;font-size:14px;line-height:1.6;margin-top:12px;}
      .f{background:#f9f9f9;padding:16px 32px;text-align:center;color:#aaa;font-size:12px;border-top:1px solid #eee;}
    </style></head><body>
    <div class="c">
      <div class="h"><h1>👓 Rajul Eye</h1><span class="badge">New Review / Complaint</span></div>
      <div class="b">
        <div class="stars">${stars}</div>
        <p style="margin:0;font-size:13px;color:#888;">Product ID: ${productId}</p>
        <div class="comment">${(comment || '').replace(/\n/g, '<br/>')}</div>
      </div>
      <div class="f">© ${new Date().getFullYear()} Rajul Eye. All rights reserved.</div>
    </div>
    </body></html>`;
    sendEmail({ to: ADMIN_EMAIL, subject: `[New Review] ${stars} — Product Review`, html }).catch(() => {});
  })();

  res.status(201).json(new ApiResponse('Review submitted', populated));
});

// DELETE /api/v1/reviews/:id
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params['id']);
  if (!review) throw new ApiError(404, 'Review not found');

  const isOwner = review.user.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) throw new ApiError(403, 'Not authorized to delete this review');

  const productId = review.product;
  const productObjectId = new mongoose.Types.ObjectId(productId);
  await review.deleteOne();

  // Recalculate product rating
  const stats = await Review.aggregate([
    { $match: { product: productObjectId } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  await Product.findByIdAndUpdate(productId, {
    avgRating: stats.length > 0 ? Math.round(stats[0].avg * 10) / 10 : 0,
    totalReviews: stats.length > 0 ? stats[0].count : 0,
  });

  res.status(200).json(new ApiResponse('Review deleted', null));
});
