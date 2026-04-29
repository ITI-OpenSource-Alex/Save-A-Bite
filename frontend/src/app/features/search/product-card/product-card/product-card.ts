import { Component, Input, inject, ChangeDetectorRef } from '@angular/core';
import { Product } from '@/core/models/product';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '@/core/services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '@/core/services/auth.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;

  isAddingToCart = false;

  private cartService = inject(CartService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  addToCart(event: Event): void {
    event.stopPropagation();

    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isAddingToCart || !this.product._id) return;

    this.isAddingToCart = true;
    this.cdr.detectChanges();

    this.cartService
      .addItem({
        productId: this.product._id,
        quantity: 1,
      })
      .subscribe({
        next: () => {
          this.isAddingToCart = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isAddingToCart = false;
          this.cdr.detectChanges();
        },
      });
  }

  goToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }
}
