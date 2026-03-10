import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { HeroSlider } from './features/home/hero-slider/hero-slider';
import { FlashDealsComponent } from './features/home/flash-deals/flash-deals';
import { CategoriesSection } from './layout/categories-section/categories-section';
import { EcoSection } from './layout/eco-section/eco-section';
import { Footer } from './layout/footer/footer';
import { Restaurants } from './features/home/restaurants/restaurants';
import { MasterSearch } from './features/search/master-search/master-search/master-search';
import { SimilarCategory } from './layout/similar-category/similar-category';
import { ProductPage } from './layout/product-page/product-page';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    HeroSlider,
    FlashDealsComponent,
    CategoriesSection,
    Footer,
    EcoSection,
    Restaurants,
    MasterSearch,
    SimilarCategory,
    ProductPage,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('gawafa_store');
}
