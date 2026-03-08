import { Component } from '@angular/core';
import {
  ProductCardComponent,
  ProductCardData,
} from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-flash-deals',
  imports: [ProductCardComponent],
  templateUrl: './flash-deals.html',
})
export class FlashDealsComponent {
  deals: ProductCardData[] = [
    {
      title: 'Grilled Chicken Bowl',
      restaurant: 'The Green Kitchen',
      description: 'Tender grilled chicken with quinoa and roasted vegetables',
      price: 7.99,
      oldPrice: 17.99,
      discount: 54,
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=765',
      stock: 3,
    },
    {
      title: 'Caesar Salad',
      restaurant: 'The Green Kitchen',
      description: 'Classic caesar with fresh romaine and house-made dressing',
      price: 31.99,
      oldPrice: 91.99,
      discount: 60,
      image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800',
      stock: 0,
    },
    {
      title: 'Green Detox Juice',
      restaurant: 'Juice & Joy',
      description: 'Kale, spinach, apple, ginger cold-pressed juice',
      price: 5.99,
      oldPrice: 8.99,
      discount: 63,
      image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800',
      stock: 8,
    },
    {
      title: 'Berry Smoothie Bowl',
      restaurant: 'Juice & Joy',
      description: 'Acai, blueberry, banana topped with granola',
      price: 4.99,
      oldPrice: 10.99,
      discount: 55,
      image: 'https://images.unsplash.com/photo-1537200900027-35a21559e661?w=600',
      stock: 3,
    },
  ];
}
