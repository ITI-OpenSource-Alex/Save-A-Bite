import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '@/core/services/cart.service';
import { OrderService } from '@/core/services/order';
import { Cart, CartItem } from '@/core/models/cart';
import { CreateOrderDto } from '@/core/models/order';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private destroyRef = inject(DestroyRef);

  deliveryFee = 15;
  cart = signal<Cart | null>(null);
  isLoading = signal<boolean>(true);
  isCheckoutLoading = signal<boolean>(false);

  promoCodeInput = signal<string>('');

  ngOnInit() {
    this.fetchCart();
  }

  fetchCart() {
    this.isLoading.set(true);
    this.cartService
      .getCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cart.set(res.cart);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to fetch cart:', err);
          this.isLoading.set(false);
        },
      });
  }

  increase(item: CartItem) {
    this.updateQuantity(item.productId._id, item.quantity + 1);
  }

  decrease(item: CartItem) {
    if (item.quantity > 1) {
      this.updateQuantity(item.productId._id, item.quantity - 1);
    } else {
      this.remove(item);
    }
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService
      .updateItem({ productId, quantity })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cart.set(res.cart);
        },
        error: (err) => console.error('Failed to update item:', err),
      });
  }

  remove(item: CartItem) {
    this.cartService
      .removeItem(item.productId._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cart.set(res.cart);
        },
        error: (err) => console.error('Failed to remove item:', err),
      });
  }

  applyPromo() {
    if (!this.promoCodeInput()) return;

    this.cartService
      .applyPromoCode({ promoCode: this.promoCodeInput() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cart.set(res.cart);
          this.promoCodeInput.set('');
        },
        error: (err) => {
          console.error('Failed to apply promo code:', err);
          alert('Invalid promo code');
        },
      });
  }

  checkout() {
    const currentCart = this.cart();
    if (!currentCart || currentCart.items.length === 0) return;

    this.isCheckoutLoading.set(true);

    const orderData: CreateOrderDto = {
      storeId: '65f1a3e9c7a2b0e4d8f12345',
      items: currentCart.items.map((i) => ({
        productId: i.productId._id,
        quantity: i.quantity,
        price: i.price,
      })),
      totalPrice: currentCart.subtotal,
      discount: currentCart.discount,
      finalPrice: currentCart.total + this.deliveryFee,
      paymentMethod: 'CASH',
      addressSnapshot: '123 Main St, Default App Address',
      promocode: currentCart.appliedPromoCode,
    };

    this.orderService
      .createOrder(orderData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          alert('Order placed successfully! Order ID: ' + res.order._id);

          this.cartService.clearCart().subscribe(() => {
            this.fetchCart();
            this.isCheckoutLoading.set(false);
          });
        },
        error: (err) => {
          console.error('Failed to create order:', err);
          alert('Checkout failed.');
          this.isCheckoutLoading.set(false);
        },
      });
  }
}
