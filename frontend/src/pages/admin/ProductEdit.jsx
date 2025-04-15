import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiImage, FiX } from 'react-icons/fi';
import { getProductById, createProduct, updateProduct, resetProductState } from '../../features/products/productSlice';

const categories = [
  'Vegetables',
  'Fruits',
  'Dairy',
  'Bakery',
  'Meat',
  'Beverages',
  'Snacks',
  'Frozen',
  'Canned',
  'Household',
  'Personal Care'
];

const ProductEdit = () => {
  const { id } = useParams();
  const isNewProduct = !id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { product, loading, error, success } = useSelector(state => state.products);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: categories[0],
    countInStock: '',
    brand: '',
    weight: '',
    isOrganic: false
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  
  useEffect(() => {
    if (!isNewProduct) {
      dispatch(getProductById(id));
    } else {
      dispatch(resetProductState());
    }
  }, [dispatch, id, isNewProduct]);
  
  useEffect(() => {
    if (!isNewProduct && product && product._id === id) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        image: product.image || '',
        category: product.category || categories[0],
        countInStock: product.countInStock || '',
        brand: product.brand || '',
        weight: product.weight || '',
        isOrganic: product.isOrganic || false
      });
      setImagePreview(product.image || '');
    }
  }, [product, id, isNewProduct]);
  
  useEffect(() => {
    if (success) {
      toast.success(isNewProduct ? 'Product created successfully!' : 'Product updated successfully!');
      navigate('/admin/products');
      dispatch(resetProductState());
    }
    if (error) {
      toast.error(error);
      dispatch(resetProductState());
    }
  }, [success, error, dispatch, navigate, isNewProduct]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImage(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setFormData(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);
        setUploadingImage(false);
      };
    } catch (error) {
      console.error('Error reading file:', error);
      setUploadingImage(false);
      toast.error('Failed to upload image');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.description || !formData.image || 
        !formData.category || !formData.countInStock) {
      return toast.error('Please fill all required fields');
    }
    
    const productData = {
      ...formData,
      price: Number(formData.price),
      countInStock: Number(formData.countInStock)
    };
    
    if (isNewProduct) {
      dispatch(createProduct(productData));
    } else {
      dispatch(updateProduct({ id, productData }));
    }
  };
  
  const clearImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview('');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center text-gray-600 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back to Products
      </button>
      
      <h1 className="text-2xl font-bold mb-6">
        {isNewProduct ? 'Add New Product' : 'Edit Product'}
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="countInStock"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Additional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight/Volume (e.g., 500g, 1L)
                  </label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center h-full pt-6">
                  <input
                    type="checkbox"
                    id="isOrganic"
                    name="isOrganic"
                    checked={formData.isOrganic}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="isOrganic" className="ml-2 block text-sm text-gray-700">
                    Organic Product
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Product Image</h2>
              
              <div className="mb-4">
                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="w-full h-48 object-cover" 
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-500">No image selected</p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image *
                </label>
                <div className="mt-1 flex items-center">
                  <label className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                    <FiImage className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                    {uploadingImage ? 'Uploading...' : 'Choose Image'}
                    <input
                      type="file"
                      className="sr-only"
                      onChange={uploadFileHandler}
                      accept="image/*"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center btn-primary text-white"
                  disabled={loading || uploadingImage}
                >
                  <FiSave className="mr-2" />
                  {isNewProduct ? 'Create Product' : 'Update Product'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductEdit; 