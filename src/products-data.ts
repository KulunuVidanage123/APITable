export type Product = {
  id: number;
  title: string;
  price: number;
  brand?: string;
  category: string;
  stock: number;
  availabilityStatus: string;
  rating: number;
  thumbnail: string;
  discountPercentage?: number;
};

export type ProductApiResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

// Remove the hardcoded products array