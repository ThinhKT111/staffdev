// src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { Notification } from '../models/notification';

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

  markAsRead(id: number): Observable<Notification> {
    return this.apiBaseService.patch<any>(`${this.endpoint}/${id}/read`, id, { isRead: true })
      .pipe(
        map(notification => this.mapNotificationFromApi(notification))
      );
  }

  markAllAsRead(userId: number): Observable<void> {
    return this.apiBaseService.post<void>(`${this.endpoint}/user/${userId}/mark-all-read`, {});
  }

  // Kết nối WebSocket
  connectToSocket(userId: number): void {
    if (!this.socket) {
      this.socket = io(environment.apiUrl.replace('/api', ''), {
        query: { userId: userId.toString() },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      
      this.socket.on('connect', () => {
        console.log('Connected to notification socket');
      });
      
      this.socket.on('disconnect', () => {
        console.log('Disconnected from notification socket');
      });
      
      this.socket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`Attempting to reconnect: ${attemptNumber}`);
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