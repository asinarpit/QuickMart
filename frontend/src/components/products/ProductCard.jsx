import { Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { FiShoppingCart } from 'react-icons/fi';
import { IoMdStar } from 'react-icons/io';
import { addToCart } from '../../features/cart/cartSlice';
import { toast } from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      countInStock: product.countInStock,
      qty: 1
    }));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
      <Link to={`/product/${product._id}`}>
        <div className="h-40 md:h-48 overflow-hidden relative">
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 z-10 text-xs px-2 py-1 bg-red-600 text-white rounded-full shadow-sm">
              {product.discount}% OFF
            </span>
          )}
          <Swiper
            modules={[Pagination]}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-gray-300 !opacity-100',
              bulletActiveClass: '!bg-secondary'
            }}
            className="h-full w-full product-swiper group-hover:shadow-inner"
            loop={true}
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  loading='lazy'
                  alt={`${product.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Link>

      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
        <Link to={`/product/${product._id}`} className="hover:underline">
          <h3 className="font-semibold text-gray-900 mb-1 truncate hover:text-secondary">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end gap-2">
          <span className="text-lg md:text-xl font-bold text-secondary">
            ₹{product.price.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-xs md:text-sm text-gray-400 line-through">
              ₹{(product.price / (1 - product.discount / 100)).toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <IoMdStar
                  key={i}
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-0.5 hidden md:block">
              ({product.numReviews})
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`p-2 rounded-full shadow-sm transition-colors flex items-center justify-center ${product.countInStock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-secondary/90 hover:bg-primary text-white'
              }`}
          >
            <FiShoppingCart className="h-6 w-6 md:h-5 md:w-5" />
          </button>
        </div>

        {product.countInStock === 0 && (
          <p className="text-xs text-red-600 font-medium mt-1">Out of stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;