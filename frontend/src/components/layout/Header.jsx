import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { FiMenu, FiX, FiUser, FiShoppingCart, FiLogOut, FiSearch, FiSettings, FiPackage, FiLogIn } from 'react-icons/fi';
import { logout } from '../../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);


  const handleAccountMenuHover = () => setIsAccountMenuOpen(true);
  const handleAccountMenuLeave = () => setIsAccountMenuOpen(false);


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success('Logged out successfully');
        navigate('/');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="shadow-md bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center font-bold text-xl">
            QuickMart
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block w-1/3 mx-4">
            <form onSubmit={handleSearch} className="flex shadow-sm">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-5 py-2.5 border border-gray-200 rounded-l-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-secondary hover:bg-secondary-dark text-white px-6 rounded-r-full flex items-center justify-center transition-colors duration-200"
              >
                <FiSearch className="text-lg" />
              </button>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/products"
              className="font-medium text-gray-700 hover:text-secondary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              Products
            </Link>

            {isAuthenticated ? (
              <div className="relative group"
                onMouseEnter={handleAccountMenuHover}
                onMouseLeave={handleAccountMenuLeave}
              >
                <button
                  className="flex items-center space-x-2 font-medium text-gray-700 hover:text-secondary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"


                >
                  <FiUser className="text-xl" />
                  <span className="relative">
                    Account
                    <span className="absolute -right-3 top-0.5 w-2 h-2 bg-primary rounded-full"></span>
                  </span>
                </button>
                {
                  isAccountMenuOpen && (
                    <motion.div
                      onMouseLeave={handleAccountMenuLeave}
                      onMouseEnter={handleAccountMenuHover}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 -mt-1 w-56 bg-white shadow-xl rounded-xl overflow-hidden z-10 border border-gray-100"
                    >
                      <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-medium text-gray-600">Hello,</p>
                        <p className="truncate font-semibold text-gray-900">{user.name}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <FiUser className="text-gray-500" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <FiShoppingCart className="text-gray-500" />
                          <span>Orders</span>
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <FiSettings className="text-gray-500" />
                            <span>Dashboard</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiLogOut className="text-red-500" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )
                }

              </div>
            ) : (
              <Link
                to="/login"
                className="font-medium text-gray-700 hover:text-secondary transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                Login
              </Link>
            )}

            <Link
              to="/cart"
              className="relative p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiShoppingCart className="text-2xl text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[0.6rem] font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2">
              <FiShoppingCart className="text-2xl text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <FiX className="text-2xl text-gray-700" />
              ) : (
                <FiMenu className="text-2xl text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="mt-4 md:hidden">
          <form onSubmit={handleSearch} className="flex shadow-sm">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-l-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-secondary hover:bg-secondary-dark text-white px-5 rounded-r-full flex items-center justify-center"
            >
              <FiSearch className="text-lg" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-gray-50 border-t border-gray-100"
          >
            <nav className="flex flex-col p-4 space-y-2">
              <Link
                to="/products"
                className="flex items-center space-x-3 px-4 py-3.5 text-gray-700 bg-white rounded-xl shadow-sm"
                onClick={toggleMenu}
              >
                <FiPackage className="text-gray-500" />
                <span>Products</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="space-y-2">
                    <div className="px-4 py-2.5 text-sm text-gray-500">
                      Logged in as <span className="font-medium text-gray-700">{user.name}</span>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3.5 text-gray-700 bg-white rounded-xl shadow-sm"
                      onClick={toggleMenu}
                    >
                      <FiUser className="text-gray-500" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center space-x-3 px-4 py-3.5 text-gray-700 bg-white rounded-xl shadow-sm"
                      onClick={toggleMenu}
                    >
                      <FiShoppingCart className="text-gray-500" />
                      <span>Orders</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center space-x-3 px-4 py-3.5 text-gray-700 bg-white rounded-xl shadow-sm"
                        onClick={toggleMenu}
                      >
                        <FiSettings className="text-gray-500" />
                        <span>Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-600 bg-white rounded-xl shadow-sm"
                    >
                      <FiLogOut className="text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-3 px-4 py-3.5 text-gray-700 bg-white rounded-xl shadow-sm"
                  onClick={toggleMenu}
                >
                  <FiLogIn className="text-gray-500" />
                  <span>Login</span>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );

};

export default Header; 