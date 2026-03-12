import mongoose from 'mongoose';

export interface Product {
  name: string;
  storeId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  images: string[];
  price: number;
  stock: number;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
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
}
