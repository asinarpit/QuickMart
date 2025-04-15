import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { toast } from 'react-hot-toast';
import { FiSearch, FiEye, FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import { getOrders, updateOrderDeliveryStatus } from '../../features/orders/orderSlice';

const OrderList = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    setFetchError(null);

    dispatch(getOrders({ adminView: true }))
      .unwrap()
      .then((data) => {
        console.log('Orders fetched successfully:', data);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setFetchError(err || 'Failed to fetch orders');
        toast.error(err || 'Failed to fetch orders');
      });
  }, [dispatch]);

  useEffect(() => {
    if (!orders) {
      setFilteredOrders([]);
      return;
    }

    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.shippingAddress?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'processing':
          filtered = filtered.filter(order => !order.isPaid);
          break;
        case 'shipped':
          filtered = filtered.filter(order => order.isPaid && !order.isDelivered);
          break;
        case 'delivered':
          filtered = filtered.filter(order => order.isDelivered);
          break;
        default:
          break;
      }
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const handleMarkDelivered = (id) => {
    if (window.confirm('Mark this order as delivered?')) {
      dispatch(updateOrderDeliveryStatus(id))
        .unwrap()
        .then(() => {
          toast.success('Order marked as delivered successfully');
        })
        .catch((err) => {
          toast.error(err || 'Failed to update delivery status');
        });
    }
  };



  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusBadgeClass = (isPaid, isDelivered) => {
    if (isDelivered) return 'bg-green-100 text-green-800';
    if (isPaid) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (isPaid, isDelivered) => {
    if (isDelivered) return 'Delivered';
    if (isPaid) return 'Shipped';
    return 'Processing';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search orders by ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="min-w-[200px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading && (
          <div className="p-4 bg-blue-50 text-center">
            <div className="animate-spin inline-block h-6 w-6 border-t-2 border-b-2 border-blue-600 rounded-full mr-2"></div>
            <span>Loading orders...</span>
          </div>
        )}

        {fetchError && (
          <div className="p-4 bg-red-50 text-red-700 flex items-center justify-center">
            <FiAlertTriangle className="mr-2" />
            <span>Error: {fetchError}</span>
          </div>
        )}

        {!loading && !fetchError && filteredOrders.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-medium mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'There are no orders in the system yet.'}
            </p>
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/admin/order/${order._id}`} className="text-primary hover:underline">
                          #{order._id.substring(order._id.length - 6)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.name || order.shippingAddress?.fullName || 'Unknown'}
                        </div>
                        {order.user?.email && (
                          <div className="text-sm text-gray-500">{order.user.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        ₹{order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.isPaid, order.isDelivered)}`}>
                          {getStatusText(order.isPaid, order.isDelivered)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.isPaid ? (
                          <div>
                            <span className="text-green-600">Paid</span>
                            <div className="text-xs text-gray-500">{formatDate(order.paidAt)}</div>
                          </div>
                        ) : (
                          <span className="text-red-600">Not Paid</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link to={`/order/${order._id}`} className="text-gray-600 hover:text-gray-900 p-1">
                            <FiEye className="h-5 w-5" />
                          </Link>

                          {order.isPaid && !order.isDelivered ? (
                            <button
                              onClick={() => handleMarkDelivered(order._id)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Mark as Delivered"
                            >
                              <FiCheckCircle className="h-5 w-5" />
                            </button>
                          ) : (
                            <button disabled className="text-gray-300 p-1 cursor-not-allowed">
                              <FiCheckCircle className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      {searchTerm || statusFilter !== 'all'
                        ? 'No orders found matching your criteria.'
                        : 'No orders found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastOrder > filteredOrders.length ? filteredOrders.length : indexOfLastOrder}
                  </span>{' '}
                  of <span className="font-medium">{filteredOrders.length}</span> results
                </p>
              </div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium 
                    ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium 
                      ${currentPage === number + 1
                        ? 'z-10 bg-primary border-primary text-white'
                        : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {number + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium 
                    ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList; 