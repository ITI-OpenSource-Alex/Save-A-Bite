import { Injectable, OnDestroy,NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Subject, Observable } from 'rxjs';

export interface AppNotification {
  _id?: string;
  id?: string;
  message: string;
  resource: string;
  resourceId?: string;
  isRead?: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private socket!: Socket;
  
  private newNotificationSource = new Subject<AppNotification>();
  public newNotification$ = this.newNotificationSource.asObservable();

  private apiUrl = 'http://localhost:3000/api/notifications'; 

  constructor(private http: HttpClient, private ngZone: NgZone) {
    this.initSocket();
  }


  getNotificationHistory(): Observable<AppNotification[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<AppNotification[]>(this.apiUrl, { headers });
  }

  markAllAsRead(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/read-all`, {}, { headers });
  }


  private initSocket() {
    const token = localStorage.getItem('token');
    if (!token) return; 

    this.socket = io('http://localhost:3000', {
      auth: { token: token }
    });

    this.socket.on('connect', () => {
      console.log('🟢 [Socket] Connected securely to backend server!');
    });


    this.socket.on('notifications', (data: AppNotification) => {
      this.ngZone.run(() => {
      console.log('🔔 [Socket] LIVE NOTIFICATION RECEIVED:', data);
      this.newNotificationSource.next(data);
    });
    });

    this.socket.on('orderStatusChanged', (data: any) => {
      console.log('🔔 [Socket] Order status changed:', data);
      this.ngZone.run(() => {
      this.newNotificationSource.next({
        message: data.message,
        resource: 'order',
        resourceId: data.orderId,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    });
    });
  }
  

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}