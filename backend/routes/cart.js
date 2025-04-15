import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getCart);

router.post('/', protect, addToCart);

router.put('/:productId', protect, updateCartItemQuantity);

router.delete('/:productId', protect, removeFromCart);

router.delete('/', protect, clearCart);

export default router; 