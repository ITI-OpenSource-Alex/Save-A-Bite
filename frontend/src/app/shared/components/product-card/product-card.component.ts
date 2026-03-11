import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@/core/models/product';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
}
