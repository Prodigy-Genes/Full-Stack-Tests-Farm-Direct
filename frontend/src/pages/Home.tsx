import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShoppingCart, Users, Truck } from 'lucide-react';
import '../styles/Home.css'; 

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Fresh From Farm to Your Table
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect directly with local farmers and get the freshest produce delivered straight to your doorstep. 
            Support sustainable farming while enjoying the best quality ingredients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn-primary text-lg px-8 py-3">
              Shop Fresh Produce
            </Link>
            <Link to="/register" className="btn-outline text-lg px-8 py-3">
              Join as Farmer
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FarmDirect?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're bridging the gap between farmers and consumers, creating a sustainable marketplace for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh & Organic</h3>
            <p className="text-gray-600">
              Get the freshest produce directly from local farms, harvested at peak ripeness.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-secondary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Local</h3>
            <p className="text-gray-600">
              Support local farmers and strengthen your community's food system.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Shopping</h3>
            <p className="text-gray-600">
              Browse, order, and pay online with our simple and secure platform.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-secondary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Delivery</h3>
            <p className="text-gray-600">
              Get your orders delivered fresh from the farm to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white rounded-lg py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of customers and farmers who trust FarmDirect for their fresh produce needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="bg-white text-primary-600 font-medium py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors">
            Start Shopping
          </Link>
          <Link to="/products" className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;