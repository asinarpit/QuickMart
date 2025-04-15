import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { GiFruitBowl, GiMilkCarton, GiWheat, GiCookie, GiSoap } from 'react-icons/gi';

const categories = [
    { id: 'fruits-vegetables', name: 'Fruits & Vegetables', icon: <GiFruitBowl />, color: 'bg-green-100' },
    { id: 'dairy-bakery', name: 'Dairy & Bakery', icon: <GiMilkCarton />, color: 'bg-blue-100' },
    { id: 'staples', name: 'Pantry Staples', icon: <GiWheat />, color: 'bg-amber-100' },
    { id: 'snacks', name: 'Snacks & Beverages', icon: <GiCookie />, color: 'bg-red-100' },
    { id: 'personal-care', name: 'Personal Care', icon: <GiSoap />, color: 'bg-purple-100' },
];

const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }
};

export default function ShopByCategory() {
    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Explore Our Categories
                    </h2>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Discover fresh products curated just for you, delivered faster than you can imagine
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            variants={categoryVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ margin: '-50px' }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="w-full"
                        >
                            <Link
                                to={`/products?category=${category.id}`}
                                className={`block group relative h-full ${category.color} rounded-xl p-6 transition-all duration-300 hover:z-10`}
                            >
                                <motion.div
                                    whileHover="hover"
                                    className="flex flex-col items-center justify-center h-full"
                                >
                                    <div className="mb-6 text-5xl text-gray-800 group-hover:text-secondary transition-colors">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                        {category.name}
                                    </h3>
                                    <span className="text-sm text-gray-600 group-hover:text-secondary
                                     transition-colors">
                                        Shop Now →
                                    </span>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}