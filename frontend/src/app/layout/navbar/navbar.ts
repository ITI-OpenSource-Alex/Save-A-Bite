import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZardInputDirective } from '@/shared/components/input/input.directive';
import { LucideAngularModule, Bell, ShoppingCart } from 'lucide-angular';
import { NotificationService, AppNotification } from '@/core/services/notification';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '@/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [ZardInputDirective, LucideAngularModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  isMenuOpen = false;
  protected readonly bellIcon = Bell;
  protected readonly shoppingCartIcon = ShoppingCart;

  notifications: AppNotification[] = [];
  unreadCount: number = 0;
  isNotifOpen: boolean = false;
  private sub!: Subscription;

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.notificationService.getNotificationHistory().subscribe({
      next: (response: any) => {
        const rawArray = response.notifications || [];
        this.notifications = rawArray.map((item: any) => ({
          _id: item._id,
          isRead: item.isRead,
          createdAt: item.createdAt,
          message: item.notification?.message || item.message,
          resource: item.notification?.resource || item.resource,
          resourceId: item.notification?.resourceId || item.resourceId,
        }));
        this.unreadCount = this.notifications.filter((n: any) => !n.isRead).length;
      },
      error: (err) => {
        console.error('Could not load history', err);
        this.notifications = [];
      },
    });
    this.sub = this.notificationService.newNotification$.subscribe((newNotif) => {
      this.notifications.unshift(newNotif);
      if (!this.isNotifOpen) {
        this.unreadCount++;
      }
      this.cdr.detectChanges();
    });
  }

  toggleNotif() {
    this.isNotifOpen = !this.isNotifOpen;
    if (this.isNotifOpen && this.unreadCount > 0) {
      this.unreadCount = 0;
      this.notificationService.markAllAsRead().subscribe({
        next: () => {
          this.notifications.forEach((n) => (n.isRead = true));
        },
        error: (err) => console.error('Failed to mark as read in DB', err),
      });
    }
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
  onSearch(term: string) {
    const search = term.trim();
    this.router.navigate(['/browse'], {
      queryParams: search ? { search } : {},
    });
  }
}
