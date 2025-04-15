import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheckCircle, FiPackage, FiClock, FiShoppingBag, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { getOrderById } from '../features/orders/orderSlice';
import { motion } from 'framer-motion';
import { CgSpinner } from 'react-icons/cg';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (loading || !order) {

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className='flex flex-col items-center justify-center gap-4'>
          <CgSpinner fontSize={40} className='text-secondary animate-spin' />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );

  }

  const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Success Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center bg-primary bg-opacity-10 p-6 rounded-full mb-6"
          >
            <FiCheckCircle className="text-primary text-6xl" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-6">
            Your order #{order._id.substring(order._id.length - 6)} is being processed
          </p>
          <div className="flex items-center justify-center text-secondary gap-2 mb-8">
            <FiClock className="text-xl" />
            <span className="font-medium">Estimated Delivery: {formattedDeliveryDate}</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Order Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-8 border border-gray-100"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                <FiMapPin className="text-primary text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Shipping Address</h3>
                <div className="text-gray-600 space-y-1">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}</p>
                  <p>{order.shippingAddress.state}, {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                <FiDollarSign className="text-primary text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={order.shippingPrice === 0 ? 'text-green-600' : ''}>
                      {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span className="text-primary">₹{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-8 border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Items</h3>
            <div className="space-y-6">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{item.qty} × ₹{item.price.toFixed(2)}</span>
                      <span>₹{(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-md"
          >
            <FiPackage className="text-lg" />
            View Order History
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium border border-gray-200 hover:border-primary transition-colors"
          >
            <FiShoppingBag className="text-lg" />
            Continue Shopping
          </Link>
        </motion.div>

        {/* Reassurance Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-sm text-gray-600"
        >
          <p>You'll receive an order confirmation email shortly.</p>
          <p>Need help? <Link to="/contact" className="text-primary hover:underline">Contact our support team</Link></p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;