import mongoose, { Schema } from 'mongoose';
import {
  PRODUCT_TYPES,
  GENDERS,
  STYLES,
  USAGES,
  FACE_SHAPES,
  MATERIALS,
  LENS_FEATURES,
  FRAME_TYPES,
  FITS
} from '../utils/constants.js';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    brand: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    type: {
      type: String,
      enum: PRODUCT_TYPES,
      required: true,
    },
    gender: { type: [{ type: String, enum: GENDERS }], default: ['unisex'] },
    styles: { type: [{ type: String, enum: STYLES }], default: [] },
    usage: { type: [{ type: String, enum: USAGES }], default: [] },
    faceShapes: { type: [{ type: String, enum: FACE_SHAPES }], default: [] },
    materials: { type: [{ type: String, enum: MATERIALS }], default: [] },
    colors: { type: [String], default: [] },
    lensFeatures: { type: [{ type: String, enum: LENS_FEATURES }], default: [] },
    frameType: { type: String, enum: FRAME_TYPES },
    fit: { type: String, enum: FITS },
    
    // Legacy support fields
    frameShape: { type: String },
    frameMaterial: { type: String },
    frameColor: { type: [String] },
    lensType: { type: String },
    lensCoating: { type: [String] },
    
    size: {
      lensWidth: Number,
      bridge: Number,
      templeLength: Number,
      frameWidth: Number,
    },
    weight: { type: String },
    images: { type: [String], default: [] },
    arModelUrl: { type: String, default: null }, // Path to uploaded GLB/GLTF AR glasses model
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
ProductSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });
// Advanced filtering indexes
ProductSchema.index({ type: 1, isActive: 1 });
ProductSchema.index({ gender: 1 });
ProductSchema.index({ styles: 1 });
ProductSchema.index({ materials: 1 });
ProductSchema.index({ price: 1 });

export default mongoose.model('Product', ProductSchema);
