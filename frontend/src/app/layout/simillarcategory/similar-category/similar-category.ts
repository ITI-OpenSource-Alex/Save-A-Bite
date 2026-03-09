import { Component } from '@angular/core';

interface Store {
  name: string;
  description: string;
  image: string;
  rating: number;
  distance: number;
}

@Component({
  selector: 'app-similar-category',
  imports: [],
  templateUrl: './similar-category.html',
  styleUrl: './similar-category.css',
})
export class SimilarCategory {
  stores: Store[] = [
    {
      name: 'Green Garden',
      description: 'Healthy meals and fresh organic ingredients.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      rating: 4.7,
      distance: 1.2,
    },
    {
      name: 'Italiano Pizza',
      description: 'Authentic Italian pizza baked in a stone oven.',
      image:
        'https://images.unsplash.com/photo-1724232822245-f430d53466e0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fHBpenphJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
      rating: 4.5,
      distance: 0.9,
    },

    {
      name: 'Burger Hub',
      description: 'Juicy burgers with premium beef and fresh buns.',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
      rating: 4.6,
      distance: 2.1,
    },
    {
      name: 'Spice Village',
      description: 'Traditional Indian dishes with rich spices.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
      rating: 4.4,
      distance: 1.5,
    },
    {
      name: 'Ocean Sushi',
      description: 'Fresh sushi and Japanese specialties.',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
      rating: 4.8,
      distance: 2.7,
    },
    {
      name: 'Morning Cafe',
      description: 'Cozy cafe serving breakfast and specialty coffee.',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
      rating: 4.3,
      distance: 0.6,
    },
  ];
}
