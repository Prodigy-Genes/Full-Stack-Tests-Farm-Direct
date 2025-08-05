import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Package, ShoppingCart, DollarSign, TrendingUp, Heart, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            {user.role === 'FARMER' 
              ? `Manage your farm products and track orders from ${user.farmName || 'your farm'}.`
              : 'Discover fresh produce from local farms and manage your orders.'
            }
          </p>
        </div>

        {user.role === 'FARMER' ? <FarmerDashboard user={user} /> : <CustomerDashboard user={user} />}
      </div>
    </div>
  );
};

const FarmerDashboard: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <Package className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">$0.00</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Farm Info */}
      {user.farmName && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Farm Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Farm Name</p>
              <p className="font-medium text-gray-900">{user.farmName}</p>
            </div>
            {user.farmAddress && (
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-900">{user.farmAddress}</p>
              </div>
            )}
            {user.phone && (
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{user.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/farmer/products/new" className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Link>
          <Link to="/farmer/products" className="btn-outline flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Manage Products</span>
          </Link>
          <Link to="/farmer/orders" className="btn-outline flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <div>
              <h3 className="font-medium text-gray-900">Add Your First Product</h3>
              <p className="text-sm text-gray-600">Start by adding products from your farm to the marketplace.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
            <div>
              <h3 className="font-medium text-gray-900">Set Competitive Prices</h3>
              <p className="text-sm text-gray-600">Research market prices and set competitive rates for your products.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
            <div>
              <h3 className="font-medium text-gray-900">Manage Orders</h3>
              <p className="text-sm text-gray-600">Track and fulfill customer orders as they come in.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerDashboard: React.FC<{ user: any }> = ({ }) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-green-600">$0.00</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Favorite Category</p>
              <p className="text-2xl font-bold text-blue-600">None</p>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/products" className="btn-primary flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Shop Products</span>
          </Link>
          <Link to="/orders" className="btn-outline flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>View Orders</span>
          </Link>
          <Link to="/cart" className="btn-outline flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>View Cart</span>
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to FarmDirect! 🌱</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <div>
              <h3 className="font-medium text-gray-900">Browse Fresh Products</h3>
              <p className="text-sm text-gray-600">Discover fresh produce directly from local farms.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
            <div>
              <h3 className="font-medium text-gray-900">Add to Cart</h3>
              <p className="text-sm text-gray-600">Add your favorite products to your cart and checkout.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
            <div>
              <h3 className="font-medium text-gray-900">Track Orders</h3>
              <p className="text-sm text-gray-600">Follow your orders from farm to your doorstep.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips for Customers */}
      <div className="bg-primary-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">💡 Shopping Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <Star className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
            <p className="text-primary-800">Check harvest dates for the freshest produce</p>
          </div>
          <div className="flex items-start space-x-2">
            <Star className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
            <p className="text-primary-800">Support local farmers in your area</p>
          </div>
          <div className="flex items-start space-x-2">
            <Star className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
            <p className="text-primary-800">Order in bulk to reduce packaging waste</p>
          </div>
          <div className="flex items-start space-x-2">
            <Star className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
            <p className="text-primary-800">Try seasonal varieties for best flavors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;