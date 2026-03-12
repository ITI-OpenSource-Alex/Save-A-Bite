import { Component } from '@angular/core';
import { SimilarCategory } from '@/layout/similar-category/similar-category';
import { ProductPage } from '@/layout/product-page/product-page';

@Component({
  selector: 'app-product-layout',
  imports: [SimilarCategory, ProductPage],
  templateUrl: './product-layout.html',
  styleUrl: './product-layout.css',
})
export class ProductLayout {
  selectedCategoryId!: string;

  onCategorySelected(categoryId: string) {
    this.selectedCategoryId = categoryId;
  }
}
