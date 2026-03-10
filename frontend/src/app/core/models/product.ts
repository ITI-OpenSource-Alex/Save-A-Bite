export interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
  discountPercentage?: number;
  isFlashDeal?: boolean;
}

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
