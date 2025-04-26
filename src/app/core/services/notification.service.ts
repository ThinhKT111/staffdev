// src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';

interface Notification {
  id: number; // notification_id
  userId: number; // user_id
  title: string;
  content: string;
  type: 'Task' | 'Assignment' | 'Training' | 'General';
  isRead: boolean; // is_read
  createdAt: Date; // created_at
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private endpoint = 'notifications';
  private socket: Socket | null = null;

  constructor(private apiBaseService: ApiBaseService) { }

  private mapNotificationFromApi(apiNotification: any): Notification {
    return {
      id: apiNotification.notification_id,
      userId: apiNotification.user_id,
      title: apiNotification.title,
      content: apiNotification.content,
      type: apiNotification.type,
      isRead: apiNotification.is_read,
      createdAt: new Date(apiNotification.created_at)
    };
  }

  getNotifications(userId: number): Observable<Notification[]> {
    return this.apiBaseService.get<any[]>(`${this.endpoint}?userId=${userId}`)
      .pipe(
        map((notifications: any[]) => notifications.map(notification => this.mapNotificationFromApi(notification)))
      );
  }

  getNotificationById(id: number): Observable<Notification> {
    return this.apiBaseService.getById<any>(this.endpoint, id)
      .pipe(
        map(notification => this.mapNotificationFromApi(notification))
      );
  }

  createNotification(notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Observable<Notification> {
    const apiNotification = {
      user_id: notification.userId,
      title: notification.title,
      content: notification.content,
      type: notification.type
    };
    
    return this.apiBaseService.post<any>(this.endpoint, apiNotification)
      .pipe(
        map(response => this.mapNotificationFromApi(response))
      );
  }

  markAsRead(id: number): Observable<Notification> {
    return this.apiBaseService.patch<any>(`${this.endpoint}/${id}/read`, { isRead: true })
      .pipe(
        map(notification => this.mapNotificationFromApi(notification))
      );
  }

  markAllAsRead(userId: number): Observable<void> {
    return this.apiBaseService.post<void>(`${this.endpoint}/user/${userId}/mark-all-read`, {});
  }

  deleteNotification(id: number): Observable<void> {
    return this.apiBaseService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Real-time notifications
  connectToSocket(userId: number): void {
    if (!this.socket) {
      this.socket = io(environment.apiUrl.replace('/api', ''), {
        query: { userId: userId.toString() }
      });
    }
  }
  
  disconnectFromSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  onNewNotification(callback: (notification: Notification) => void): void {
    if (this.socket) {
      this.socket.on('notification', (notification: any) => {
        callback(this.mapNotificationFromApi(notification));
      });
    }
  }
}