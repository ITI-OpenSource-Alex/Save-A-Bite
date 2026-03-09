import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeyValue } from '@angular/common';

const macros = {
  calories: 250,
  'protein in gm': 5,
  'fibers in gm': 7,
};

const ingredients = ['Suger', 'Butter', 'Milk', 'Eggs', 'Flour', 'Strawberry Surip', 'Lemons'];

const state = 'Fresh and ready to be served';

@Component({
  selector: 'app-product-page',
  imports: [FormsModule],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
})
export class ProductPage {
  quantity = 1;
  wishlistAdded = false;
  content: any = null;

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
