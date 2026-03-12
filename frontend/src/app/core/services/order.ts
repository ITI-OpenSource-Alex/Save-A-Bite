import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderDto, Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  // Assuming the backend has /api/orders endpoint based on standard practices and previous conversations
  private apiURL = 'http://localhost:3000/api/orders';

  createOrder(data: CreateOrderDto): Observable<{ order: Order }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ order: Order }>(this.apiURL, data, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    // Note: Reusing the same debug token used in CartService / ProductService
    const tempToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWFhNjMzMjg4YmEyN2U1NWVkMTlhMzciLCJyb2xlIjoic3VwZXItYWRtaW4iLCJlbWFpbCI6InN1cGVyYWRtaW5Ac2F2ZWFiaXRlLmNvbSIsImlhdCI6MTc3MzIwMTgwOCwiZXhwIjoxNzc1NzkzODA4fQ.3kUFLKW_np7_EyxSM_V-yJRn63QQDA4Ow6Uz9Eo6ItA';
    return new HttpHeaders().set('Authorization', `Bearer ${tempToken}`);
  }
}
