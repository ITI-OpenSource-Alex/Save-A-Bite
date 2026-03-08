import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, delay } from 'rxjs';
import { Product, PaginatedResponse, ProductFilters } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:3000/products';

  private mockProducts: Product[] = [
    {
      id: '1',
      title: 'Python Machine Learning',
      category: 'Machine Learning',
      price: 769,
      imageUrl: 'https://via.placeholder.com/300x400/333/fff?text=Python+Machine+Learning',
    },
    {
      id: '2',
      title: 'Python Data Analysis',
      category: 'Data Analysis',
      price: 569,
      imageUrl: 'https://via.placeholder.com/300x400/007acc/fff?text=Data+Analysis',
    },
    {
      id: '3',
      title: 'Python Data Science',
      category: 'Data Science',
      price: 509,
      imageUrl: 'https://via.placeholder.com/300x400/4a5568/fff?text=Data+Science',
    },
    {
      id: '4',
      title: 'Python Deep Learning',
      category: 'Deep Learning',
      price: 509,
      imageUrl: 'https://via.placeholder.com/300x400/1a202c/fff?text=Deep+Learning',
    },
    {
      id: '5',
      title: 'Python Object-Oriented',
      category: 'OOP',
      price: 620,
      imageUrl: 'https://via.placeholder.com/300x400/2d3748/fff?text=OOP',
    },
    {
      id: '6',
      title: 'Python Tricks',
      category: 'Python Tricks',
      price: 450,
      imageUrl: 'https://via.placeholder.com/300x400/38b2ac/fff?text=Python+Tricks',
    },
  ];

  getMockProducts(
    page: number = 1,
    limit: number = 12,
    filters: ProductFilters = {},
    sort: string = 'relevance',
  ): Observable<PaginatedResponse<Product>> {
    let filteredData = [...this.mockProducts];

    if (filters.category) {
      filteredData = filteredData.filter((p) => p.category === filters.category);
    }

    if (filters.minPrice != null) {
      filteredData = filteredData.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice != null) {
      filteredData = filteredData.filter((p) => p.price <= filters.maxPrice!);
    }
    if (sort === 'price_asc') filteredData.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') filteredData.sort((a, b) => b.price - a.price);

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filteredData.slice(start, end);

    return of({
      // of takes a static variable and turns it into an observable
      data: paginatedData,
      total: filteredData.length,
      page: page,
      limit: limit,
    }).pipe(); // 500ms delay as network latecny simulation
  }

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
    if (filters.category) params = params.set('category', filters.category);
    if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice.toString());

    return this.http.get<PaginatedResponse<Product>>(this.apiURL, { params });
  }
}
