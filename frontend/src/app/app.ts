import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationBellComponent } from './shared/components/notification-bell/notification-bell';
import { NotificationService } from './core/services/notification';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    // NotificationBellComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('gawafa_store');
  constructor(private notificationService: NotificationService) {}
}
