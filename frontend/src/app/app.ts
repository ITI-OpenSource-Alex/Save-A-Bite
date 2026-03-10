import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { Restaurants } from './features/home/restaurants/restaurants';
import { MasterSearch } from './features/search/master-search/master-search/master-search';
import { EcoSection } from './layout/eco-section/eco-section/eco-section';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    Footer,
    EcoSection,
    Restaurants,
    MasterSearch,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('gawafa_store');
}
