import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeyValue } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { Product } from '@/core/models/product';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NgIf } from '@angular/common';

const macros = {
  calories: 250,
  'protein in gm': 5,
  'fibers in gm': 7,
};

const ingredients = ['Suger', 'Butter', 'Milk', 'Eggs', 'Flour', 'Strawberry Surip', 'Lemons'];

const state = 'Fresh and ready to be served';

@Component({
  selector: 'app-product-page',
  imports: [FormsModule, AsyncPipe, NgIf],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
})
export class ProductPage {
  @Output() categorySelected = new EventEmitter<string>();
  quantity = 1;
  wishlistAdded = false;
  content: any = null;
  product$!: Observable<Product>;
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/products';
  private route = inject(ActivatedRoute);
  private productId = this.route.snapshot.paramMap.get('id');

  ngOnInit(): void {
    if (this.productId) {
      this.product$ = this.http
        .get<Product>(`${this.apiUrl}/${this.productId}`)
        .pipe(tap((res) => console.log(res)));
    }
  }

  macros = [
    { key: 'Calories', value: 250 },
    { key: 'Protein in gm', value: 5 },
    { key: 'Fibers in gm', value: 7 },
  ];

  ingredients = ['Sugar', 'Butter', 'Milk', 'Eggs', 'Flour', 'Strawberry Syrup', 'Lemons'];

  state = 'Fresh and ready to be served';

  increment() {
    if (this.quantity < 9) {
      this.quantity++;
    }
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  showMacros() {
    this.content = 'macros';
  }

  showIngredients() {
    this.content = 'ingredients';
  }

  showState() {
    this.content = 'state';
  }

  toggleWishlist() {
    this.wishlistAdded = !this.wishlistAdded;
  }
}
