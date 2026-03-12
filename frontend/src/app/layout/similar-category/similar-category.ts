import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@/core/models/product';
import { Observable, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProductService } from '@/core/services/product';

@Component({
  selector: 'app-similar-category',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './similar-category.html',
  styleUrl: './similar-category.css',
})
export class SimilarCategory implements OnChanges {
  @Input() categoryId!: string;
  private productService = inject(ProductService);
  products$!: Observable<Product[]>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId'] && this.categoryId) {
      this.fetchSimilarProducts(this.categoryId);
    }
  }

  fetchSimilarProducts(categoryId: string) {
    this.products$ = this.productService
      .getProducts(1, 6, { category: categoryId })
      .pipe(
        tap((res) => console.log('Similar products response', res)),
        map((res: any) =>
          res.products.map(
            (p: any) =>
              ({
                ...p,
                imageUrl: p.imageUrl ?? p.images ?? [],
              } as Product),
          ),
        ),
      );
  }

  trackByName(index: number, product: Product) {
    return product.name;
  }
}
