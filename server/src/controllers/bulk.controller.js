import * as xlsx from 'xlsx';
import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import fs from 'fs';

/**
 * Bulk import products from Excel
 * Supports creating new products and updating existing ones by SKU
 * Can also match images by SKU if they are provided in the request or already uploaded
 */
export const importProductsFromExcel = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, 'No Excel file provided');
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new ApiError(400, 'Excel file is empty');

    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) throw new ApiError(400, 'Worksheet not found');

    const data = xlsx.utils.sheet_to_json(worksheet);

    // Fetch all categories for matching by name
    const categories = await Category.find({});
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c._id]));

    const results = {
        created: 0,
        updated: 0,
        failed: 0,
        errors: []
    };

    for (const row of data) {
        try {
            const sku = row.sku || row.SKU;
            if (!sku) {
                results.failed++;
                results.errors.push({ row, error: 'SKU is missing' });
                continue;
            }

            const categoryName = row.category || row.Category;
            const categoryId = categoryMap.get(categoryName?.toString().toLowerCase());

            if (categoryName && !categoryId) {
                results.failed++;
                results.errors.push({ sku, error: `Category "${categoryName}" not found` });
                continue;
            }

            const productData = {
                name: row.name || row.Name,
                description: row.description || row.Description,
                brand: row.brand || row.Brand || 'Rajul Eye',
                sku: sku.toString().toUpperCase(),
                category: categoryId,
                type: (row.type || row.Type || 'eyeglasses').toLowerCase(),
                price: Number(row.price || row.Price || 0),
                stock: Number(row.stock || row.Stock || 0),
                discount: Number(row.discount || row.Discount || 0),
                isActive: row.isActive !== undefined ? row.isActive : true,
                gender: (row.gender || row.Gender || 'unisex').toLowerCase(),
                frameShape: row.frameShape || row.FrameShape,
                frameMaterial: row.frameMaterial || row.FrameMaterial,
                frameColor: row.frameColor || row.FrameColor,
                lensType: row.lensType || row.LensType,
                tags: row.tags ? row.tags.toString().split(',').map((t) => t.trim()) : [],
            };

            // Handle images if provided as comma separated links in Excel
            if (row.images) {
                productData.images = row.images.toString().split(',').map((img) => img.trim());
            }

            // Handle nested size object if columns exist
            if (row.lensWidth || row.bridge || row.templeLength || row.frameWidth) {
                productData.size = {
                    lensWidth: Number(row.lensWidth || 0),
                    bridge: Number(row.bridge || 0),
                    templeLength: Number(row.templeLength || 0),
                    frameWidth: Number(row.frameWidth || 0),
                };
            }

            // Upsert by SKU
            const existingProduct = await Product.findOne({ sku: productData.sku });
            if (existingProduct) {
                Object.assign(existingProduct, productData);
                await existingProduct.save();
                results.updated++;
            } else {
                // Generate slug if not provided
                if (!productData.slug) {
                    productData.slug = productData.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                }
                await Product.create(productData);
                results.created++;
            }
        } catch (err) {
            results.failed++;
            results.errors.push({ sku: row.sku, error: err.message });
        }
    }

    // Cleanup uploaded excel file
    if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }

    res.status(200).json(new ApiResponse('Bulk import completed', results));
});

/**
 * Bulk upload images and potentially match them to products by filename (SKU)
 */
export const bulkUploadImages = asyncHandler(async (req, res) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new ApiError(400, 'No images provided');
    }

    const uploadResults = req.files.map(f => ({
        originalName: f.originalname,
        url: `/uploads/${f.filename}`,
        sku: f.originalname.split('.')[0]?.split('_')[0] // Extract SKU from filename (e.g. SKU123_1.jpg -> SKU123)
    }));

    // Optional find and update products if SKU matches
    // This could be a separate flag or always on
    const shouldAutoMatch = req.query['autoMatch'] === 'true';

    let matched = 0;
    if (shouldAutoMatch) {
        for (const item of uploadResults) {
            if (item.sku) {
                const product = await Product.findOneAndUpdate(
                    { sku: item.sku.toUpperCase() },
                    { $push: { images: item.url } },
                    { new: true }
                );
                if (product) matched++;
            }
        }
    }

    res.status(200).json(new ApiResponse('Images uploaded successfully', {
        uploads: uploadResults,
        autoMatched: matched
    }));
});
