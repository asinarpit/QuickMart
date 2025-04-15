import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import crypto from 'crypto';

const generateTransactionId = () => {
  return `TXN_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
};

export const initiatePayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;

    if (!orderId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, amount and payment method are required'
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const existingPayment = await Payment.findOne({ 
      order: orderId,
      status: { $in: ['completed', 'pending'] }
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment already initiated for this order'
      });
    }

    const transactionId = generateTransactionId();
    
    const payment = await Payment.create({
      user: req.user._id,
      order: orderId,
      paymentMethod,
      amount,
      transactionId,
      status: 'pending',
      paymentGatewayResponse: {
        merchantId: 'BLINKIT_CLONE_123',
        merchantTransactionId: transactionId,
        status: 'PENDING'
      }
    });

    return res.status(200).json({
      success: true,
      payment: {
        id: payment._id,
        transactionId,
        amount,
        paymentMethod,
        status: 'pending',
        redirectUrl: `/payment/phonepe/${transactionId}`
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { transactionId, paymentStatus } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required'
      });
    }

    
    const payment = await Payment.findOne({ transactionId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already verified'
      });
    }

    const status = paymentStatus || (Math.random() > 0.2 ? 'completed' : 'failed');
    payment.status = status;
    payment.updatedAt = Date.now();
    payment.paymentGatewayResponse = {
      ...payment.paymentGatewayResponse,
      status: status.toUpperCase(),
      responseCode: status === 'completed' ? 'S01' : 'E01',
      responseMessage: status === 'completed' ? 'Payment successful' : 'Payment failed'
    };

    await payment.save();

    if (status === 'completed') {
      const order = await Order.findById(payment.order);
      
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: payment._id,
          status: 'completed',
          update_time: new Date().toISOString(),
          email_address: req.user.email
        };
        order.orderStatus = 'Confirmed';
        
        await order.save();
      }
    }

    return res.status(200).json({
      success: true,
      payment: {
        id: payment._id,
        transactionId,
        status: payment.status,
        paymentGatewayResponse: payment.paymentGatewayResponse
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('order');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const payment = await Payment.findOne({ transactionId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    return res.status(200).json({
      success: true,
      status: payment.status,
      payment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    await payment.save();

    if (status === 'completed') {
      await Order.findByIdAndUpdate(payment.order, {
        isPaid: true,
        paidAt: Date.now(),
      });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).populate('order');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).populate('order user', 'name email');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 