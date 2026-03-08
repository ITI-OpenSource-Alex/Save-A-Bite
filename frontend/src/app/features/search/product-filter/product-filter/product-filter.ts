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
    { name: 'Software Engineering', count: 2100 },
    { name: 'Technology', count: 1951 },
    { name: 'AI & Data Science', count: 3089 },
    { name: 'DevOps & Cloud', count: 894 },
    { name: 'Security & Hardware', count: 1896 },
  ];
  selectCategory(categoryName?: string) {
    this.filters.category = categoryName;
    this.applyFilters();
  }
  applyFilters() {
    this.filterChanged.emit({ ...this.filters });
  }
}
