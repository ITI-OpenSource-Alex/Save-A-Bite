import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { HeroSlider } from './features/home/hero-slider/hero-slider';
import { FlashDealsComponent } from './features/home/flash-deals/flash-deals';
import { CategoriesSection } from './layout/categories-section/categories-section';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, HeroSlider, FlashDealsComponent, CategoriesSection],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('gawafa_store');
}
