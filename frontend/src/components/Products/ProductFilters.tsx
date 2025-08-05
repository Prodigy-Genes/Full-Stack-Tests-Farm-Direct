import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  priceRange: { min: string; max: string };
  onPriceRangeChange: (min: string, max: string) => void;
  onClearFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  priceRange,
  onPriceRangeChange,
  onClearFilters,
}) => {
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPriceRangeChange(e.target.value, priceRange.max);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPriceRangeChange(priceRange.min, e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Advanced Filters</h3>
        <button
          onClick={onClearFilters}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Clear all</span>
        </button>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min price"
              value={priceRange.min}
              onChange={handleMinPriceChange}
              className="input-field"
              min="0"
              step="0.01"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max price"
              value={priceRange.max}
              onChange={handleMaxPriceChange}
              className="input-field"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Quick Price Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Price Filters
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onPriceRangeChange('', '5')}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Under $5
          </button>
          <button
            onClick={() => onPriceRangeChange('5', '15')}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            $5 - $15
          </button>
          <button
            onClick={() => onPriceRangeChange('15', '30')}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            $15 - $30
          </button>
          <button
            onClick={() => onPriceRangeChange('30', '')}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Over $30
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;