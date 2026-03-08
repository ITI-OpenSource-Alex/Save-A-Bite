import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ProductFilters } from '@/core/models/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter.html',
  styleUrl: './product-filter.css',
})
export class ProductFilter {
  @Output() filterChanged = new EventEmitter<ProductFilters>();
  filters: ProductFilters = {};

  categories = [
    { name: 'Meals', count: 2100 },
    { name: 'Desserts', count: 1951 },
    { name: 'Bakeries', count: 3089 },
    { name: 'Grocery', count: 894 },
    { name: 'Drinks', count: 1896 },
  ];
  selectCategory(categoryName?: string) {
    this.filters.category = categoryName;
    this.applyFilters();
  }
  applyFilters() {
    this.filterChanged.emit({ ...this.filters });
  }
}
