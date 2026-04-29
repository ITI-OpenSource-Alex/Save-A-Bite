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

public cartState = signal<Cart | null>(null);

  getCart(): Observable<{ cart: Cart }> {
    const headers = this.getAuthHeaders();
  return this.http.get<{ cart: Cart }>(this.apiURL, { headers }).pipe(
      tap(response => this.cartState.set(response.cart))
    );  
  }

  addItem(data: AddItemDto): Observable<{ cart: Cart }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ cart: Cart }>(`${this.apiURL}/add-item`, data, { headers }).pipe(
      tap(response => this.cartState.set(response.cart))
    );
  }

  updateItem(data: UpdateItemDto): Observable<{ cart: Cart }> {
    const headers = this.getAuthHeaders();
    return this.http.patch<{ cart: Cart }>(`${this.apiURL}/update-item`, data, { headers }
    ).pipe(
      tap(response => this.cartState.set(response.cart))
    );
  }

  removeItem(productId: string): Observable<{ cart: Cart }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ cart: Cart }>(`${this.apiURL}/remove-item/${productId}`, { headers })
    .pipe(
      tap(response => this.cartState.set(response.cart))
    );
  }

  clearCart(): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ message: string }>(`${this.apiURL}/clear`, { headers }).pipe(
      tap(response => this.cartState.set(null))
    );
  }

  applyPromoCode(data: ApplyPromoCodeDto): Observable<{ cart: Cart }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ cart: Cart }>(`${this.apiURL}/apply-promocode`, data, { headers })
    .pipe(
      tap(response => this.cartState.set(response.cart))
    );
  }

  removePromoCode(): Observable<{ cart: Cart }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ cart: Cart }>(`${this.apiURL}/remove-promocode`, { headers })
    .pipe(
      tap(response => this.cartState.set(response.cart))
    );
  }

  public getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }
}
