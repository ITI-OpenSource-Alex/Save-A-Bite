import { Component } from '@angular/core';

interface FlashDeal {
  id: number;
  title: string;
  restaurant: string;
  description: string;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
  left: number;
  expired: boolean;
}

@Component({
  selector: 'app-flash-deals',
  templateUrl: './flash-deals.html',
})
export class FlashDealsComponent {
  deals: FlashDeal[] = [
    {
      id: 1,
      title: 'Grilled Chicken Bowl',
      restaurant: 'The Green Kitchen',
      description: 'Tender grilled chicken with quinoa and roasted vegetables',
      price: 7.99,
      oldPrice: 17.99,
      discount: 54,
      image:
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      left: 3,
      expired: false,
    },
    {
      id: 2,
      title: 'Caesar Salad',
      restaurant: 'The Green Kitchen',
      description: 'Classic caesar with fresh romaine and house-made dressing',
      price: 31.99,
      oldPrice: 91.99,
      discount: 60,
      image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800',
      left: 5,
      expired: true,
    },
    {
      id: 3,
      title: 'Green Detox Juice',
      restaurant: 'Juice & Joy',
      description: 'Kale, spinach, apple, ginger cold-pressed juice',
      price: 5.99,
      oldPrice: 8.99,
      discount: 63,
      image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800',
      left: 8,
      expired: false,
    },
    {
      id: 4,
      title: 'Berry Smoothie Bowl',
      restaurant: 'Juice & Joy',
      description: 'Acai, blueberry, banana topped with granola',
      price: 4.99,
      oldPrice: 10.99,
      discount: 55,
      image:
        'https://images.unsplash.com/photo-1537200900027-35a21559e661?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRlc2VydHN8ZW58MHx8MHx8fDA%3D',
      left: 3,
      expired: false,
    },
  ];
}
