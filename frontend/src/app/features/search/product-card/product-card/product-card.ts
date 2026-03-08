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
}
