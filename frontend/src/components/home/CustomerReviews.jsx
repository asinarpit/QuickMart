import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Regular Customer',
    image: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    comment: 'The delivery was super fast and all the products were fresh. Will definitely order again!',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Food Enthusiast',
    image: 'https://i.pravatar.cc/150?img=2',
    rating: 5,
    comment: 'Great quality products and amazing customer service. The app is easy to use too.',
  },
  {
    id: 3,
    name: 'Emily Brown',
    role: 'Home Chef',
    image: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    comment: 'I love how I can get all my groceries delivered in minutes. The prices are competitive too.',
  },
];



const CustomerReviews = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 bg-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2
            className="text-2xl font-bold mb-4"
          >
            What Our Customers Say
          </h2>

        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={item}
              whileHover={{ y: -10 }}
              className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                <div className="relative">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-100 animate-pulse" />
                </div>
              </div>

              <div className="pt-10">
                <div className="flex justify-center mb-4 space-x-1">
                  {[...Array(review.rating)].map((_, index) => (
                    <FiStar
                      key={index}
                      className="text-amber-400 w-6 h-6 fill-current"
                    />
                  ))}
                </div>

                <blockquote className="text-gray-600 mb-6 text-lg leading-relaxed italic">
                  "{review.comment}"
                </blockquote>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-bold text-gray-800 text-lg">{review.name}</h3>
                  <p className="text-secondary text-sm font-medium">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>


      </div>
    </section>
  );
};

export default CustomerReviews;