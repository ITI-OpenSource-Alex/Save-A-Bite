import { Component , input} from '@angular/core';
import { RouterLink } from '@angular/router';
export interface Category {
  id: string;
  name: string;
  offers: number;
  icon: string;
}

@Component({
  selector: 'app-category-card',
  imports: [RouterLink],
  templateUrl: './category-card.html',
  styleUrl: './category-card.css',
})
export class CategoryCard {
  category = input.required<Category>();
}
