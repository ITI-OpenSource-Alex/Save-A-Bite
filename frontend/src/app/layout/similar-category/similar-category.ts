import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Product } from '@/core/models/product';

@Component({
  selector: 'app-similar-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './similar-category.html',
  styleUrl: './similar-category.css',
})
export class SimilarCategory implements OnInit {
  products: Product[] = [];
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/products'; // your backend endpoint

  ngOnInit(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (products) => (this.products = products),
      error: (err) => console.error('Failed to load products:', err),
    });
  }

  trackByName(index: number, product: Product) {
    return product.name;
  }
}
