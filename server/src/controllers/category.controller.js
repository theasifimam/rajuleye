import mongoose from 'mongoose';
import Category from '../models/category.model.js';
import Product from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// GET /api/v1/categories
export const getCategories = asyncHandler(async (req, res) => {
  const { all, parent } = req.query;

  const filter = {};
  if (all !== 'true') filter['isActive'] = true;
  if (parent) {
    filter['parent'] = parent === 'null' ? null : parent;
  }

  const categories = await Category.find(filter)
    .populate('parent', 'name slug')
    .sort('name');

  res.status(200).json(new ApiResponse('Categories fetched', categories));
});

// GET /api/v1/categories/top-nav
export const getTopCategories = asyncHandler(async (_req, res) => {
  const topCategoryCounts = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 4 }
  ]);

  if (!topCategoryCounts.length) {
    res.status(200).json(new ApiResponse('Top categories fetched', []));
    return;
  }

  const categoryIds = topCategoryCounts.map((t) => t._id);
  const rawCategories = await Category.find({ _id: { $in: categoryIds }, isActive: true });

  // Map them back in exact desc order
  const sortedCategories = topCategoryCounts
    .map((t) => rawCategories.find((c) => c._id.equals(t._id)))
    .filter(Boolean);

  res.status(200).json(new ApiResponse('Top categories fetched', sortedCategories));
});

// GET /api/v1/categories/:idOrSlug
export const getCategoryById = asyncHandler(async (req, res) => {
  const idOrSlug = req.params.idOrSlug;
  const isId = mongoose.Types.ObjectId.isValid(idOrSlug);

  const category = await Category.findOne(
    isId ? { _id: idOrSlug } : { slug: idOrSlug }
  ).populate('parent', 'name slug');

  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json(new ApiResponse('Category fetched', category));
});

// GET /api/v1/categories/:id/subcategories
export const getSubcategories = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const categories = await Category.find({ parent: id, isActive: true }).sort('name');
  res.status(200).json(new ApiResponse('Subcategories fetched', categories));
});

// POST /api/v1/categories (admin)
export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, parent, isActive } = req.body;

  if (!name) throw new ApiError(400, 'Name is required');

  const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Check for duplicate slug
  const existing = await Category.findOne({ slug: categorySlug });
  if (existing) throw new ApiError(400, 'Category with this slug already exists');

  const data = { name, slug: categorySlug, isActive };

  if (parent) {
    if (!mongoose.Types.ObjectId.isValid(parent)) throw new ApiError(400, 'Invalid parent ID');
    const parentExists = await Category.findById(parent);
    if (!parentExists) throw new ApiError(400, 'Parent category not found');
    data.parent = parent;
  }

  if (req.file) data.image = `/uploads/${req.file.filename}`;

  const category = await Category.create(data);
  res.status(201).json(new ApiResponse('Category created', category));
});

// PUT /api/v1/categories/:id (admin)
export const updateCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, slug, parent, isActive } = req.body;

  let category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');

  const data = { name, isActive };

  if (slug && slug !== category.slug) {
    const existing = await Category.findOne({ slug, _id: { $ne: id } });
    if (existing) throw new ApiError(400, 'Slug already in use');
    data.slug = slug;
  }

  if (parent !== undefined) {
    if (parent === null || parent === '') {
      data.parent = null;
    } else {
      if (!mongoose.Types.ObjectId.isValid(parent)) throw new ApiError(400, 'Invalid parent ID');
      if (parent === id) throw new ApiError(400, 'A category cannot be its own parent');
      const parentExists = await Category.findById(parent);
      if (!parentExists) throw new ApiError(400, 'Parent category not found');
      data.parent = parent;
    }
  }

  if (req.file) data.image = `/uploads/${req.file.filename}`;

  category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  res.status(200).json(new ApiResponse('Category updated', category));
});

// DELETE /api/v1/categories/:id (admin)
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if category has subcategories
  const hasSubcategories = await Category.exists({ parent: id });
  if (hasSubcategories) {
    throw new ApiError(400, 'Cannot delete category with subcategories');
  }

  // Check if category has products
  const hasProducts = await Product.exists({ category: id });
  if (hasProducts) {
    throw new ApiError(400, 'Cannot delete category with associated products');
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json(new ApiResponse('Category deleted', null));
});
