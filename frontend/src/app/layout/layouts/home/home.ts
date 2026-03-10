import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '@/layout/navbar/navbar';
import { Footer } from '@/layout/footer/footer';
import { EcoSection } from '@/layout/eco-section/eco-section/eco-section';
import { Restaurants } from '@/features/home/restaurants/restaurants';
import { FlashDealsComponent } from '@/features/home/flash-deals/flash-deals';
import { HeroSlider } from '@/features/home/hero-slider/hero-slider';
import { CategoriesSection } from '@/layout/categories-section/categories-section';
@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    Navbar,
    Footer,
    EcoSection,
    Restaurants,
    HeroSlider,
    FlashDealsComponent,
    CategoriesSection,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
