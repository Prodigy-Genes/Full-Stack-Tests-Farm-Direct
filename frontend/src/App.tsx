import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import CreateProduct from './pages/farmer/CreateProduct';
import EditProduct from './pages/farmer/EditProduct';
import MyProducts from './pages/farmer/MyProducts';
import Cart from './pages/customer/Cart';
import OrderHistory from './pages/customer/OrderHistory';
import FarmerOrders from './pages/customer/FarmerOrders';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Customer Routes */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute requiredRole="CUSTOMER">
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute requiredRole="CUSTOMER">
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />

              {/* Farmer Routes */}
              <Route
                path="/farmer/products"
                element={
                  <ProtectedRoute requiredRole="FARMER">
                    <MyProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/products/new"
                element={
                  <ProtectedRoute requiredRole="FARMER">
                    <CreateProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/products/:id/edit"
                element={
                  <ProtectedRoute requiredRole="FARMER">
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/orders"
                element={
                  <ProtectedRoute requiredRole="FARMER">
                    <FarmerOrders />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<div className="text-center py-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;