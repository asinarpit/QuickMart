import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router';

export const Hero = () => (
  <section className="relative h-[60vh] md:h-[70vh] bg-gray-100 flex items-center rounded-lg overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(https://t3.ftcdn.net/jpg/01/38/99/44/360_F_138994417_z9zjyI1oyS2oGgiJOlNOkt25Wwj4UhcK.jpg)`,
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
    </div>

    <div className="container mx-auto px-4 z-10 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Fresh Groceries Delivered in
          <span className="text-primary"> 10 Minutes</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Discover farm-fresh produce, premium essentials, and daily needs delivered to your doorstep.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center bg-secondary hover:bg-primary-dark text-white px-4 py-2 md:px-8 md:py-4 rounded-full text-lg font-medium transition-colors shadow-lg group"
        >
          Start Shopping Now
          <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </motion.div>
    </div>
  </section>
);