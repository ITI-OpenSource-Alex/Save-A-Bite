import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification } from '../../../core/services/notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.html'
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: AppNotification[] = [];
  unreadCount: number = 0;
  isOpen: boolean = false;
  private sub!: Subscription;

  constructor(private notificationService: NotificationService,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.notificationService.getNotificationHistory().subscribe({
      next: (response: any) => {
        
        const rawArray = response.notifications || [];
        this.notifications = rawArray.map((item: any) => {
          return {
            _id: item._id,
            isRead: item.isRead,
            createdAt: item.createdAt,
            message: item.notification?.message || item.message,
            resource: item.notification?.resource || item.resource,
            resourceId: item.notification?.resourceId || item.resourceId
          };
        });
        
        this.unreadCount = this.notifications.filter((n: any) => !n.isRead).length;
      },
      error: (err) => {
        console.error('Could not load history', err);
        this.notifications = []; 
      }
    });
    this.sub = this.notificationService.newNotification$.subscribe(newNotif => {
      this.notifications.unshift(newNotif); 
      
      if (!this.isOpen) {
        this.unreadCount++;
      }
      this.cdr.detectChanges(); 
    });
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;

    if (this.isOpen && this.unreadCount > 0) {
      this.unreadCount = 0;
      
      this.notificationService.markAllAsRead().subscribe({
        next: () => {
          this.notifications.forEach(n => n.isRead = true);
        },
        error: (err) => console.error('Failed to mark as read in DB', err)
      });
    }
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}