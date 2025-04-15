import { Link } from 'react-router';
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">QuickMart</h3>
            <p className="text-gray-400 mb-4">
              Your daily essentials delivered in minutes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FiInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FiFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FiTwitter />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=fruits-vegetables" className="text-gray-400 hover:text-white">
                  Fruits & Vegetables
                </Link>
              </li>
              <li>
                <Link to="/products?category=dairy-bakery" className="text-gray-400 hover:text-white">
                  Dairy & Bakery
                </Link>
              </li>
              <li>
                <Link to="/products?category=staples" className="text-gray-400 hover:text-white">
                  Staples
                </Link>
              </li>
              <li>
                <Link to="/products?category=snacks" className="text-gray-400 hover:text-white">
                  Snacks & Beverages
                </Link>
              </li>
              <li>
                <Link to="/products?category=personal-care" className="text-gray-400 hover:text-white">
                  Personal Care
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <FiMail className="mr-2" />
                <span>support@quickmart.com</span>
              </li>
              <li className="flex items-center text-gray-400">
                <FiPhone className="mr-2" />
                <span>+91 1234567890</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} QuickMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 