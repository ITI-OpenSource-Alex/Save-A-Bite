import { Component, EventEmitter, inject, Output, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KeyValue } from '@angular/common';
import { Observable, tap, map, switchMap } from 'rxjs';
import { Product } from '@/core/models/product';
import { ProductService } from '@/core/services/product';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '@/core/services/cart.service';
import { AuthService } from '@/core/services/auth.service';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [FormsModule, AsyncPipe, CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
})
export class ProductPage {
  @Output() categorySelected = new EventEmitter<string>();
  quantity = 1;
  wishlistAdded = false;
  content: any = null;
  product$!: Observable<Product>;
  isAddingToCart = false;

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private productId = '';

  ngOnInit(): void {
    this.product$ = this.route.params.pipe(
      map(params => params['id']),
      tap(id => {
        this.productId = id;
        this.quantity = 1;
      }),
      switchMap(id => this.productService.getProductById(id)),
      map((res: any) => {
        const raw = res.product ?? res;
        return {
          ...raw,
          storeId: raw.storeId?._id ?? raw.storeId,
          storeName: raw.storeId?.name ?? raw.storeName,
          categoryId: raw.categoryId?._id ?? raw.categoryId,
          categoryName: raw.categoryId?.name ?? raw.categoryName,
        } as Product;
      }),
      tap(product => this.categorySelected.emit(product?.categoryId?.toString()))
    );
  }

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

  addToCart(product: Product): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const qty = Number(this.quantity);
    if (this.isAddingToCart || !product._id || isNaN(qty) || qty < 1) return;

    this.isAddingToCart = true;
    this.cdr.detectChanges();

    this.cartService
      .addItem({
        productId: product._id,
        quantity: qty,
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
}
