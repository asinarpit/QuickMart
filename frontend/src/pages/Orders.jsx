import { useEffect } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FiPackage, FiShoppingBag, FiCalendar, FiClock, FiDollarSign, FiTruck } from 'react-icons/fi';
import { getOrders } from '../features/orders/orderSlice';
import { CgSpinner } from 'react-icons/cg'; 

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrders({ adminView: false }));
  }, [dispatch]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusDetails = (isPaid, isDelivered) => {
    if (isDelivered) return { text: 'Delivered', color: 'bg-green-100 text-green-800' };
    if (isPaid) return { text: 'Shipped', color: 'bg-blue-100 text-blue-800' };
    return { text: 'Processing', color: 'bg-yellow-100 text-yellow-800' };
  };

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center ">
        <div className="flex flex-col items-center justify-center]">
          <CgSpinner className='animate-spin text-secondary' fontSize={40} />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center bg-white rounded-xl p-8 shadow-sm">
          <div className="inline-flex items-center justify-center bg-red-100 p-4 rounded-full mb-4">
            <FiPackage className="text-2xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Error Loading Orders</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => dispatch(getOrders({ adminView: false }))}
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

        
          {orders && orders.length === 0 ? (
            <div
              className="text-center bg-white rounded-xl p-8 shadow-sm"
            >
              <div className="inline-flex items-center justify-center bg-gray-100 p-4 rounded-full mb-4">
                <FiPackage className="text-3xl text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">Your order history will appear here once you make purchases</p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-md"
              >
                <FiShoppingBag className="mr-2" />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = getStatusDetails(order.isPaid, order.isDelivered);
                return (
                  <div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                            {status.text}
                          </span>
                          <span className="text-sm text-gray-500">
                            #{order._id.substring(order._id.length - 6)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiCalendar className="mr-2" />
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <FiDollarSign className="mr-2" />
                            ₹{order.totalPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/order/${order._id}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors"
                      >
                        View Details
                        <FiTruck className="text-lg" />
                      </Link>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Items ({order.orderItems.length})</h4>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {order.orderItems.map((item) => (
                          <div key={item._id} className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
};

export default Orders;