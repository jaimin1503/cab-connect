import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Car, MapPin, Clock, CreditCard, Star, Shield } from "lucide-react";
import Button from "../components/common/Button";

// Reusable Testimonial Card Component
const TestimonialCard = ({ rating, comment, image, name, role }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <div className="flex items-center mb-4">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-400 mb-6">{comment}</p>
    <div className="flex items-center">
      <img
        src={image}
        alt={name}
        className="w-10 h-10 rounded-full object-cover mr-3"
      />
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white">{name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
      </div>
    </div>
  </div>
);

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description, colorClass }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
  >
    <div
      className={`w-14 h-14 ${colorClass} rounded-full flex items-center justify-center mb-6`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </motion.div>
);

const Home: React.FC = () => {
  return (
    <div className="flex-grow">
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Taxi on city street"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <div className="max-w-2xl">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Your Reliable Ride, Anytime, Anywhere
              </motion.h1>

              <motion.p
                className="text-xl mb-8 text-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Experience the best cab service with real-time tracking,
                transparent pricing, and professional drivers.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Button
                  as={Link}
                  to="/book"
                  size="lg"
                  variant="primary"
                  className="dark:!bg-slate-800 bg-slate-100 dark:!text-gray-100 !text-slate-900 dark:hover:!bg-slate-700 hover:!bg-slate-200 w-full sm:w-auto"
                >
                  Book a Ride
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  size="lg"
                  variant="outline"
                  className="!border-white !text-white hover:!bg-white/10 w-full sm:w-auto"
                >
                  Sign Up to Drive
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose CabConnect?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                We provide a seamless experience from booking to destination
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={
                  <MapPin className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                }
                title="Real-time Tracking"
                description="Track your ride in real-time with our advanced GPS system. Know exactly when your driver will arrive."
                colorClass="bg-blue-100 dark:bg-blue-900/30"
              />
              <FeatureCard
                icon={
                  <CreditCard className="h-7 w-7 text-green-600 dark:text-green-400" />
                }
                title="Transparent Pricing"
                description="No hidden charges. Get fare estimates before booking and pay only what you see."
                colorClass="bg-green-100 dark:bg-green-900/30"
              />
              <FeatureCard
                icon={
                  <Clock className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                }
                title="Schedule Rides"
                description="Plan ahead by scheduling rides for later. Get notifications before your ride arrives."
                colorClass="bg-purple-100 dark:bg-purple-900/30"
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Don't just take our word for it
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                rating={5}
                comment="The app is super easy to use and the drivers are always professional. I love the real-time tracking feature!"
                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                name="Sarah Johnson"
                role="Regular User"
              />
              <TestimonialCard
                rating={5}
                comment="I use CabConnect for my daily commute. The scheduled rides feature is a game-changer for me. Highly recommend!"
                image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                name="Michael Chen"
                role="Business Traveler"
              />
              <TestimonialCard
                rating={4}
                comment="The luxury option is perfect for special occasions. Clean cars and courteous drivers. The fare estimator is very accurate."
                image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
                name="Emily Rodriguez"
                role="Occasional User"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Experience the Best Ride Service?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust CabConnect for
              their daily commute and travel needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/book">
                <Button
                  size="lg"
                  variant="primary"
                  className="dark:!bg-slate-800 bg-slate-100 dark:!text-gray-100 !text-slate-900 dark:hover:!bg-slate-700 hover:!bg-slate-200 w-full sm:w-auto"
                >
                  Book a Ride Now
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Become a Driver
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
