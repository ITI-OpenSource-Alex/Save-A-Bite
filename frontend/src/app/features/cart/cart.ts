import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '@/core/services/cart.service';
import { Cart } from '@/core/models/cart';
import { CartItemsComponent } from './components/cart-items/cart-items.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, CartItemsComponent, OrderSummaryComponent],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  deliveryFee = 15;
  cart = signal<Cart | null>(null);
  isLoading = signal<boolean>(true);

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

  onCartUpdated(updatedCart: Cart) {
    this.cart.set(updatedCart);
  }
}
