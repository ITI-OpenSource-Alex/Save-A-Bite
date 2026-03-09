import { Component, Input } from '@angular/core';
import { Product } from '@/core/models/product';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
  isWishListed: boolean = false;
  toggleWishList(event: Event): void {
    event.stopPropagation();

    this.isWishListed = !this.isWishListed;

    // Optional: Emit an event to your parent component or call a service
    // here to actually save this to the database.
  }
}
