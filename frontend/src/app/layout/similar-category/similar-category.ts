import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Product } from '@/core/models/product';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-similar-category',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './similar-category.html',
  styleUrl: './similar-category.css',
})
export class SimilarCategory implements OnChanges {
  @Input() categoryId!: string;
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/products';
  products$!: Observable<Product[]>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId'] && this.categoryId) {
      this.fetchSimilarProducts(this.categoryId);
    }
  }

  fetchSimilarProducts(categoryId: string) {
    const params = new HttpParams().set('category', categoryId).set('limit', '6');
    this.products$ = this.http
      .get<Product[]>(this.apiUrl, { params })
      .pipe(tap((res) => console.log(res)));
  }

  trackByName(index: number, product: Product) {
    return product.name;
  }
}
