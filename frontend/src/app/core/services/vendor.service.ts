import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VendorRequest {
  _id: string;
  userId: any;
  storeName: string;
  storeDescription: string;
  storePhone: string;
  storeEmail: string;
  storeLogoUrl?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: any;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorWithStore {
  vendor: any;
  store: any;
  productCount: number;
}

export interface CreateVendorRequestPayload {
  storeName: string;
  storeDescription: string;
  storePhone: string;
  storeEmail: string;
  storeLogoUrl?: string;
  message?: string;
  // Guest fields
  name?: string;
  email?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private API = 'http://localhost:3000/api/vendor-requests';

  constructor(private http: HttpClient) {}

  // ─── User endpoints ───────────────────────────────
  submitVendorRequest(data: CreateVendorRequestPayload): Observable<any> {
    return this.http.post(this.API, data);
  }

  getMyRequests(): Observable<{ data: VendorRequest[] }> {
    return this.http.get<{ data: VendorRequest[] }>(`${this.API}/my`);
  }

  getMyStore(): Observable<any> {
    return this.http.get(`${this.API}/my-store`);
  }

  // ─── Super Admin endpoints ────────────────────────
  getAllRequests(status?: string): Observable<{ data: VendorRequest[] }> {
    const query = status ? `?status=${status}` : '';
    return this.http.get<{ data: VendorRequest[] }>(`${this.API}${query}`);
  }

  reviewRequest(requestId: string, status: 'approved' | 'rejected', rejectionReason?: string): Observable<any> {
    return this.http.patch(`${this.API}/${requestId}/review`, { status, rejectionReason });
  }

  getAllVendors(): Observable<{ data: VendorWithStore[] }> {
    return this.http.get<{ data: VendorWithStore[] }>(`${this.API}/vendors/list`);
  }

  deleteVendor(vendorId: string): Observable<any> {
    return this.http.delete(`${this.API}/vendors/${vendorId}`);
  }

  // ─── Product endpoints for vendor dashboard ───────
  getCategories(): Observable<any> {
    return this.http.get('http://localhost:3000/api/category/list');
  }

  addProduct(storeId: string, productData: any): Observable<any> {
    return this.http.post(`http://localhost:3000/api/products/${storeId}`, productData);
  }

  updateProduct(productId: string, data: any): Observable<any> {
    return this.http.patch(`http://localhost:3000/api/products/${productId}`, data);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/products/${productId}`);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post('http://localhost:3000/api/upload', formData);
  }
}
