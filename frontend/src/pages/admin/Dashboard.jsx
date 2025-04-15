import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { FiUsers, FiShoppingBag, FiDollarSign, FiPackage, FiArrowRight } from 'react-icons/fi';
import { getOrders } from '../../features/orders/orderSlice';
import { getProducts } from '../../features/products/productSlice';
import { CgSpinner } from 'react-icons/cg'

const Dashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { products, loading: productsLoading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: []
  });

  useEffect(() => {
    dispatch(getOrders({ adminView: true }));
    dispatch(getProducts({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (orders && products) {
      const totalRevenue = orders.reduce((sum, order) => sum + (order.isPaid ? order.totalPrice : 0), 0);
      const totalOrders = orders.length;
      const totalProducts = products.length;

      const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const productSales = {};
      orders.forEach(order => {
        if (order.isPaid) {
          order.orderItems.forEach(item => {
            if (!productSales[item.product]) {
              productSales[item.product] = {
                id: item.product,
                name: item.name,
                image: item.image,
                quantity: 0,
                revenue: 0
              };
            }
            productSales[item.product].quantity += Number(item.qty) || 0;
            productSales[item.product].revenue += Number(item.price) * Number(item.qty) || 0;
          });
        }
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        recentOrders,
        topProducts
      });
    }
  }, [orders, products]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

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

  if (ordersLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[80vh]">
        <CgSpinner className='animate-spin text-primary text-4xl' />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold">Welcome back, {user?.name}!</h2>
        <p className="text-gray-600 mt-2">Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-50 text-primary mr-4">
              <FiDollarSign className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
              <FiShoppingBag className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
              <FiPackage className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Products</p>
              <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
              <FiUsers className="text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">New Users</p>
              <h3 className="text-2xl font-bold">-</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary flex items-center hover:underline">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link to={`/admin/order/${order._id}`} className="text-primary hover:underline">
                        #{order._id.substring(order._id.length - 6)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(order.isPaid, order.isDelivered)}`}>
                        {getStatusText(order.isPaid, order.isDelivered)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      ₹{order.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Top Selling Products</h2>
            <Link to="/admin/products" className="text-primary flex items-center hover:underline">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {stats.topProducts.map((product) => (
              <div key={product.id} className="flex items-center">
                <div className="w-12 h-12 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">
                    <Link to={`/admin/product/${product.id}/edit`} className="hover:text-primary">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm">{product.quantity} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <div className="py-6 text-center text-gray-500">
                No product sales data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 