import React from 'react'
import { FiClock, FiTruck, FiShield, FiPercent } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function WhyChooseUs() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container max-w-7xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold mb-16 text-center relative"
                >
                    Why Choose Us

                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: FiClock, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Fast Delivery', text: 'Get your groceries delivered in just 10 minutes' },
                        { icon: FiShield, color: 'text-green-600', bg: 'bg-green-50', title: 'Quality Products', text: 'Fresh products sourced directly from farms' },
                        { icon: FiPercent, color: 'text-purple-600', bg: 'bg-purple-50', title: 'Best Prices', text: 'Competitive prices with amazing discounts' },
                        { icon: FiTruck, color: 'text-orange-600', bg: 'bg-orange-50', title: 'Free Delivery', text: 'Free delivery on orders above ₹499' },
                    ].map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.15 }
                            }}
                            className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out cursor-default text-center"
                        >
                            <div
                                className={`${item.bg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 
  transition-all duration-300 group-hover:[transform:rotateY(180deg)]`}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <item.icon className={`text-3xl ${item.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
