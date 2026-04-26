import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import fs from 'fs';
import path from 'path';

// GET /api/v1/products
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = '1', limit = '12', search, type, gender, brand,
    minPrice, maxPrice, frameShape, frameMaterial, category, sort = '-createdAt',
  } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const filter = { isActive: true };
  if (search) filter['$text'] = { $search: search };
  if (type) filter['type'] = type;
  if (gender) filter['gender'] = gender;
  if (category) filter['category'] = category;
  if (brand) filter['brand'] = { $regex: brand, $options: 'i' };
  if (frameShape) filter['frameShape'] = frameShape;
  if (frameMaterial) filter['frameMaterial'] = frameMaterial;
  if (minPrice || maxPrice) {
    filter['price'] = {};
    if (minPrice) (filter['price'])['$gte'] = Number(minPrice);
    if (maxPrice) (filter['price'])['$lte'] = Number(maxPrice);
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select('-__v'),
    Product.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse('Products fetched', {
      products,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

// GET /api/v1/products/:slugOrId
export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  let query = { isActive: true };

  if (mongoose.isValidObjectId(slug)) {
    query = { $or: [{ _id: slug }, { slug: slug }], isActive: true };
  } else {
    query = { slug: slug, isActive: true };
  }

  const product = await Product.findOne(query).populate('category', 'name slug');

  if (!product) throw new ApiError(404, 'Product not found');
  res.status(200).json(new ApiResponse('Product fetched', product));
});

// POST /api/v1/products  (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const data = req.body;
  if (!data.slug) {
    data.slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (!data.sku) {
    data.sku = `RJL-${Date.now()}`;
  }
  const product = await Product.create(data);
  res.status(201).json(new ApiResponse('Product created', product));
});

// PUT /api/v1/products/:id  (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch existing product to evaluate changes in images
  const oldProduct = await Product.findById(id);
  if (!oldProduct) throw new ApiError(404, 'Product not found');

  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) throw new ApiError(404, 'Product not found');

  console.log(req.body.images, 'imageeee');
  // Verify if any images were removed during the update
  if (req.body.images && Array.isArray(req.body.images)) {
    const newImages = req.body.images;
    const removedImages = oldProduct.images.filter((img) => !newImages.includes(img));

    // Physically erase removed image assets from disk
    removedImages.forEach((imgPath) => {
      try {
        const fullPath = path.join(process.cwd(), imgPath.replace(/^\//, ''));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (err) {
        console.error('Failed to unlink deprecated image:', err);
      }
    });
  }

  res.status(200).json(new ApiResponse('Product updated', updatedProduct));
});

// DELETE /api/v1/products/:id  (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params['id']);
  if (!product) throw new ApiError(404, 'Product not found');

  // Actively prune all corresponding artifacts mapped to this product
  if (product.images && product.images.length > 0) {
    product.images.forEach((imgPath) => {
      try {
        const fullPath = path.join(process.cwd(), imgPath.replace(/^\//, ''));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (err) {
        console.error('Failed to unlink wiped product image:', err);
      }
    });
  }

  res.status(200).json(new ApiResponse('Product deleted', null));
});

// POST /api/v1/products/:id/images  (admin – upload)
export const addProductImages = asyncHandler(async (req, res) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new ApiError(400, 'No images provided');
  }

  const paths = req.files.map((f) => `/uploads/${f.filename}`);

  const product = await Product.findByIdAndUpdate(
    req.params['id'],
    { $push: { images: { $each: paths } } },
    { new: true, runValidators: false }
  );

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.status(200).json(new ApiResponse('Images added', product.images));
});
