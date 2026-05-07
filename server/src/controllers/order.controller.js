import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// POST /api/v1/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'cod', notes } = req.body;

  if (!shippingAddress) throw new ApiError(400, 'Shipping address is required');

  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;
    if (!product.isActive) throw new ApiError(400, `Product "${product.name}" is no longer available`);
    if (product.stock < item.qty) throw new ApiError(400, `Insufficient stock for "${product.name}"`);

    const itemPrice = product.price - (product.price * product.discount) / 100;
    totalAmount += itemPrice * item.qty;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] ?? '',
      price: itemPrice,
      qty: item.qty,
      lensType: item.lensType,
      lensCoating: item.lensCoating,
      selectedPower: item.selectedPower,
    });

    // Decrement stock
    await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.qty } });
  }

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
    discountAmount: 0,
    finalAmount: totalAmount,
    notes,
  });

  if (paymentMethod === 'online') {
    const razorpay = new Razorpay({
      key_id: process.env.LIVE_KEY_ID,
      key_secret: process.env.LIVE_KEY_SECRET,
    });

    const options = {
      amount: Math.round(order.finalAmount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${order._id}`,
    };

    try {
      const razorpayOrder = await razorpay.orders.create(options);
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      // Clear cart ONLY after successful Razorpay order generation
      cart.items = [];
      await cart.save();

      res.status(201).json(new ApiResponse('Order placed successfully, proceed to payment', {
        order,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
        key: process.env.LIVE_KEY_ID
      }));
      return;
    } catch (error) {
      // If Razorpay fails, delete the pending order and restore stock, then throw error
      await Order.findByIdAndDelete(order._id);
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
      }
      throw new ApiError(500, 'Failed to initialize payment gateway. Please try again.');
    }
  }

  // For COD, clear cart and return success
  cart.items = [];
  await cart.save();

  res.status(201).json(new ApiResponse('Order placed successfully', { order }));
});

// POST /api/v1/orders/verify-payment
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
  if (!order) throw new ApiError(404, 'Order not found');

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const secret = (process.env.LIVE_KEY_SECRET || '').replace(/["']/g, '').trim();

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    order.paymentStatus = 'failed';
    await order.save();
    throw new ApiError(400, 'Invalid Payment Signature');
  }

  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  order.paymentStatus = 'paid';
  order.orderStatus = 'confirmed';
  order.paidAt = new Date();
  
  await order.save();

  res.status(200).json(new ApiResponse('Payment verified successfully', order));
});

// GET /api/v1/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const { page = '1', limit = '10' } = req.query;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(20, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user.id }).sort('-createdAt').skip(skip).limit(limitNum),
    Order.countDocuments({ user: req.user.id }),
  ]);

  res.status(200).json(
    new ApiResponse('Orders fetched', {
      orders,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

// GET /api/v1/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params['id']).populate('items.product', 'name slug images');
  if (!order) throw new ApiError(404, 'Order not found');

  const isOwner = order.user.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) throw new ApiError(403, 'Not authorized');

  res.status(200).json(new ApiResponse('Order fetched', order));
});

// PATCH /api/v1/orders/:id/cancel
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params['id']);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user.id) throw new ApiError(403, 'Not authorized');

  const cancellable = ['placed', 'confirmed'];
  if (!cancellable.includes(order.orderStatus)) {
    throw new ApiError(400, 'Order cannot be cancelled at this stage');
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
  }

  if (order.paymentStatus === 'paid') {
    // Ideally call Razorpay refund API here
    order.paymentStatus = 'refunded';
  }
  
  order.orderStatus = 'cancelled';
  await order.save();
  res.status(200).json(new ApiResponse('Order cancelled', order));
});

// PATCH /api/v1/orders/:id/status  (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, trackingNumber, paymentStatus } = req.body;

  const order = await Order.findById(req.params['id']);
  if (!order) throw new ApiError(404, 'Order not found');

  if (orderStatus) order.orderStatus = orderStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (orderStatus === 'delivered') order.deliveredAt = new Date();
  if (paymentStatus === 'paid') order.paidAt = new Date();

  await order.save();
  res.status(200).json(new ApiResponse('Order status updated', order));
});

// GET /api/v1/orders  (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = '1', limit = '20', status } = req.query;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (status) filter['orderStatus'] = status;

  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort('-createdAt').skip(skip).limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse('All orders fetched', {
      orders,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});
