import express from 'express';
import {
  getUserDetails,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  addOrder,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/userDetailsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user details (userId in URL is optional, uses authenticated user)
router.get('/:userId?', getUserDetails);

// Wishlist routes
router.post('/:userId?/wishlist', addToWishlist);
router.delete('/:userId?/wishlist', removeFromWishlist);

// Cart routes
router.post('/:userId?/cart', addToCart);
router.delete('/:userId?/cart', removeFromCart);
router.put('/:userId?/cart', updateCartQuantity);
router.delete('/:userId?/cart/clear', clearCart);

// Order routes
router.post('/:userId?/orders', addOrder);
router.put('/:userId?/orders/:orderId/status', updateOrderStatus);
router.put('/:userId?/orders/:orderId/cancel', cancelOrder);

export default router;

