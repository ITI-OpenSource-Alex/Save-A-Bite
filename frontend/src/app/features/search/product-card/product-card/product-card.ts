import { Component, Input, inject } from '@angular/core';
import { Product } from '@/core/models/product';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '@/core/services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;

  isAddingToCart: boolean = false;

  private cartService = inject(CartService);

  addToCart(event: Event): void {
    event.stopPropagation();

    // Prevent multiple clicks if currently adding or if product has no ID
    if (this.isAddingToCart || !this.product._id) return;

    this.isAddingToCart = true;

    this.cartService
      .addItem({
        productId: this.product._id,
        quantity: 1,
      })
      .subscribe({
        next: () => {
          this.isAddingToCart = false;
        },
        error: () => {
          this.isAddingToCart = false;
        },
      });
  }
}
