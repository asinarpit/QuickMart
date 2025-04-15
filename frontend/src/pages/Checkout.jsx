import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiCheck, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getCart } from '../features/cart/cartSlice';
import { createOrder } from '../features/orders/orderSlice';
import { toast } from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalPrice, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading: orderLoading } = useSelector((state) => state.orders);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'COD',
  });

  const { fullName, phone, address, city, state, postalCode, paymentMethod } = formData;

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName || !phone || !address || !city || !state || !postalCode) {
      toast.error('Please fill in all fields');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const orderData = {
      orderItems: cartItems.map(item => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.quantity,
        unit: item.unit || 'piece'
      })),
      shippingAddress: {
        street: address,
        city,
        state,
        zipCode: postalCode,
        country: 'India'
      },
      paymentMethod,
      itemsPrice: totalPrice,
      taxPrice: totalPrice * 0.18,
      shippingPrice: totalPrice > 500 ? 0 : 40,
      totalPrice: totalPrice + (totalPrice > 500 ? 0 : 40) + (totalPrice * 0.18)
    };

    dispatch(createOrder(orderData))
      .unwrap()
      .then((data) => {
        navigate(`/payment/${data._id}`);
      })
      .catch((err) => {
        toast.error(typeof err === 'string' ? err : 'Failed to create order');
      });
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className='flex flex-col items-center justify-center gap-4'>
          <CgSpinner fontSize={40} className='text-secondary animate-spin' />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center bg-white rounded-xl p-8 shadow-sm"
        >
          <div className="inline-flex items-center justify-center bg-primary bg-opacity-10 p-4 rounded-full mb-4">
            <FiDollarSign className="text-3xl text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Your cart is empty</h2>
          <p className="mb-6 text-gray-600">Add some items to your cart before checkout.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-md"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  const deliveryFee = totalPrice > 500 ? 0 : 40;
  const grandTotal = totalPrice + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-900">Shipping Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="fullName" className="block text-gray-700 mb-2 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="address" className="block text-gray-700 mb-2 font-medium">
                  Full Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label htmlFor="city" className="block text-gray-700 mb-2 font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-gray-700 mb-2 font-medium">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-gray-700 mb-2 font-medium">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold mb-6 text-gray-900">Payment Method</h2>

              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={handleChange}
                      className="hidden peer"
                    />
                    <label
                      htmlFor="cod"
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-primary peer-checked:bg-opacity-10 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                          {paymentMethod === 'COD' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                        </div>
                        <span className="font-medium">Cash on Delivery</span>
                      </div>
                      <FiDollarSign className="text-gray-400 peer-checked:text-primary" />
                    </label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      id="online"
                      name="paymentMethod"
                      value="Online"
                      checked={paymentMethod === 'Online'}
                      onChange={handleChange}
                      className="hidden peer"
                    />
                    <label
                      htmlFor="online"
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-primary peer-checked:bg-opacity-10 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                          {paymentMethod === 'Online' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                        </div>
                        <span className="font-medium">Online Payment</span>
                      </div>
                      <FiCreditCard className="text-gray-400 peer-checked:text-primary" />
                    </label>
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary-dark text-white py-4 px-6 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={orderLoading}
              >
                {orderLoading ? (
                  <>
                    <span className="animate-spin h-5 w-5 mr-2 border-b-2 border-white rounded-full"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2" />
                    Place Order
                  </>
                )}
              </motion.button>
            </motion.form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-6"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>

              <div className="max-h-96 overflow-y-auto pr-2 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex py-4 border-b border-gray-100 last:border-b-0">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-600 text-sm">
                          {item.quantity} × ₹{item.price.toFixed(2)}
                        </span>
                        <span className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <div className="text-sm text-center py-2 bg-blue-50 text-blue-600 rounded-lg">
                    Add ₹{(500 - totalPrice).toFixed(2)} more for free delivery
                  </div>
                )}
              </div>

              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-4">
                <span>Total</span>
                <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;