import mongoose, { Schema } from 'mongoose';

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
      enum: ['eyeglasses', 'sunglasses', 'reading-glasses', 'contact-lenses', 'accessories'],
      required: true,
    },
    frameShape: {
      type: String,
      enum: ['round', 'square', 'rectangle', 'oval', 'cat-eye', 'wayfarer', 'aviator', 'clubmaster'],
    },
    frameMaterial: { type: String, enum: ['metal', 'acetate', 'tr90', 'wood', 'titanium', 'mixed'] },
    frameColor: { type: [String] },
    lensType: { type: String, enum: ['single-vision', 'bifocal', 'progressive', 'non-prescription'] },
    lensCoating: { type: [String], default: [] },
    gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'], default: 'unisex' },
    size: {
      lensWidth: Number,
      bridge: Number,
      templeLength: Number,
      frameWidth: Number,
    },
    weight: { type: String },
    images: { type: [String], default: [] },
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
ProductSchema.index({ type: 1, gender: 1, isActive: 1 });

export default mongoose.model('Product', ProductSchema);
