import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';
import { FiFilter, FiX, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../features/products/productSlice';
import ProductCard from '../components/products/ProductCard';

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'fruits-vegetables', name: 'Fruits & Vegetables' },
  { id: 'dairy-bakery', name: 'Dairy & Bakery' },
  { id: 'staples', name: 'Staples' },
  { id: 'snacks', name: 'Snacks & Beverages' },
  { id: 'personal-care', name: 'Personal Care' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  const dispatch = useDispatch();
  const { products, loading, pages } = useSelector((state) => state.products);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) {
      params.set('search', searchTerm);
    }

    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }

    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }

    setSearchParams(params);
  }, [searchTerm, selectedCategory, currentPage, setSearchParams]);

  useEffect(() => {
    dispatch(getProducts({
      keyword: searchTerm,
      pageNumber: currentPage,
      category: selectedCategory
    }));
  }, [dispatch, searchTerm, selectedCategory, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Find what you need from our wide selection</p>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-96">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Desktop Filters */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-36">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category.id ? 'bg-secondary bg-opacity-10 text-secondary font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* mobile filter */}
        <button
          className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-xs w-full mb-4"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? (
            <>
              <FiX className="text-gray-600" />
              <span className="font-medium">Close Filters</span>
            </>
          ) : (
            <>
              <FiFilter className="text-gray-600" />
              <span className="font-medium">Filter Products</span>
            </>
          )}
        </button>


        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden w-full mb-6 overflow-hidden"
            >
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-3 py-2 rounded-md transition-colors text-sm ${selectedCategory === category.id ? 'bg-primary bg-opacity-10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="animate-pulse duration-300">
                    <div className="bg-gray-200 h-48 w-full"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {products && products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product) => (

                      <ProductCard key={product._id} product={product} />

                    ))}
                  </div>


                  {pages > 1 && (
                    <div className="flex justify-center mt-12">
                      <nav className="flex items-center gap-1">
                        <button
                          onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          <FiChevronLeft size={20} />
                        </button>

                        {[...Array(pages).keys()].map(number => {
                          const page = number + 1;

                          if (page === 1 || page === pages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentPage === page ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                              >
                                {page}
                              </button>
                            );
                          }

                          if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <span key={page} className="px-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}

                        <button
                          onClick={() => handlePageChange(currentPage < pages ? currentPage + 1 : pages)}
                          disabled={currentPage === pages}
                          className={`p-2 rounded-lg ${currentPage === pages ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          <FiChevronRight size={20} />
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                  <div className="max-w-md mx-auto">
                    <div className="text-5xl mb-4">🛒</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setCurrentPage(1);
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;