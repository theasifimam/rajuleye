import mongoose, { Schema } from 'mongoose';

const CartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1, default: 1 },
    priceAtAdd: { type: Number, required: true },
    lensType: { type: String },
    lensCoating: { type: [String], default: [] },
    selectedPower: {
      left: { sphere: String, cylinder: String, axis: String },
      right: { sphere: String, cylinder: String, axis: String },
    },
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Cart', CartSchema);
