import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 120 },
    comment: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    isVerifiedPurchase: { type: Boolean, default: true },
    helpfulVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One review per product per user
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });
ReviewSchema.index({ product: 1 });

export default mongoose.model('Review', ReviewSchema);
