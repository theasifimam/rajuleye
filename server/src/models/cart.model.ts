import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  qty: number;
  priceAtAdd: number;
  lensType?: string;
  lensCoating?: string[];
  selectedPower?: {
    left?: { sphere?: number; cylinder?: number; axis?: number };
    right?: { sphere?: number; cylinder?: number; axis?: number };
  };
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1, default: 1 },
    priceAtAdd: { type: Number, required: true },
    lensType: { type: String },
    lensCoating: { type: [String], default: [] },
    selectedPower: {
      left: { sphere: Number, cylinder: Number, axis: Number },
      right: { sphere: Number, cylinder: Number, axis: Number },
    },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<ICart>('Cart', CartSchema);
