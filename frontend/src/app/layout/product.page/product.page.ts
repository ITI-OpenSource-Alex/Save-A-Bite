import { Component } from '@angular/core';

const contentDiv = document.getElementById('content') as HTMLDivElement;
const input = document.getElementById('quantity') as HTMLInputElement | null;
const wishlist_add = document.getElementById('wishlist-add') as HTMLParagraphElement | null;
const checkbox = document.getElementById('checkChecked') as HTMLInputElement;

const macros = {
  calories: 250,
  'protein in gm': 5,
  'fibers in gm': 7,
};

const ingredients = ['Suger', 'Butter', 'Milk', 'Eggs', 'Flour', 'Strawberry Surip', 'Lemons'];

const state = 'Fresh and ready to be served';

@Component({
  selector: 'app-product.page',
  imports: [],
  templateUrl: './product.page.html',
  styleUrl: './product.page.css',
})
export class ProductPage {
  incerment() {
    if (!input) {
      return;
    }
    const currentValue = parseInt(input.value) || 0;
    if (currentValue < 9) {
      input.value = (currentValue + 1).toString();
    } else {
      input.value = currentValue.toString();
    }
  }
  decerment() {
    if (!input) {
      return;
    }
    const currentValue = parseInt(input.value);
    if (currentValue > 0) {
      input.value = (currentValue - 1).toString();
    } else {
      input.value = currentValue.toString();
    }
  }

  macrosContent() {
    if (!contentDiv) return;
    let html = '<ul>';
    for (const key in macros) {
      html += `<li><strong>${key}</strong>: ${macros[key as keyof typeof macros]}</li>`;
    }
    html += '</ul>';
    contentDiv.innerHTML = html;
  }
  indregientsContent() {
    if (!contentDiv) return;

    let html = '<ul>';

    ingredients.forEach((item) => {
      html += `<li>${item}</li>`;
    });

    html += '</ul>';
    contentDiv.innerHTML = html;
  }
  stateContent() {
    if (!contentDiv) return;
    contentDiv.innerHTML = `<p>${state}</p>`;
  }
  toggleWishlist() {
    if (wishlist_add && checkbox) {
      checkbox.addEventListener('change', () => {
        wishlist_add.textContent = checkbox.checked ? 'Added to wishlist' : 'Add to wishlist';
      });
    }
  }
}
