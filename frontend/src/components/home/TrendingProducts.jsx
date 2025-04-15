import { useEffect } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrendingUp } from 'react-icons/fi';
import { getProducts } from '../../features/products/productSlice';
import ProductCard from '../products/ProductCard';

const TrendingProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts({ sort: '-rating' }));
  }, [dispatch]);


  return (
    <section className="py-12"> 
    <div className='container mx-auto md:px-4'>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <FiTrendingUp className="text-2xl text-secondary" />
          <h2 className="text-2xl font-bold">Trending Products</h2>
        </div>
        <Link to="/products?sort=-rating" className="text-secondary hover:text-opacity-80">
          View All
        </Link>
      </div>


      <div

        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >

        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))

        ) : (

          products.slice(0, 8).map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))

        )}

        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;