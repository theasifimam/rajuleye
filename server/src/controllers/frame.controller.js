import Frame from '../models/frame.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// GET /api/v1/frames  (public - for web storefront)
export const getFrames = asyncHandler(async (req, res) => {
  const filter = {};
  // Admin can see all, public only sees active
  if (req.user?.role !== 'admin' && req.user?.role !== 'moderator') {
    filter.isActive = true;
  }
  const frames = await Frame.find(filter).sort({ sortOrder: 1, createdAt: 1 });
  res.status(200).json(new ApiResponse('Frames fetched', frames));
});

// POST /api/v1/frames  (admin)
export const createFrame = asyncHandler(async (req, res) => {
  const { name, description, price, discount, isActive, sortOrder } = req.body;
  if (!name || price === undefined) throw new ApiError(400, 'Name and price are required');

  const frame = await Frame.create({ name, description, price, discount, isActive, sortOrder });
  res.status(201).json(new ApiResponse('Frame created', frame));
});

// PATCH /api/v1/frames/:id  (admin)
export const updateFrame = asyncHandler(async (req, res) => {
  const frame = await Frame.findById(req.params['id']);
  if (!frame) throw new ApiError(404, 'Frame not found');

  const { name, description, price, discount, isActive, sortOrder } = req.body;
  if (name !== undefined) frame.name = name;
  if (description !== undefined) frame.description = description;
  if (price !== undefined) frame.price = price;
  if (discount !== undefined) frame.discount = discount;
  if (isActive !== undefined) frame.isActive = isActive;
  if (sortOrder !== undefined) frame.sortOrder = sortOrder;

  await frame.save();
  res.status(200).json(new ApiResponse('Frame updated', frame));
});

// DELETE /api/v1/frames/:id  (admin)
export const deleteFrame = asyncHandler(async (req, res) => {
  const frame = await Frame.findByIdAndDelete(req.params['id']);
  if (!frame) throw new ApiError(404, 'Frame not found');
  res.status(200).json(new ApiResponse('Frame deleted', null));
});
