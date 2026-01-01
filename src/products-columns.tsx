// src/products-columns.tsx
import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { Product } from '../types'; 

const renderStars = (rating?: number) => {
  const safeRating = rating ?? 0; // ✅ Default to 0 if undefined
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(safeRating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-gray-700">{safeRating.toFixed(1)}</span>
    </div>
  );
};

const getStockStatusClass = (stock: number) => {
  if (stock > 10) return 'bg-green-100 text-green-800';
  if (stock > 0) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const getProductColumns = (
  onView?: (product: Product) => void,
  onEdit?: (product: Product) => void,
  onDelete?: (productId: string) => void
) => [
  {
    key: 'imageUrl',
    header: '',
    render: (item: Product) => (
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-10 h-10 object-contain rounded"
      />
    ),
  },
  {
    key: 'title',
    header: 'Product',
    render: (item: Product) => (
      <div className="font-medium text-gray-900 max-w-xs truncate">
        {item.title}
      </div>
    ),
  },
  {
    key: 'brand',
    header: 'Brand',
    render: (item: Product) => (
      <div className="text-gray-600">{item.brand || 'N/A'}</div>
    ),
  },
  {
    key: 'price',
    header: 'Price',
    render: (item: Product) => {
      return (
        <div className="font-semibold text-blue-600">
          ${item.price.toFixed(2)}
        </div>
      );
    },
  },
  {
    key: 'category',
    header: 'Category',
    render: (item: Product) => (
      <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
        {item.category}
      </span>
    ),
  },
  {
    key: 'stock',
    header: 'Stock',
    render: (item: Product) => (
      <div className="flex items-center space-x-2">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${getStockStatusClass(
            item.stock
          )}`}
        >
          {item.stock} units
        </span>
      </div>
    ),
  },
  {
  key: 'rating',
  header: 'Rating',
  render: (item: Product) => renderStars(item.rating), // ✅ Now safe
  },
  {
    key: 'actions',
    header: '',
    render: (item: Product) => {
      return (
        <div className="flex justify-end gap-2">
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(item);
              }}
              className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              aria-label="View product details"
            >
              <Eye size={16} />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              aria-label="Edit product"
            >
              <Pencil size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              aria-label="Delete product"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      );
    },
  },
];