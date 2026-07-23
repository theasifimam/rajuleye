import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import Notification from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { sendEmail } from '../utils/sendEmail.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'therajuleye@gmail.com';

// Helper: fire admin notification + email for a new order (non-blocking)
async function notifyNewOrder(order) {
  const shortId = order._id.toString().slice(-8).toUpperCase();
  const body = `Order #${shortId} placed • ₹${order.finalAmount.toFixed(2)} • ${order.paymentMethod.toUpperCase()} • ${order.items.length} item(s)`;

  await Notification.create({
    type: 'order',
    title: `New Order #${shortId}`,
    body,
    refId: order._id.toString(),
    refModel: 'Order',
  });

  const itemRows = order.items
    .map(
      (it) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">${it.name}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${it.qty}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">₹${it.price.toFixed(2)}</td></tr>`
    )
    .join('');

  const html = `<!DOCTYPE html><html><head><style>
    body{font-family:'Segoe UI',sans-serif;background:#f4f4f4;margin:0;padding:0;}
    .c{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1);}
    .h{background:#1a1a2e;padding:32px;text-align:center;}
    .h h1{color:#e2b96f;margin:0;font-size:22px;letter-spacing:1px;}
    .badge{display:inline-block;background:#22c55e22;border:1px solid #22c55e44;color:#22c55e;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-radius:100px;padding:4px 16px;margin-top:12px;}
    .b{padding:36px 32px;}
    .meta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;}
    .mi{flex:1;min-width:110px;background:#f9f9f9;border-radius:10px;padding:12px 16px;}
    .mi label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#888;margin-bottom:4px;}
    .mi p{margin:0;font-size:15px;font-weight:700;color:#1a1a2e;}
    table{width:100%;border-collapse:collapse;}
    th{background:#f0f0f0;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;text-align:left;}
    .tr td{padding:12px;font-weight:700;border-top:2px solid #eee;}
    .f{background:#f9f9f9;padding:16px 32px;text-align:center;color:#aaa;font-size:12px;border-top:1px solid #eee;}
  </style></head><body>
  <div class="c">
    <div class="h"><h1>👓 Rajul Eye</h1><span class="badge">New Order Received</span></div>
    <div class="b">
      <div class="meta">
        <div class="mi"><label>Order ID</label><p>#${shortId}</p></div>
        <div class="mi"><label>Payment</label><p>${order.paymentMethod.toUpperCase()}</p></div>
        <div class="mi"><label>Total</label><p>₹${order.finalAmount.toFixed(2)}</p></div>
      </div>
      <table>
        <thead><tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th></tr></thead>
        <tbody>${itemRows}</tbody>
        <tfoot><tr class="tr"><td colspan="2">Final Amount</td><td style="text-align:right;">₹${order.finalAmount.toFixed(2)}</td></tr></tfoot>
      </table>
    </div>
    <div class="f">© ${new Date().getFullYear()} Rajul Eye. All rights reserved.</div>
  </div>
  </body></html>`;

  sendEmail({ to: ADMIN_EMAIL, subject: `[New Order] #${shortId} — ₹${order.finalAmount.toFixed(2)}`, html }).catch(() => {});
}

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

    const glassPrice = product.price - (product.price * product.discount) / 100;
    const framePrice = item.framePrice || 0;
    const itemPrice = glassPrice + framePrice;
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
      frameId: item.frameId || null,
      frameName: item.frameName || '',
      framePrice: framePrice,
      isPlaneGlass: item.isPlaneGlass || false,
      powerSubmissionMethod: item.powerSubmissionMethod || null,
    });

    // Decrement stock
    await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.qty } });
  }

  const taxAmount = totalAmount * 0.08;
  const finalAmount = totalAmount + taxAmount;

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
    discountAmount: 0,
    finalAmount: finalAmount,
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

      // Fire admin notification + email (non-blocking)
      notifyNewOrder(order).catch(() => {});

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

  // Fire admin notification + email (non-blocking)
  notifyNewOrder(order).catch(() => {});

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

  // Always capture payment details for tracking
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;

  if (!isAuthentic) {
    order.paymentStatus = 'failed';
    order.orderStatus = 'failed'; // Mark as failed since payment failed

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
    }

    await order.save();
    throw new ApiError(400, 'Invalid Payment Signature. Order failed.');
  }

  order.paymentStatus = 'paid';
  order.orderStatus = 'confirmed';
  order.paidAt = new Date();

  await order.save();

  // Clear cart after successful payment verification
  const cart = await Cart.findOne({ user: order.user });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

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
