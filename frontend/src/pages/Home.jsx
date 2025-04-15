import { Link } from 'react-router';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Hero } from '../components/home/Hero';
import ShopByCategory from '../components/home/ShopByCategory';
import FeatureProducts from '../components/home/FeatureProducts';
import TrendingProducts from '../components/home/TrendingProducts';
import SpecialOffers from '../components/home/SpecialOffers';
import CustomerReviews from '../components/home/CustomerReviews';
import Newsletter from '../components/home/Newsletter';
import WhyChooseUs from '../components/home/WhyChooseUs';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Hero />
      <ShopByCategory />
      <FeatureProducts />
      <TrendingProducts />
      <SpecialOffers />

      <section className="py-12 bg-secondary text-white rounded-lg">
        <motion.div initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-50px" }}
          transition={{ duration: 0.5 }} className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Shop?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Browse our full range of products and get everything you need delivered straight to your door.
          </p>
          <Link
            to="/products"
            className="btn bg-white text-secondary hover:bg-gray-100 text-lg px-8 py-3 inline-block"
          >
            Shop All Products
          </Link>
        </motion.div>
      </section>

      <CustomerReviews />

      <section className="mb-12">
        <div className="bg-primary rounded-lg overflow-hidden">
          <motion.div initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-50px" }}
            transition={{ duration: 0.5 }} className="p-6 md:p-12 text-center text-gray-200">
            <h2

              className="text-2xl md:text-3xl font-bold mb-4"
            >
              Get 10% OFF on Your First Order
            </h2>
            <p
              className="mb-6 max-w-xl mx-auto"
            >
              Use code <span className="font-bold">WELCOME10</span> at checkout to get 10% off on your first order with us.
            </p>

            <Link to="/products" className="btn-outline text-gray-200 border-gray-200">
              Shop Now <FiArrowRight className="inline ml-2" />
            </Link>

          </motion.div>
        </div>
      </section>

      <WhyChooseUs />

      <Newsletter />
    </div>
  );
};

export default Home; 