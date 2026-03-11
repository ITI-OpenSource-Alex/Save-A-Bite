import { Component, OnInit, inject, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@/core/services/product';
import { Product, PaginatedResponse, ProductFilters } from '@/core/models/product';
import { ProductCard } from '@/features/search/product-card/product-card/product-card';
import { ProductFilter } from '@/features/search/product-filter/product-filter/product-filter';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-master-search',
  imports: [CommonModule, FormsModule, ProductCard, ProductFilter],
  templateUrl: './master-search.html',
  styleUrl: './master-search.css',
})
export class MasterSearch implements OnInit {
  private productService = inject(ProductService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  Math = Math;

  products: Product[] = [];
  isLoading = false;

  currentPage = 1;
  limit = 12;
  totalItems = 0;

  activeFilters: ProductFilters = {};
  currentSort = 'relevance';

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading = true;
    this.productService
      .getProducts(this.currentPage, this.limit, this.activeFilters, this.currentSort)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          console.log('Real API Response:', res);
          this.products = res.products;
          this.totalItems = res.total;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('API Error:', err);
          this.isLoading = false;
          this.products = [];
        },
      });
  }

  onFiltersChanged(newFilters: ProductFilters) {
    this.activeFilters = newFilters;
    this.currentPage = 1;
    this.fetchProducts();
  }
  onSortChanged(newSort: string) {
    this.currentSort = newSort;
    this.currentPage = 1;
    this.fetchProducts();
  }
  changeLimit(newLimit: number) {
    this.limit = newLimit;
    this.currentPage = 1;
    this.fetchProducts();
  }
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.fetchProducts();
  }
  loadPage(page: number) {
    this.currentPage = page;
    // Scroll to top of products list smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.fetchProducts();
  }
}
