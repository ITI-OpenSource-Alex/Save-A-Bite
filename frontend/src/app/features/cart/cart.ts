import { Component, signal, computed } from '@angular/core';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
})
export class Cart {
  deliveryFee = 15;
  discountPercent = 20;

  cartItems = signal<CartItem[]>([
    {
      id: 1,
      name: 'Gradient Graphic T-shirt',
      price: 145,
      quantity: 1,
      size: 'Large',
      color: 'White',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
    },
    {
      id: 2,
      name: 'Checkered Shirt',
      price: 180,
      quantity: 1,
      size: 'Medium',
      color: 'Red',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200',
    },
    {
      id: 3,
      name: 'Skinny Fit Jeans',
      price: 240,
      quantity: 1,
      size: 'Large',
      color: 'Blue',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200',
    },
  ]);

  subtotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  discount = computed(() => (this.subtotal() * this.discountPercent) / 100);

  total = computed(() => this.subtotal() - this.discount() + this.deliveryFee);

  increase(item: CartItem) {
    this.cartItems.update((items) =>
      items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  }

  decrease(item: CartItem) {
    this.cartItems.update((items) =>
      items.map((i) =>
        i.id === item.id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i,
      ),
    );
  }

  remove(item: CartItem) {
    this.cartItems.update((items) => items.filter((i) => i.id !== item.id));
  }
}
