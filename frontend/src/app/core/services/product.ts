import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, delay } from 'rxjs';
import { Product, PaginatedResponse, ProductFilters } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:3000/api/products';

  getProducts(
    page: number = 1,
    limit: number = 12,
    filters: ProductFilters = {},
    sort: string = 'relevance',
  ): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort);

    if (sort && sort !== 'relevance') {
      const [sortBy, sortDirection] = sort.split('_'); // splits 'price_asc'
      params = params.set('sortBy', sortBy).set('order', sortDirection);
    } else if (sort === 'relevance') {
      // Optional: Explicitly tell the API to sort by relevance if needed
      params = params.set('sortBy', 'relevance');
    }
    if (filters.isFlashDeal !== undefined) {
      params = params.set('isFlashDeal', filters.isFlashDeal.toString());
    }
    if (filters.category) params = params.set('category', filters.category);
    if (filters.storeId) params = params.set('storeId', filters.storeId);
    if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.search) params = params.set('search', filters.search);

    return this.http.get<PaginatedResponse<Product>>(this.apiURL, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiURL}/${id}`);
  }
}
