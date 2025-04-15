import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);

router.get('/:id', getProductById);

router.post('/', protect, authorize('admin'), createProduct);

router.put('/:id', protect, authorize('admin'), updateProduct);

router.delete('/:id', protect, authorize('admin'), deleteProduct);

router.post('/:id/reviews', protect, createProductReview);

router.put('/:id/reviews/:reviewId', protect, updateProductReview);

router.delete('/:id/reviews/:reviewId', protect, deleteProductReview);

export default router; 