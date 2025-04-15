import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiArrowLeft, FiStar, FiMinus, FiPlus, FiEdit2, FiTrash2, FiCamera, FiX } from 'react-icons/fi';
import { getProductById, createProductReview, updateProductReview, deleteProductReview } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { toast } from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewImages, setReviewImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  const hasUserReviewed = () => {
    return product?.reviews?.some((review) => review.user === user?._id);
  };

  const handleAddToCart = () => {
    if (product.countInStock < 1) {
      toast.error('Product is out of stock');
      return;
    }

    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      countInStock: product.countInStock,
      qty: quantity
    }));

    toast.success(`${product.name} added to cart`);
  };

  const submitReviewHandler = (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (hasUserReviewed() && !editingReview) {
      toast.error('You have already reviewed this product');
      return;
    }

    setReviewSubmitting(true);

    const reviewData = {
      rating,
      comment,
      images: reviewImages
    };

    const action = editingReview
      ? updateProductReview({
        productId: id,
        reviewId: editingReview._id,
        reviewData
      })
      : createProductReview({
        productId: id,
        review: reviewData
      });

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(editingReview ? 'Review updated successfully' : 'Review submitted successfully');
        setRating(0);
        setComment('');
        setReviewImages([]);
        setEditingReview(null);
      })
      .catch((err) => toast.error(err || 'Something went wrong'))
      .finally(() => setReviewSubmitting(false));
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setReviewImages(review.images || []);
    document.querySelector('#review-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteProductReview({ productId: id, reviewId }))
        .unwrap()
        .then(() => toast.success('Review deleted successfully'))
        .catch((err) => toast.error(err || 'Failed to delete review'));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) return toast.error('You can upload maximum 3 images');

    const newImages = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        if (newImages.length === files.length) setReviewImages(newImages);
      };
      reader.readAsDataURL(file);
    });
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="flex items-center text-gray-600 mb-6 hover:text-primary transition">
        <FiArrowLeft className="mr-2" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-xl shadow-lg">
          {product.images?.length > 0 ? (
            <>
              <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                navigation={{
                  prevEl: '.swiper-button-prev',
                  nextEl: '.swiper-button-next',
                }}
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className="h-96 rounded-lg relative"
              >

                <div className="swiper-button-prev !w-10 !h-10 !bg-white/80 !rounded-full !shadow-lg hover:!bg-white after:!text-primary after:!text-sm">
                  <IoIosArrowBack className='text-primary' fontSize={10} />
                </div>
                <div className="swiper-button-next !w-10 !h-10 !bg-white/80 !rounded-full !shadow-lg hover:!bg-white after:!text-primary after:!text-sm">
                  <IoIosArrowForward className='text-primary' fontSize={10} />
                </div>

                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img src={image} alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-contain" />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[FreeMode, Thumbs]}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress
                className="mt-4 h-24 thumb-swiper"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className="cursor-pointer group relative"
                  >
                    <div className="absolute inset-0 border-4 border-primary rounded-lg opacity-0 transition-opacity group-hover:opacity-30 group-[.swiper-slide-thumb-active]:opacity-100"></div>
                    <img
                      src={image}
                      alt={`${product.name} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg transition-opacity opacity-50 group-[.swiper-slide-thumb-active]:opacity-100 group-hover:opacity-100"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No images available</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`${i < product.rating ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-gray-500">
              ({product.numReviews} reviews)
            </span>
          </div>

          <div className="space-y-4">
            <div className="text-3xl font-bold text-primary">
              ₹{product.price.toFixed(2)}
              {product.discount > 0 && (
                <span className="ml-3 text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className={`text-lg ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>

            {product.countInStock > 0 && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-50 text-gray-600"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-4 py-2 border-x w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-50 text-gray-600"
                  >
                    <FiPlus />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center transition"
                >
                  <FiShoppingCart className="mr-2" /> Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
            <div id="review-form" className="space-y-6">
              <h3 className="text-xl font-semibold">
                {editingReview ? 'Edit Review' : 'Write a Review'}
              </h3>

              {isAuthenticated ? (
                hasUserReviewed() && !editingReview ? (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">You've already reviewed this product</p>
                  </div>
                ) : (
                  <form onSubmit={submitReviewHandler} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block font-medium">Rating</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="text-2xl text-yellow-400 hover:scale-110 transition"
                          >
                            <FiStar className={`${star <= rating ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block font-medium">Comment</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                        rows="4"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-medium">Images (max 3)</label>
                      <div className="flex flex-wrap gap-2">
                        {reviewImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img src={image} alt={`Preview ${index}`}
                              className="w-16 h-16 object-cover rounded border" />
                            <button
                              type="button"
                              onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== index))}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                        {reviewImages.length < 3 && (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              ref={fileInputRef}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current.click()}
                              className="w-16 h-16 border-2 border-dashed rounded flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition"
                            >
                              <FiCamera size={24} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition"
                      >
                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                      {editingReview && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReview(null);
                            setRating(0);
                            setComment('');
                            setReviewImages([]);
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">Sign in to leave a review</p>
                  <Link to="/login" className="btn-primary block">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {product.reviews?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet</p>
            ) : (
              product.reviews?.map((review) => (
                <div key={review._id} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex items-center mt-1 space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`text-sm ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      {user?._id === review.user && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-gray-600">{review.comment}</p>

                  {review.images?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review ${index}`}
                          className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-75 transition"
                          onClick={() => window.open(image, '_blank')}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;