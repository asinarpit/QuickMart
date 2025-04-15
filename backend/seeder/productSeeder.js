import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';
import User from '../models/User.js';

dotenv.config();

const products = [
  {
    name: 'Fresh Red Apples',
    description: 'Sweet and crispy red apples, perfect for snacking or baking',
    price: 2.99,
    images: [
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
      'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a',
      'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2'
    ],
    category: 'fruits-vegetables',
    countInStock: 100,
    rating: 4.5,
    numReviews: 12,
    brand: 'Fresh Farms',
  },
  {
    name: 'Organic Bananas',
    description: 'Ripe and ready-to-eat organic bananas',
    price: 1.99,
    images: [
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224',
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224',
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224'
    ],
    category: 'fruits-vegetables',
    countInStock: 150,
    rating: 4.3,
    numReviews: 8,
    brand: 'Organic Delights',
  },
  {
    name: 'Fresh Spinach',
    description: 'Nutrient-rich fresh spinach leaves',
    price: 3.49,
    images: [
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb'
    ],
    category: 'fruits-vegetables',
    countInStock: 80,
    rating: 4.2,
    numReviews: 15,
    brand: 'Green Leaf',
  },
  {
    name: 'Organic Tomatoes',
    description: 'Vine-ripened organic tomatoes',
    price: 2.49,
    images: [
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337',
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337',
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337'
    ],
    category: 'fruits-vegetables',
    countInStock: 120,
    rating: 4.4,
    numReviews: 10,
    brand: 'Organic Delights',
  },
  {
    name: 'Fresh Broccoli',
    description: 'Crisp and fresh broccoli florets',
    price: 2.99,
    images: [
      'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c',
      'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c',
      'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c'
    ],
    category: 'fruits-vegetables',
    countInStock: 90,
    rating: 4.1,
    numReviews: 7,
    brand: 'Fresh Farms',
  },

  {
    name: 'Organic Milk',
    description: 'Fresh organic whole milk',
    price: 4.99,
    images: [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b',
      'https://images.unsplash.com/photo-1563636619-e9143da7973b',
      'https://images.unsplash.com/photo-1563636619-e9143da7973b'
    ],
    category: 'dairy-bakery',
    countInStock: 50,
    rating: 4.6,
    numReviews: 20,
    brand: 'Dairy Fresh',
  },
  {
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt, high in protein',
    price: 3.99,
    images: [
      'https://images.unsplash.com/photo-1488477181946-6428a0291777',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777'
    ],
    category: 'dairy-bakery',
    countInStock: 75,
    rating: 4.3,
    numReviews: 15,
    brand: 'Yogurt Delight',
  },
  {
    name: 'Whole Grain Bread',
    description: 'Freshly baked whole grain bread',
    price: 4.99,
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff'
    ],
    category: 'dairy-bakery',
    countInStock: 40,
    rating: 4.5,
    numReviews: 17,
    brand: 'Bakery Fresh',
  },
  {
    name: 'Croissants',
    description: 'Buttery French croissants',
    price: 3.99,
    images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a'
    ],
    category: 'dairy-bakery',
    countInStock: 30,
    rating: 4.6,
    numReviews: 21,
    brand: 'Bakery Fresh',
  },
  {
    name: 'Cheddar Cheese',
    description: 'Aged sharp cheddar cheese',
    price: 6.99,
    images: [
      'https://images.unsplash.com/photo-1452195100486-9cc805987862',
      'https://images.unsplash.com/photo-1452195100486-9cc805987862',
      'https://images.unsplash.com/photo-1452195100486-9cc805987862'
    ],
    category: 'dairy-bakery',
    countInStock: 40,
    rating: 4.5,
    numReviews: 18,
    brand: 'Cheese Masters',
  },

  {
    name: 'Rice',
    description: 'Premium basmati rice',
    price: 6.99,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c'
    ],
    category: 'staples',
    countInStock: 55,
    rating: 4.4,
    numReviews: 17,
    brand: 'Rice Select',
  },
  {
    name: 'Pasta',
    description: 'Italian durum wheat pasta',
    price: 2.99,
    images: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141'
    ],
    category: 'staples',
    countInStock: 70,
    rating: 4.3,
    numReviews: 15,
    brand: 'Italian Kitchen',
  },
  {
    name: 'Olive Oil',
    description: 'Extra virgin olive oil',
    price: 9.99,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5'
    ],
    category: 'staples',
    countInStock: 40,
    rating: 4.6,
    numReviews: 21,
    brand: 'Mediterranean Gold',
  },
  {
    name: 'Tomato Sauce',
    description: 'Homemade-style tomato sauce',
    price: 4.49,
    images: [
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8',
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8',
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8'
    ],
    category: 'staples',
    countInStock: 45,
    rating: 4.5,
    numReviews: 19,
    brand: 'Italian Kitchen',
  },
  {
    name: 'Honey',
    description: 'Raw organic honey',
    price: 7.99,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38'
    ],
    category: 'staples',
    countInStock: 35,
    rating: 4.7,
    numReviews: 23,
    brand: 'Bee Natural',
  },

  {
    name: 'Mixed Nuts',
    description: 'Premium mixed nuts assortment',
    price: 8.99,
    images: [
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32',
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32',
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32'
    ],
    category: 'snacks',
    countInStock: 50,
    rating: 4.5,
    numReviews: 19,
    brand: 'Nutty Delights',
  },
  {
    name: 'Dark Chocolate',
    description: '70% dark chocolate bar',
    price: 4.99,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52'
    ],
    category: 'snacks',
    countInStock: 65,
    rating: 4.7,
    numReviews: 24,
    brand: 'Chocolate Heaven',
  },
  {
    name: 'Green Tea',
    description: 'Premium Japanese green tea',
    price: 5.99,
    images: [
      'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
      'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
      'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9'
    ],
    category: 'snacks',
    countInStock: 60,
    rating: 4.4,
    numReviews: 18,
    brand: 'Tea Time',
  },
  {
    name: 'Coffee Beans',
    description: 'Premium Arabica coffee beans',
    price: 12.99,
    images: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e'
    ],
    category: 'snacks',
    countInStock: 40,
    rating: 4.7,
    numReviews: 25,
    brand: 'Coffee Masters',
  },
  {
    name: 'Sparkling Water',
    description: 'Natural mineral sparkling water',
    price: 2.99,
    images: [
      'https://images.unsplash.com/photo-1581006852262-e4307cf6283a',
      'https://images.unsplash.com/photo-1581006852262-e4307cf6283a',
      'https://images.unsplash.com/photo-1581006852262-e4307cf6283a'
    ],
    category: 'snacks',
    countInStock: 80,
    rating: 4.2,
    numReviews: 12,
    brand: 'Pure Water',
  },

  {
    name: 'Organic Shampoo',
    description: 'Natural organic shampoo for all hair types',
    price: 8.99,
    images: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc'
    ],
    category: 'personal-care',
    countInStock: 45,
    rating: 4.6,
    numReviews: 28,
    brand: 'Natural Care',
  },
  {
    name: 'Face Cream',
    description: 'Hydrating face cream with natural ingredients',
    price: 12.99,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03'
    ],
    category: 'personal-care',
    countInStock: 35,
    rating: 4.5,
    numReviews: 22,
    brand: 'Skin Care Plus',
  },
  {
    name: 'Body Lotion',
    description: 'Nourishing body lotion with shea butter',
    price: 9.99,
    images: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc'
    ],
    category: 'personal-care',
    countInStock: 50,
    rating: 4.4,
    numReviews: 19,
    brand: 'Natural Care',
  },
  {
    name: 'Hand Soap',
    description: 'Gentle hand soap with aloe vera',
    price: 4.99,
    images: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc'
    ],
    category: 'personal-care',
    countInStock: 60,
    rating: 4.3,
    numReviews: 15,
    brand: 'Clean Care',
  },
  {
    name: 'Toothpaste',
    description: 'Natural toothpaste with fluoride',
    price: 5.99,
    images: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc'
    ],
    category: 'personal-care',
    countInStock: 55,
    rating: 4.5,
    numReviews: 20,
    brand: 'Dental Care',
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role:'admin'
      });
    }
    
    const user = await User.findOne({ email: 'admin@example.com' });
    
    const productsWithUser = products.map(product => ({
      ...product,
      user: user._id
    }));
    
    await Product.deleteMany();
    await Product.insertMany(productsWithUser);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    await Product.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 