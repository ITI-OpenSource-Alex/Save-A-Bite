import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductLayout } from './layout/layouts/product-layout/product-layout/product-layout';
import { Navbar } from './layout/navbar/navbar';
// import { Footer } from './layout/footer/footer';
// import { Restaurants } from './features/home/restaurants/restaurants';
// import { MasterSearch } from './features/search/master-search/master-search/master-search';
// import { EcoSection } from './layout/eco-section/eco-section/eco-section';
import { NotificationBellComponent } from './shared/components/notification-bell/notification-bell';
import { NotificationService } from './core/services/notification';

@Component({
  selector: 'app-root',
  imports: [ProductLayout, Navbar, RouterOutlet,NotificationBellComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('gawafa_store');
  constructor(private notificationService: NotificationService) {}

}

