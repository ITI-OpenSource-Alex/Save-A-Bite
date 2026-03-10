import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  inject,
  DestroyRef,
  ChangeDetectorRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductFilters } from '@/core/models/product';

export interface Category {
  _id: string;
  name: string;
  categoryStock: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-product-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter.html',
  styleUrl: './product-filter.css',
})
export class ProductFilter implements OnInit {
  @Output() filterChanged = new EventEmitter<ProductFilters>();
  filters: ProductFilters = {};

  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    // 1. Add your temporary token
    const tempToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWFjY2VkZjZmMWY4OTUwZjMzZjYyNDEiLCJyb2xlIjoidXNlciIsImVtYWlsIjoidXNlckB0ZXN0LmNvbSIsImlhdCI6MTc3MzEyMjEwMCwiZXhwIjoxNzc1NzE0MTAwfQ.k2D20UHBUFTC-6xbR0rPQUXcJm-ZgzmWINBozJGiJlE';

    // 2. Create the Authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${tempToken}`);

    // 3. Pass the headers in the options object
    this.http
      .get<Category[]>('http://localhost:3000/api/category/list', { headers })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          // Note: If your API wraps the response (e.g., { data: [...] }),
          // you will need to map it here like you did for products: this.categories = res.data
          this.categories = res;
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Failed to load categories', err),
      });
  }

  selectCategory(categoryId?: string) {
    if (categoryId) {
      this.filters.category = categoryId;
    } else {
      delete this.filters.category;
    }
    this.applyFilters();
  }

  applyFilters() {
    this.filterChanged.emit({ ...this.filters });
  }
}
