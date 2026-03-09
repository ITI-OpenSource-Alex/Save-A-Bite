export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
  discount?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
