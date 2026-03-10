import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // Import Observable
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

  // Define an Observable stream instead of a static array
  categories$!: Observable<Category[]>;

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    const tempToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWFjY2VkZjZmMWY4OTUwZjMzZjYyNDEiLCJyb2xlIjoidXNlciIsImVtYWlsIjoidXNlckB0ZXN0LmNvbSIsImlhdCI6MTc3MzEyMjEwMCwiZXhwIjoxNzc1NzE0MTAwfQ.k2D20UHBUFTC-6xbR0rPQUXcJm-ZgzmWINBozJGiJlE';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${tempToken}`);

    // Assign the HTTP request directly to the Observable. No .subscribe() needed!
    this.categories$ = this.http.get<Category[]>(
      'http://localhost:3000/api/category/list',
      { headers }
    );
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