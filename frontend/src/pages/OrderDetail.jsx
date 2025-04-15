import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiPackage, FiClock, FiMapPin, FiCreditCard, FiPhone, FiTruck, FiDollarSign, FiBox } from 'react-icons/fi';
import { getOrderById } from '../features/orders/orderSlice';
import { CgSpinner } from 'react-icons/cg';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.orders);
  console.log(order);

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusDetails = (isPaid, isDelivered) => {
    if (isDelivered) return {
      text: 'Delivered',
      color: 'bg-green-100 text-green-800',
      icon: <FiTruck className="text-green-500" />
    };
    if (isPaid) return {
      text: 'Shipped',
      color: 'bg-blue-100 text-blue-800',
      icon: <FiPackage className="text-blue-500" />
    };
    return {
      text: 'Processing',
      color: 'bg-yellow-100 text-yellow-800',
      icon: <FiClock className="text-yellow-500" />
    };
  };

  if (loading || !order) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <CgSpinner className='animate-spin text-secondary' fontSize={40} />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const status = getStatusDetails(order.isPaid, order.isDelivered);
  const estimatedDeliveryDate = new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000);
  const formattedDeliveryDate = new Date(estimatedDeliveryDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to Orders
          </button>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.color}`}>
            {status.icon}
            <span className="font-medium">{status.text}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Timeline */}
            <div
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                      <FiCreditCard className="text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Order Placed</h3>
                    <p className="text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                      <FiDollarSign className="text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Payment Status</h3>
                    <p className="text-gray-600">
                      {order.isPaid ?
                        `Paid on ${formatDate(order.paidAt)}` :
                        'Pending payment'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                      <FiTruck className="text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Delivery</h3>
                    <p className="text-gray-600">
                      {order.isDelivered ?
                        `Delivered on ${formatDate(order.deliveredAt)}` :
                        `Estimated delivery: ${formattedDeliveryDate}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                    <FiMapPin className="text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">{order.shippingAddress.street}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <FiPhone className="flex-shrink-0" />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-6">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product}`}
                        className="font-medium text-gray-900 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-600">
                          {item.qty} × ₹{item.price.toFixed(2)}
                        </span>
                        <span className="font-medium">₹{(item.qty * item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
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
                  <span>₹{(order.taxPrice || 0).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {!order.isPaid && order.paymentMethod === 'Online' && (
                <div className="mt-8">
                  <Link
                    to={`/payment/${order._id}`}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <FiCreditCard className="text-lg" />
                    Complete Payment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;