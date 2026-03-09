import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProductCardData {
  image: string;
  title: string;
  restaurant: string;
  description?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  stock?: number;
}

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductCardData;
}
