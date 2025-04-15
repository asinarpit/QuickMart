import { Link } from 'react-router';
import { FiAlertCircle, FiHome, FiShoppingBag } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <FiAlertCircle className="mx-auto text-6xl text-danger mb-6" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/" className="btn-primary flex items-center justify-center">
            <FiHome className="mr-2" /> Go to Home
          </Link>
          <Link to="/products" className="btn-outline flex items-center justify-center">
            <FiShoppingBag className="mr-2" /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 