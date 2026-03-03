import { Component } from '@angular/core';
import { CategoryCard, Category } from '@/features/home/category-cards/category-card/category-card';
@Component({
  selector: 'app-categories-section',
  imports: [CategoryCard],
  templateUrl: './categories-section.html',
  styleUrl: './categories-section.css',
})
export class CategoriesSection {
  categories: Category[] = [
    { id: 'meals', name: 'Meals', offers: 45, icon: '🍱' },
    { id: 'desserts', name: 'Desserts', offers: 32, icon: '🍰' },
    { id: 'bakeries', name: 'Bakeries', offers: 28, icon: '🥐' },
    { id: 'grocery', name: 'Grocery', offers: 19, icon: '🛒' },
    { id: 'drinks', name: 'Drinks', offers: 15, icon: '🥤' },
  ];
}
