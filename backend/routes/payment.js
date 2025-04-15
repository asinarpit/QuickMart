import express from 'express';
import {
  initiatePayment,
  verifyPayment,
  getPaymentById,
  getPaymentStatus,
  updatePaymentStatus,
  getMyPayments,
  getPayments,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/initiate', protect, initiatePayment);
router.post('/verify', protect, verifyPayment);
router.get('/my-payments', protect, getMyPayments);
router.get('/:id', protect, getPaymentById);
router.get('/status/:transactionId', protect, getPaymentStatus);

router.get('/', protect, authorize('admin'), getPayments);
router.put('/:id/status', protect, authorize('admin'), updatePaymentStatus);

export default router; 