import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter, Observable } from 'rxjs';
import { ProductFilters } from '@/core/models/product';
import { ActivatedRoute } from '@angular/router';
import { Query } from '@angular/core';
export interface Category {
  _id: string;
  name: string;
  categoryStock: number;
  isActive?: boolean;
  search?: string;
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
  private route = inject(ActivatedRoute);

  // Define an Observable stream instead of a static array
  categories$!: Observable<Category[]>;

  ngOnInit() {
    this.fetchCategories();

    // Listen to the URL for query parameters
    this.route.queryParams.subscribe((params) => {
      this.filters = {};

      if (params['category']) {
        this.filters.category = params['category']; // This is the ID '65f1a...'
      }
      if (params['flashDeals'] === 'true') {
        this.filters.isFlashDeal = true;
      }

      if (params['search']) {
        this.filters.search = params['search'];
      }

      if (params['category']) {
        this.filters.category = params['category'];
      }
      this.applyFilters();
    });
  }

  fetchCategories() {
    const tempToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWFjY2VkZjZmMWY4OTUwZjMzZjYyNDEiLCJyb2xlIjoidXNlciIsImVtYWlsIjoidXNlckB0ZXN0LmNvbSIsImlhdCI6MTc3MzEyMjEwMCwiZXhwIjoxNzc1NzE0MTAwfQ.k2D20UHBUFTC-6xbR0rPQUXcJm-ZgzmWINBozJGiJlE';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${tempToken}`);

    // Assign the HTTP request directly to the Observable. No .subscribe() needed!
    this.categories$ = this.http.get<Category[]>('http://localhost:3000/api/category/list', {
      headers,
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
