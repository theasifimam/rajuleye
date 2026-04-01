import type { Response } from 'express';
import Banner from '../models/banner.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

// GET /api/v1/banners
export const getBanners = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status, placement } = req.query as Record<string, string | undefined>;

    const filter: Record<string, unknown> = {};
    if (status) filter['status'] = status;
    if (placement) filter['placement'] = placement;

    const banners = await Banner.find(filter).sort('-createdAt');
    res.status(200).json(new ApiResponse('Banners fetched successfully', banners));
});

// GET /api/v1/banners/:id
export const getBannerById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const banner = await Banner.findById(req.params['id']);
    if (!banner) throw new ApiError(404, 'Banner not found');
    res.status(200).json(new ApiResponse('Banner fetched', banner));
});

// POST /api/v1/banners (admin)
export const createBanner = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = { ...req.body };
    if (req.file) {
        data.image = `/uploads/${req.file.filename}`;
    }

    if (!data.image) {
        throw new ApiError(400, 'Image is required');
    }

    const banner = await Banner.create(data);
    res.status(201).json(new ApiResponse('Banner created', banner));
});

// PUT /api/v1/banners/:id (admin)
export const updateBanner = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = { ...req.body };
    if (req.file) {
        data.image = `/uploads/${req.file.filename}`;
    }

    const banner = await Banner.findByIdAndUpdate(req.params['id'], data, {
        new: true,
        runValidators: true,
    });

    if (!banner) throw new ApiError(404, 'Banner not found');
    res.status(200).json(new ApiResponse('Banner updated', banner));
});

// DELETE /api/v1/banners/:id (admin)
export const deleteBanner = asyncHandler(async (req: AuthRequest, res: Response) => {
    const banner = await Banner.findByIdAndDelete(req.params['id']);
    if (!banner) throw new ApiError(404, 'Banner not found');
    res.status(200).json(new ApiResponse('Banner deleted', null));
});
