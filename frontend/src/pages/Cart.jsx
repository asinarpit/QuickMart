import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { getCart, updateCartItem, removeFromCart } from '../features/cart/cartSlice';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CgSpinner } from 'react-icons/cg';

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        dispatch(getCart())
          .unwrap()
          .finally(() => setLoading(false));
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = async (productId, quantity, countInStock) => {
    if (quantity < 1 || quantity > countInStock) return;

    try {
      await dispatch(updateCartItem({ productId, quantity })).unwrap();
      toast.success('Quantity updated');
    } catch (err) {
      toast.error(err || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    setRemovingItem(productId);
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err || 'Failed to remove item');
    } finally {
      setRemovingItem(null);
    }
  };

  const deliveryFee = totalPrice > 500 ? 0 : 40;
  const grandTotal = totalPrice + deliveryFee;

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-12">
        <div
          className="max-w-md mx-auto text-center bg-white rounded-xl p-8 shadow-sm"
        >
          <div className="inline-flex items-center justify-center bg-primary bg-opacity-10 p-4 rounded-full mb-4">
            <FiShoppingBag className="text-3xl text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Your cart is waiting</h2>
          <p className="mb-6 text-gray-600">Please sign in to view your cart and place orders.</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-md"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div
          className="max-w-md mx-auto text-center bg-white rounded-xl p-8 shadow-sm"
        >
          <div className="inline-flex items-center justify-center bg-primary bg-opacity-10 p-4 rounded-full mb-4">
            <FiShoppingBag className="text-3xl text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Your cart is empty</h2>
          <p className="mb-6 text-gray-600">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
          <Link
            to="/products"
            className="flex items-center text-gray-600 hover:text-primary font-medium hidden md:block"
          >
            <FiArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 bg-gray-50 p-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
                <div className="col-span-1 text-right">Remove</div>
              </div>

              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.product._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: "0%" }}
                    exit={{ opacity: 0, x: "-100%" }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 border-b border-gray-100 ${removingItem === (item.product?._id || item.product) ? 'opacity-50' : ''}`}
                  >
                    <div className="grid grid-cols-12 items-center gap-4">

                      <div className="col-span-12 sm:col-span-5 flex items-center">
                        <div className="flex-shrink-0 w-20 h-20 mr-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <Link
                            to={`/product/${item.product}`}
                            className="font-medium text-gray-900 hover:text-primary line-clamp-2"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </div>

                      <div className="col-span-4 sm:col-span-2 text-center text-gray-700">
                        ₹{item.price.toFixed(2)}
                      </div>


                      <div className="col-span-4 sm:col-span-2 flex justify-center sm:justify-start">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item.product?._id || item.product, item.quantity - 1, item.countInStock)}
                            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="px-4 py-1 bg-white text-center w-12">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product?._id || item.product, item.quantity + 1, item.countInStock)}
                            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-30"
                            disabled={item.quantity >= item.countInStock}
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                      </div>







                      <div className="col-span-2 sm:col-span-2 text-center font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>


                      <div className="col-span-2 sm:col-span-1 flex justify-center">
                        <button
                          onClick={() => handleRemoveItem(item.product?._id || item.product)}
                          className="text-red-500 hover:text-red-700 p-2 transition-colors"
                          disabled={removingItem === (item.product?._id || item.product)}
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div
              className="bg-white rounded-xl shadow-sm p-6 sticky top-36"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <div className="text-sm text-center py-2 bg-blue-50 text-blue-600 rounded-lg">
                    Add ₹{(500 - totalPrice).toFixed(2)} more for free delivery
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-secondary hover:bg-secondary-dark text-white text-center py-3 px-4 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <FiShoppingBag className="mr-2" />
                <span>Free returns within 7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;