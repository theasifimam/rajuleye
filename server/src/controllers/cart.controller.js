import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// GET /api/v1/cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    'items.product',
    'name slug images price discount stock isActive'
  );
  res.status(200).json(new ApiResponse('Cart fetched', cart ?? { items: [] }));
});

// POST /api/v1/cart/add
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty = 1, lensType, lensCoating, selectedPower } = req.body;

  if (!productId) throw new ApiError(400, 'Product ID is required');

  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found or unavailable');
  if (product.stock < qty) throw new ApiError(400, `Only ${product.stock} items in stock`);

  const finalPrice = product.price - (product.price * product.discount) / 100;

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  const existingItem = cart.items.find((i) => i.product.toString() === productId);
  if (existingItem) {
    existingItem.qty = qty;
    existingItem.priceAtAdd = finalPrice;
    if (lensType) existingItem.lensType = lensType;
    if (lensCoating) existingItem.lensCoating = lensCoating;
    if (selectedPower) existingItem.selectedPower = selectedPower;
  } else {
    cart.items.push({ product: product._id , qty, priceAtAdd: finalPrice, lensType, lensCoating, selectedPower } );
  }

  await cart.save();
  await cart.populate('items.product', 'name slug images price discount stock');
  res.status(200).json(new ApiResponse('Item added to cart', cart));
});

// PUT /api/v1/cart/item/:productId
export const updateCartItem = asyncHandler(async (req, res) => {
  const { qty } = req.body;
  if (!qty || qty < 1) throw new ApiError(400, 'Quantity must be at least 1');

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.find((i) => i.product.toString() === req.params['productId']);
  if (!item) throw new ApiError(404, 'Item not in cart');

  const product = await Product.findById(req.params['productId']);
  if (product && product.stock < qty) throw new ApiError(400, `Only ${product.stock} items in stock`);

  item.qty = qty;
  await cart.save();
  res.status(200).json(new ApiResponse('Cart updated', cart));
});

// DELETE /api/v1/cart/item/:productId
export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter((i) => i.product.toString() !== req.params['productId']);
  await cart.save();
  res.status(200).json(new ApiResponse('Item removed from cart', cart));
});

// DELETE /api/v1/cart/clear
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.status(200).json(new ApiResponse('Cart cleared', null));
});
