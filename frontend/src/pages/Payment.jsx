import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FiCreditCard, FiArrowLeft, FiInfo, FiCheck, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getOrderById, payOrder } from '../features/orders/orderSlice';
import { toast } from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { order, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
      return;
    }

    dispatch(getOrderById(orderId));
  }, [dispatch, orderId, navigate]);

  const handleCashOnDelivery = () => {
    setProcessing(true);

    const paymentResult = {
      id: Date.now().toString(),
      status: 'Pending',
      update_time: new Date().toISOString(),
      payment_method: 'COD',
      email_address: user?.email || 'customer@example.com'
    };

    dispatch(payOrder({ orderId, paymentResult }))
      .unwrap()
      .then(() => {
        toast.success('Order placed successfully!');
        navigate(`/order-success/${orderId}`);
      })
      .catch((err) => {
        toast.error(typeof err === 'string' ? err : 'Payment failed');
        setProcessing(false);
      });
  };

  const handleOnlinePayment = () => {
    setProcessing(true);

    setTimeout(() => {
      const paymentResult = {
        id: `PAY-${Date.now()}`,
        status: 'Completed',
        update_time: new Date().toISOString(),
        payment_method: 'Online',
        email_address: user?.email || 'customer@example.com'
      };

      dispatch(payOrder({ orderId, paymentResult }))
        .unwrap()
        .then(() => {
          toast.success('Payment successful!');
          navigate(`/order-success/${orderId}`);
        })
        .catch((err) => {
          toast.error(typeof err === 'string' ? err : 'Payment failed');
          setProcessing(false);
        });
    }, 2000);
  };


  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className='flex flex-col items-center justify-center gap-4'>
          <CgSpinner fontSize={40} className='text-secondary animate-spin' />
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center bg-white rounded-xl p-8 shadow-sm"
        >
          <div className="inline-flex items-center justify-center bg-red-100 p-4 rounded-full mb-4">
            <FiInfo className="text-2xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Error Loading Order</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-md"
          >
            Back to Orders
          </button>
        </motion.div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center bg-white rounded-xl p-8 shadow-sm"
        >
          <div className="inline-flex items-center justify-center bg-gray-100 p-4 rounded-full mb-4">
            <FiInfo className="text-2xl text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Order Not Found</h2>
          <p className="mb-6 text-gray-600">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/orders')}
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-md"
          >
            Back to Orders
          </button>
        </motion.div>
      </div>
    );
  }

  if (order.isPaid) {
    navigate(`/order-success/${orderId}`);
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Payment</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Summary */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-medium text-gray-900">{order._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({order.orderItems.length})</span>
                  <span>₹{order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={order.shippingPrice === 0 ? 'text-green-600' : ''}>
                    {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{order.taxPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Method */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-900">Payment Method</h2>

              {order.paymentMethod === 'COD' ? (
                <div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <div className="flex items-start">
                      <FiInfo className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">
                        You've selected Cash on Delivery. Please confirm your order below.
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleCashOnDelivery}
                    disabled={processing}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {processing ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin h-5 w-5 mr-2 border-b-2 border-white rounded-full"></span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FiCheck className="mr-2" />
                        Confirm Order
                      </span>
                    )}
                  </motion.button>
                </div>
              ) : (
                <div>
                  <div className="border border-gray-200 rounded-xl p-5 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-lg mr-3">
                        <FiCreditCard className="text-2xl text-primary" />
                      </div>
                      <h3 className="font-medium text-gray-900">Credit/Debit Card</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-gray-700 mb-2 text-sm font-medium">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="1234 5678 9012 3456"
                          disabled={processing}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-gray-700 mb-2 text-sm font-medium">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="MM/YY"
                            disabled={processing}
                          />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-gray-700 mb-2 text-sm font-medium">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="123"
                            disabled={processing}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleOnlinePayment}
                    disabled={processing}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {processing ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin h-5 w-5 mr-2 border-b-2 border-white rounded-full"></span>
                        Processing Payment...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FiDollarSign className="mr-2" />
                        Pay ₹{order.totalPrice.toFixed(2)}
                      </span>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Payment;