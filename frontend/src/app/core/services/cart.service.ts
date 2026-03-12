import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart, AddItemDto, UpdateItemDto, ApplyPromoCodeDto } from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:3000/api/cart';

  // public cartState = signal<Cart | null>(null); --> for cart icone in navbar

  getCart(): Observable<{ cart: Cart }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ cart: Cart }>(this.apiURL, { headers });
  }

  addItem(data: AddItemDto): Observable<{ cart: Cart }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ cart: Cart }>(`${this.apiURL}/add-item`, data, { headers });
  }

  updateItem(data: UpdateItemDto): Observable<{ cart: Cart }> {
    const headers = this.getAuthHeaders();
    return this.http.patch<{ cart: Cart }>(`${this.apiURL}/update-item`, data, { headers });
  }

  removeItem(productId: string): Observable<{ cart: Cart }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ cart: Cart }>(`${this.apiURL}/remove-item/${productId}`, { headers });
  }

  clearCart(): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ message: string }>(`${this.apiURL}/clear`, { headers });
  }

  applyPromoCode(data: ApplyPromoCodeDto): Observable<{ cart: Cart }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ cart: Cart }>(`${this.apiURL}/apply-promocode`, data, { headers });
  }

  removePromoCode(): Observable<{ cart: Cart }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ cart: Cart }>(`${this.apiURL}/remove-promocode`, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const tempToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWFhNjMzMjg4YmEyN2U1NWVkMTlhMzciLCJyb2xlIjoic3VwZXItYWRtaW4iLCJlbWFpbCI6InN1cGVyYWRtaW5Ac2F2ZWFiaXRlLmNvbSIsImlhdCI6MTc3MzIwMTgwOCwiZXhwIjoxNzc1NzkzODA4fQ.3kUFLKW_np7_EyxSM_V-yJRn63QQDA4Ow6Uz9Eo6ItA';
    return new HttpHeaders().set('Authorization', `Bearer ${tempToken}`);
  }
}
