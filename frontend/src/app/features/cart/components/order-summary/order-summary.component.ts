import { Component, Input, Output, EventEmitter, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '@/core/services/cart.service';
import { Cart } from '@/core/models/cart';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-summary.component.html'
})
export class OrderSummaryComponent {
  @Input({ required: true }) cart!: Cart;
  @Input({ required: true }) deliveryFee!: number;

  @Output() cartUpdated = new EventEmitter<Cart>();

  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  promoCodeInput = signal<string>('');

  applyPromo() {
    if (!this.promoCodeInput()) return;

    this.cartService
      .applyPromoCode({ promoCode: this.promoCodeInput() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartUpdated.emit(res.cart);
          this.promoCodeInput.set('');
        },
        error: (err) => {
          console.error('Failed to apply promo code:', err);
          alert('Invalid promo code');
        },
      });
  }


}
