import { Component, Input, Output, EventEmitter, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '@/core/services/cart.service';
import { OrderService } from '@/core/services/order';
import { Cart } from '@/core/models/cart';
import { CreateOrderDto } from '@/core/models/order';

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
  @Output() checkoutCompleted = new EventEmitter<void>();

  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private destroyRef = inject(DestroyRef);

  isCheckoutLoading = signal<boolean>(false);
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

  checkout() {
    if (!this.cart || this.cart.items.length === 0) return;

    this.isCheckoutLoading.set(true);

    const orderData: CreateOrderDto = {
      storeId: '65f1a3e9c7a2b0e4d8f12345',
      items: this.cart.items.map((i) => ({
        productId: i.productId._id,
        quantity: i.quantity,
        price: i.price,
      })),
      totalPrice: this.cart.subtotal,
      discount: this.cart.discount,
      finalPrice: this.cart.total + this.deliveryFee,
      paymentMethod: 'CASH',
      addressSnapshot: '123 Main St, Default App Address',
      promocode: this.cart.appliedPromoCode,
    };

    this.orderService
      .createOrder(orderData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          alert('Order placed successfully! Order ID: ' + res.order._id);

          this.cartService.clearCart().subscribe(() => {
            this.checkoutCompleted.emit();
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
