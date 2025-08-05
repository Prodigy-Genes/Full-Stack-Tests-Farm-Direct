import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, ShoppingCart, DollarSign, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import { productAPI, orderAPI } from '../../services/api';
import { type Product, type Order } from '../../types';

const FarmerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [productsResponse, ordersResponse] = await Promise.all([
        productAPI.getFarmerProducts(),
        orderAPI.getFarmerOrders()
      ]);

      setProducts(productsResponse.products);
      setOrders(ordersResponse.orders);

      // Calculate stats
      const activeProducts = productsResponse.products.filter(p => p.isActive && p.quantity > 0);
      const totalRevenue = ordersResponse.orders.reduce((sum, order) => {
        return sum + order.orderItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
      }, 0);

      setStats({
        totalProducts: productsResponse.products.length,
        activeProducts: activeProducts.length,
        totalOrders: ordersResponse.orders.length,
        totalRevenue
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
        // Update stats
        setStats(prev => ({
          ...prev,
          totalProducts: prev.totalProducts - 1,
          activeProducts: prev.activeProducts - (products.find(p => p.id === productId)?.isActive ? 1 : 0)
        }));
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeProducts}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

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

      {/* Recent Products */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
          <Link to="/farmer/products" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View all
          </Link>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You haven't added any products yet.</p>
            <Link to="/farmer/products/new" className="btn-primary">
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-700">Product</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-700">Price</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-700">Stock</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          {product.imageUrl ? (
                            <img 
                              src={`http://localhost:5000${product.imageUrl}`} 
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.description.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-700">{product.category}</td>
                    <td className="py-4 text-sm text-gray-700">${product.price.toFixed(2)}</td>
                    <td className="py-4 text-sm text-gray-700">{product.quantity}</td>
                    <td className="py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.isActive && product.quantity > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive && product.quantity > 0 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/products/${product.id}`}
                          className="text-gray-400 hover:text-gray-600"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/farmer/products/${product.id}/edit`}
                          className="text-blue-400 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/farmer/orders" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View all
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No orders yet. Start selling your products!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {order.customer?.name} • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.orderItems.length} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </p>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;