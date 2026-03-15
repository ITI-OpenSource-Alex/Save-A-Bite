import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KeyValue } from '@angular/common';
import { Observable, tap, map } from 'rxjs';
import { Product } from '@/core/models/product';
import { ProductService } from '@/core/services/product';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [FormsModule, AsyncPipe, CommonModule],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
})
export class ProductPage {
  @Output() categorySelected = new EventEmitter<string>();
  quantity = 1;
  wishlistAdded = false;
  content: any = null;
  product$!: Observable<Product>;
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private productId = this.route.snapshot.paramMap.get('id');

  ngOnInit(): void {
    if (this.productId) {
      this.product$ = this.productService.getProductById(this.productId).pipe(
        tap((res) => console.log('Product detail response', res)),
        map((res: any) => {
          const raw = res.product ?? res;
          return {
            ...raw,
            imageUrl: raw.imageUrl ?? raw.images ?? [],
            categoryName: raw.categoryName ?? raw.categoryId?.name ?? undefined,
            categoryId: raw.categoryId && raw.categoryId._id ? raw.categoryId._id : raw.categoryId,
            storeName: raw.storeName ?? raw.storeId?.name ?? undefined,
            storeId: raw.storeId && raw.storeId._id ? raw.storeId._id : raw.storeId,
          } as Product;
        }),
        tap((product) => {
          this.categorySelected.emit(product?.categoryId?.toString());
        }),
      );
    }
  }

  macros = [
    { key: 'Calories', value: 250 },
    { key: 'Protein in gm', value: 5 },
    { key: 'Fibers in gm', value: 7 },
  ];

  ingredients = ['Sugar', 'Butter', 'Milk', 'Eggs', 'Flour', 'Strawberry Syrup', 'Lemons'];

  state = 'Fresh and ready to be served';

  increment() {
    if (this.quantity < 9) {
      this.quantity++;
    }
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  showMacros() {
    this.content = 'macros';
  }

  showIngredients() {
    this.content = 'ingredients';
  }

  showState() {
    this.content = 'state';
  }

  toggleWishlist() {
    this.wishlistAdded = !this.wishlistAdded;
  }
}
