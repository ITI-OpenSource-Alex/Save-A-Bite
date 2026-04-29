import { Component, Input, Output, EventEmitter, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '@/core/services/cart.service';
import { Cart } from '@/core/models/cart';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-summary.component.html'
})
export class OrderSummaryComponent {
  @Input({ required: true }) cart!: Cart;
  @Input({ required: true }) deliveryFee!: number;
  private http = inject(HttpClient);
  isCheckingOut = signal<boolean>(false);
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
  removePromo() {
    this.cartService
      .removePromoCode()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.cartUpdated.emit(res.cart);
        },
        error: (err) => {
          console.error('Failed to remove promo code:', err);
          alert('Failed to remove promo code');
        }
      });
  }
  getCreateOrderPayload() {
 const cart = this.cartService.cartState();

 if (!cart) {
    throw new Error('Cart is empty');
  }

  const orderData: any = {
  storeId: this.cart.items[0]?.productId?.storeId,
  items: this.cart.items.map(item => ({
    productId: item.productId._id || item.productId,
    quantity: item.quantity,
    price: item.price
  })),
  totalPrice: this.cart.subtotal,
  discount: this.cart.discount || 0,
  finalPrice: this.cart.total + this.deliveryFee,
  paymentMethod: 'CARD',
  addressSnapshot: 'Alexandria Corniche, Egypt'
};

const codeText = this.promoCodeInput();
if (codeText && typeof codeText === 'string') {
  orderData.promocode = codeText;
}
return orderData;

  };
  

proceedToCheckout() {
  this.isCheckingOut.set(true);

  // 1. Get the raw payload
  const orderData = this.getCreateOrderPayload();
  if (!orderData.promocode || typeof orderData.promocode !== 'string') {
    delete orderData.promocode;
  }

  const idempotencyKey = crypto.randomUUID();
  const headers = this.cartService.getAuthHeaders()
    .set('idempotency-key', idempotencyKey);

    


  this.http.post<any>('http://localhost:3000/api/orders', orderData, { headers }).subscribe({
    next: (res) => {
      console.log('Order Creation Response:', res);
      const orderId =res.data?._id || res.order?._id || res._id
      if (!orderId) {
        console.error('Order ID not found in response:', res);
        alert('Unexpected response from server. Please try again.');
        this.isCheckingOut.set(false);
        return;
      }
      console.log('Successfully grabbed Order ID:', orderId);
      const paymentUrl = 'http://localhost:3000/api/payments/create-checkout-session';
      // Step 2: Redirect to Payment
      this.http.post<any>(paymentUrl, { orderId:orderId }, { headers })
        .subscribe({
          next: (stripeRes) => {
            if (stripeRes.url) {
              window.location.href = stripeRes.url; 
            }
          },
          error: (err) => {
            console.error('Stripe Session Error:', err.error);
            alert('Payment link generation failed.');
            this.isCheckingOut.set(false);
          }
        });
    },
    error: (err) => {
      console.error('Order Error:', err.error);
      this.isCheckingOut.set(false);
    }
  });
}
}
