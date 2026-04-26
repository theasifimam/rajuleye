import mongoose, { Schema } from 'mongoose';

const BannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    label: { type: String, trim: true },
    buttonLink: { type: String, trim: true },
    image: { type: String, required: true },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Scheduled'],
      default: 'Active',
    },
    placement: { type: String, default: 'Hero Slider' },
    clicks: { type: Number, default: 0 },
    expiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Banner', BannerSchema);
