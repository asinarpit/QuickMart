import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String
  },
  brand: {
    type: String
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    required: true,
    default: 'piece'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        required: true
      },
      comment: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  avgRating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Product', ProductSchema); 