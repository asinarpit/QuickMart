import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { getProducts, deleteProduct, resetProductState } from '../../features/products/productSlice';
import { CgSpinner } from 'react-icons/cg';

const ProductList = () => {
  const dispatch = useDispatch();

  const { products, page, pages, loading, error, success, message } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);


  useEffect(() => {
    dispatch(getProducts({ pageNumber: currentPage }));
  }, [dispatch, currentPage]);


  useEffect(() => {
    if (products && products.length > 0) {
      console.log(`Total products: ${products.length}, Current page: ${page}, Total pages: ${pages}`);
      setAllProducts(products);
    }
  }, [products, page, pages]);


  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(allProducts);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      setFilteredProducts(
        allProducts.filter(product =>
          product.name.toLowerCase().includes(lowercaseSearch) ||
          product.category.toLowerCase().includes(lowercaseSearch)
        )
      );
    }
  }, [searchTerm, allProducts]);

  useEffect(() => {
    if (success) {
      toast.success(message || 'Product deleted successfully');
      dispatch(resetProductState());
      dispatch(getProducts({ pageNumber: currentPage }));
    }
    if (error) {
      toast.error(error);
      dispatch(resetProductState());
    }
  }, [success, error, message, dispatch, currentPage, searchTerm]);

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getProducts({
      keyword: searchTerm,
      pageNumber: 1
    }));
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    dispatch(getProducts({ pageNumber: 1 }));
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading && allProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <CgSpinner className='animate-spin text-secondary' fontSize={40} />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Product Management</h1>
          <p className="text-gray-600">{products.length} products available</p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="relative flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              )}
            </div>
          </form>

          <Link
            to="/admin/product/new"
            className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2.5 text-white"
          >
            <FiPlus className="text-lg" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && allProducts.length > 0 && (
          <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-600">
            <CgSpinner className='animate-spin text-secondary' fontSize={20} />
            Updating product list...
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          className="h-full w-full object-cover"
                          src={product.images[0]}
                          alt={product.name}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product._id.substring(product._id.length - 6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">₹{product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${product.countInStock > 10 ? 'bg-green-100 text-green-800' :
                        product.countInStock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                      {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Link
                        to={`/product/${product._id}`}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View"
                      >
                        <FiEye className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/admin/product/${product._id}/edit`}
                        className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="p-12 text-center">
            <div className="inline-block mb-4 text-6xl">📦</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              {searchTerm
                ? "We couldn't find any products matching your search."
                : 'Get started by adding your first product.'}
            </p>
            {!searchTerm && (
              <Link
                to="/admin/product/new"
                className="btn-primary inline-flex items-center gap-2"
              >
                <FiPlus /> Add Product
              </Link>
            )}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center p-6 border-t border-gray-200">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>

              {[...Array(pages).keys()].map((number) => {
                const pageNumber = number + 1;
                const isCurrent = pageNumber === currentPage;
                const shouldShow = pageNumber === 1 || pageNumber === pages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);

                return shouldShow ? (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center
                      ${isCurrent
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {pageNumber}
                  </button>
                ) : (
                  (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) && (
                    <span key={pageNumber} className="px-2 text-gray-400">
                      ...
                    </span>
                  )
                );
              })}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === pages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;