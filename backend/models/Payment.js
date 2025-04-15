import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['phonepe', 'cod', 'wallet']
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  transactionId: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentGatewayResponse: {
    id: String,
    status: String,
    merchantId: String,
    merchantTransactionId: String,
    responseCode: String,
    responseMessage: String,
    data: mongoose.Schema.Types.Mixed
  },
  errorReason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Payment', PaymentSchema); 