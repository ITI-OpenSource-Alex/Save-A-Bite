import { Component } from '@angular/core';
// import { EcoSection } from '@/layout/eco-section/eco-section/eco-section';
import { Restaurants } from '@/features/home/restaurants/restaurants';
import { FlashDealsComponent } from '@/features/home/flash-deals/flash-deals';
import { HeroSlider } from '@/features/home/hero-slider/hero-slider';
import { CategoriesSection } from '@/layout/categories-section/categories-section';
import { ProductLayout } from '../product-layout/product-layout/product-layout';

@Component({
  selector: 'app-home',
  imports: [Restaurants, HeroSlider, FlashDealsComponent, CategoriesSection, ProductLayout],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
