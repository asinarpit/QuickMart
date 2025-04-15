import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    try {

      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Thank you for subscribing!', {
        icon: '👏',
        style: {
          background: '#4BB543',
          color: '#fff',
        },
      });
      setEmail('');
    } catch (error) {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-secondary/60 to-secondary text-white rounded-lg">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="bg-white bg-opacity-20 p-4 rounded-full inline-flex items-center justify-center mb-4">
              <FiMail className="text-4xl" />
            </div>


            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated With Our Newsletter
            </h2>
            <p className="text-gray-100 mb-8 text-lg max-w-2xl mx-auto">
              Get exclusive offers, product updates, and delivery news straight to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
            >
              <div className="relative flex-grow">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-6 py-4 rounded-xl text-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary shadow-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="px-8 py-4 bg-white text-dark font-semibold rounded-xl hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <CgSpinner fontSize={20} className='animate-spin' />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Subscribe Now
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-sm text-gray-200 mt-4 opacity-80">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;