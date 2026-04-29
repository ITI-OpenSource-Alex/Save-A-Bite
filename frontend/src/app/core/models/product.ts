export interface Product {
  _id: string;
  name: string;
  price: number;
  category?: string;
  categoryId?: any;
  images?: string[];
  discountPercentage?: number;
  isFlashDeal?: boolean;
  stock?: number;
  description?: string;
  storeId?: any;
  categoryName?: string;
  storeName?: string;
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
  isFlashDeal?: boolean;
  discountPercentage?: number;
  search?: string;
  storeId?: string;
}
