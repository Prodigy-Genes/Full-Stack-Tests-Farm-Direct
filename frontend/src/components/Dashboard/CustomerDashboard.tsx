import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, Heart, TrendingUp, Star, MapPin } from 'lucide-react';
import { orderAPI, productAPI } from '../../services/api';
import type { Order, Product } from '../../types';

const CustomerDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteCategory: 'None'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try to load orders and products, but handle failures gracefully
      let ordersData: Order[] = [];
      let productsData: Product[] = [];

      try {
        const ordersResponse = await orderAPI.getCustomerOrders();
        ordersData = ordersResponse?.orders || [];
      } catch (orderError) {
        console.error('Failed to load orders:', orderError);
        // Continue without orders data
      }

      try {
        const productsResponse = await productAPI.getProducts({ limit: 6 });
        productsData = productsResponse?.products || [];
      } catch (productError) {
        console.error('Failed to load products:', productError);
        // Continue without products data
      }

      setOrders(ordersData);
      setRecentProducts(productsData);

      // Calculate stats safely
      const totalSpent = ordersData.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      
      // Find favorite category (most ordered)
      const categoryCount: { [key: string]: number } = {};
      ordersData.forEach(order => {
        if (order.orderItems && Array.isArray(order.orderItems)) {
          order.orderItems.forEach(item => {
            if (item.product && item.product.category) {
              const category = item.product.category;
              categoryCount[category] = (categoryCount[category] || 0) + (item.quantity || 0);
            }
          });
        }
      });
      
      const favoriteCategory = Object.keys(categoryCount).length > 0 
        ? Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b)
        : 'None';

      setStats({
        totalOrders: ordersData.length,
        totalSpent,
        favoriteCategory
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
        <button onClick={loadDashboardData} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalSpent.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Favorite Category</p>
              <p className="text-2xl font-bold text-blue-600">{stats.favoriteCategory}</p>
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

      {/* Fresh Products */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Fresh Products</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View all
          </Link>
        </div>
        
        {!recentProducts || recentProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No products available at the moment.</p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {product.imageUrl ? (
                    <img 
                      src={`http://localhost:5000${product.imageUrl}`} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <span className="text-lg font-bold text-primary-600">${product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                    <span>{product.quantity} available</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{product.farmer?.farmName || product.farmer?.name || 'Unknown Farmer'}</span>
                  </div>
                  <Link 
                    to={`/products/${product.id}`}
                    className="block w-full text-center btn-outline py-2 text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/orders" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View all
          </Link>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">Order #{order.id.substring(0, 8)}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems?.length || 0} item(s)
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {order.orderItems?.map(item => item.product?.name || 'Unknown Product').join(', ') || 'No items'}
                    </p>
                    <p className="font-medium text-gray-900">${(order.totalPrice || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default CustomerDashboard;