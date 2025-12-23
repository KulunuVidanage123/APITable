// src/products-columns.tsx
import { Eye } from 'lucide-react';

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
};

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
};

const getStockStatusClass = (status: string) => {
  if (status === 'In Stock') return 'bg-green-100 text-green-800';
  if (status === 'Low Stock') return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

// Accept onView handler (optional)
export const productColumns = (onView?: (product: Product) => void) => [
  {
    key: 'thumbnail',
    header: '',
    render: (item: Product) => (
      <img
        src={item.thumbnail}
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
      const price = item.price;
      const discount = item.discountPercentage || 0;
      const discountedPrice = price * (1 - discount / 100);

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-blue-600">
            ${discountedPrice.toFixed(2)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ${price.toFixed(2)}
            </span>
          )}
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
            item.availabilityStatus
          )}`}
        >
          {item.availabilityStatus}
        </span>
        <span className="text-gray-500 text-xs">{item.stock} units</span>
      </div>
    ),
  },
  {
    key: 'rating',
    header: 'Rating',
    render: (item: Product) => renderStars(item.rating),
  },
  {
    key: 'actions',
    header: '',
    render: (item: Product) => {
      return (
        <div className="flex justify-end">
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
        </div>
      );
    },
  },
];