import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.pageSize) || 10;
    const page = parseInt(req.query.page) || 1;
    const category = req.query.category;
    const keyword = req.query.keyword
      ? {
          $or: [
            {
              name: {
                $regex: req.query.keyword,
                $options: 'i'
              }
            },
            {
              description: {
                $regex: req.query.keyword,
                $options: 'i'
              }
            }
          ]
        }
      : {};

    const filterOptions = { ...keyword };

    if (category && category !== 'all') {
      filterOptions.category = category;
    }

    const count = await Product.countDocuments(filterOptions);
    const products = await Product.find(filterOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / pageSize),
      page,
      products
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      return res.status(200).json({
        success: true,
        product
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    req.body.vendor = req.user._id;

    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (
      req.user.role !== 'admin' &&
      product.vendor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (
      req.user.role !== 'admin' &&
      product.vendor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await product.remove();

    return res.status(200).json({
      success: true,
      message: 'Product removed'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Product already reviewed'
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      images: images || []
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    return res.status(201).json({
      success: true,
      message: 'Review added'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const updateProductReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const reviewToUpdate = product.reviews.id(req.params.reviewId);
    
    if (!reviewToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (reviewToUpdate.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'User not authorized to update this review'
      });
    }

    reviewToUpdate.rating = Number(rating) || reviewToUpdate.rating;
    reviewToUpdate.comment = comment || reviewToUpdate.comment;
    
    if (images && Array.isArray(images)) {
      reviewToUpdate.images = images;
    }

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Review updated',
      review: reviewToUpdate
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

export const deleteProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const reviewToDelete = product.reviews.id(req.params.reviewId);
    
    if (!reviewToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (
      reviewToDelete.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'User not authorized to delete this review'
      });
    }

    product.reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.params.reviewId.toString()
    );

    product.numReviews = product.reviews.length;

    if (product.reviews.length > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Review deleted'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 