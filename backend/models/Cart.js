import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: false,
        min: 1,
        default: 1
      },
      price: {
        type: Number,
        required: false,
        default: 0
      },
      name: {
        type: String,
        required: false,
        default: 'Product'
      },
      image: {
        type: String,
        required: false,
      },
      unit: {
        type: String,
        required: false,
        default: 'piece'
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

CartSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );
  next();
});

export default mongoose.model('Cart', CartSchema); 