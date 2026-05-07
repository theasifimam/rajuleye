import mongoose, { Schema } from 'mongoose';

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    lensType: { type: String },
    lensCoating: { type: [String], default: [] },
    selectedPower: {
      left: { sphere: String, cylinder: String, axis: String },
      right: { sphere: String, cylinder: String, axis: String },
    },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    mobile: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], required: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'placed',
    },
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    notes: { type: String },
    trackingNumber: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Order', OrderSchema);
