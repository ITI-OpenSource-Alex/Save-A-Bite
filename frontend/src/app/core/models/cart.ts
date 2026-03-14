import { Product } from './product';

export interface CartItem {
  productId: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  appliedPromoCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddItemDto {
  productId: string;
  quantity: number;
}

export interface UpdateItemDto {
  productId: string;
  quantity: number;
}

export interface ApplyPromoCodeDto {
  promoCode: string;
}
