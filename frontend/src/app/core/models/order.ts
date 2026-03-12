export interface CreateOrderDto {
  storeId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  discount: number;
  finalPrice: number;
  paymentMethod: string;
  addressSnapshot: string;
  promocode?: string;
}

export interface Order {
  _id: string;
}
