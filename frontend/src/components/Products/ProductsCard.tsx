import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Package, ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  showAddToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode, showAddToCart = false }) => {
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    // TODO: Implement add to cart functionality
    setTimeout(() => {
      setAddingToCart(false);
      // Show success message or update cart
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpiringSoon = (expiry: string) => {
    const expiryDate = new Date(expiry);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  const isExpired = (expiry: string) => {
    const expiryDate = new Date(expiry);
    const today = new Date();
    return expiryDate < today;
  };

  if (viewMode === 'list') {
    return (
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image */}
          <div className="md:w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {product.imageUrl && !imageError ? (
              <img
                src={`http://localhost:5000${product.imageUrl}`}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{product.farmer.farmName || product.farmer.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">per unit</div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {product.category}
              </span>
              
              <div className="flex items-center text-sm text-gray-600">
                <Package className="h-4 w-4 mr-1" />
                <span>{product.quantity} available</span>
              </div>

              {product.harvestDate && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Harvested {formatDate(product.harvestDate)}</span>
                </div>
              )}

              {product.expiryDate && (
                <div className={`flex items-center text-sm ${
                  isExpired(product.expiryDate) 
                    ? 'text-red-600' 
                    : isExpiringSoon(product.expiryDate) 
                    ? 'text-yellow-600' 
                    : 'text-gray-600'
                }`}>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {isExpired(product.expiryDate) 
                      ? 'Expired' 
                      : `Fresh until ${formatDate(product.expiryDate)}`
                    }
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Link
                to={`/products/${product.id}`}
                className="btn-outline flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </Link>

              {showAddToCart && product.quantity > 0 && !isExpired(product.expiryDate || '') && (
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="card hover:shadow-lg transition-shadow overflow-hidden">
      {/* Image */}
      <div className="aspect-w-16 aspect-h-12 bg-gray-200 relative">
        {product.imageUrl && !imageError ? (
          <img
            src={`http://localhost:5000${product.imageUrl}`}
            alt={product.name}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gray-200">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-800">
            {product.category}
          </span>
        </div>

        {/* Stock/Expiry Warning */}
        {product.quantity === 0 && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Out of Stock
            </span>
          </div>
        )}

        {product.expiryDate && isExpiringSoon(product.expiryDate) && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Expires Soon
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
          <div className="text-lg font-bold text-primary-600 ml-2">
            ${product.price.toFixed(2)}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{product.farmer.farmName || product.farmer.name}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <Package className="h-3 w-3 mr-1" />
            <span>{product.quantity} available</span>
          </div>
          
          {product.harvestDate && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(product.harvestDate)}</span>
            </div>
          )}
        </div>

        {product.expiryDate && (
          <div className={`text-xs mb-3 ${
            isExpired(product.expiryDate) 
              ? 'text-red-600' 
              : isExpiringSoon(product.expiryDate) 
              ? 'text-yellow-600' 
              : 'text-gray-500'
          }`}>
            {isExpired(product.expiryDate) 
              ? 'Expired' 
              : `Fresh until ${formatDate(product.expiryDate)}`
            }
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 btn-outline text-center py-2 text-sm"
          >
            View Details
          </Link>

          {showAddToCart && product.quantity > 0 && !isExpired(product.expiryDate || '') && (
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 btn-primary py-2 text-sm disabled:opacity-50 flex items-center justify-center space-x-1"
            >
              <ShoppingCart className="h-3 w-3" />
              <span>{addingToCart ? 'Adding...' : 'Add'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;