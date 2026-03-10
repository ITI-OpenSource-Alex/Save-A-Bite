import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { PaginatedResponse, ProductFilters } from '../models/product';


@Injectable({
  providedIn: 'root',
})
export class FlashDeals {
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:3000/api/products';


  getFlashDeals(
    page: number = 1,
    limit: number = 4, // Defaulting to 4 since flash deals sections are usually smaller
    filters: ProductFilters = {},
    sort: string = 'relevance'
  ): Observable<PaginatedResponse<Product>> {
    const tempToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWFjY2VkZjZmMWY4OTUwZjMzZjYyNDEiLCJyb2xlIjoidXNlciIsImVtYWlsIjoidXNlckB0ZXN0LmNvbSIsImlhdCI6MTc3MzEyMjEwMCwiZXhwIjoxNzc1NzE0MTAwfQ.k2D20UHBUFTC-6xbR0rPQUXcJm-ZgzmWINBozJGiJlE';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${tempToken}`);

      let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('isFlashDeal', 'true');

      return this.http.get<PaginatedResponse<Product>>(this.apiURL, { params, headers });
  }
}
