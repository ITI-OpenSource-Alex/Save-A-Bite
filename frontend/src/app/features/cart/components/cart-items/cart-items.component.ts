import { Component, Input, Output, EventEmitter, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '@/core/services/cart.service';
import { CartItem, Cart } from '@/core/models/cart';

@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-items.component.html'
})
export class CartItemsComponent {
  @Input({ required: true }) items: CartItem[] = [];
  @Output() cartUpdated = new EventEmitter<Cart>();

  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

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
          this.cartUpdated.emit(res.cart);
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
          this.cartUpdated.emit(res.cart);
        },
        error: (err) => console.error('Failed to remove item:', err),
      });
  }
}
