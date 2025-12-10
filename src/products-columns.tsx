import { ColumnDef } from "@tanstack/react-table";
import { Product } from "./products-data";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "thumbnail",
    header: "",
    cell: ({ row }) => (
      <img 
        src={row.getValue("thumbnail")} 
        alt={row.original.title} 
        className="w-10 h-10 object-contain"
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Product",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => (
      <div className="text-gray-500">{row.getValue("brand") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      const discount = row.original.discountPercentage || 0;
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
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      const status = row.original.availabilityStatus;
      
      const getStatusColor = () => {
        if (status === "In Stock") return "bg-green-100 text-green-800";
        if (status === "Low Stock") return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
      };
      
      return (
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor()}`}>
            {status}
          </span>
          <span className="text-gray-500 text-xs">{stock} units</span>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              className={`w-4 h-4 ${
                i < Math.floor(rating) 
                  ? "text-yellow-400" 
                  : "text-gray-300"
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
    },
  },
];