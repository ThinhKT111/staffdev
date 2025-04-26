// src/app/shared/components/header/header.component.ts
import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { NotificationBadgeComponent } from '../notification-badge/notification-badge.component';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    NotificationBadgeComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();
  newNotificationsCount = 0;
  notifications: any[] = [];
  currentUser: any;
  private subscription: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Lấy thông tin người dùng hiện tại
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.loadNotifications(user.id);
        }
      })
    );
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  loadNotifications(userId: number) {
    this.subscription.add(
      this.notificationService.getNotifications(userId).subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          this.newNotificationsCount = notifications.filter(n => !n.isRead).length;
        },
        error: (err) => console.error('Error loading notifications', err)
      })
    );
  }

  markAsRead(notificationId: number) {
    this.subscription.add(
      this.notificationService.markAsRead(notificationId).subscribe({
        next: () => {
          // Cập nhật trạng thái đã đọc trong danh sách
          const notification = this.notifications.find(n => n.id === notificationId);
          if (notification && !notification.isRead) {
            notification.isRead = true;
            this.newNotificationsCount--;
          }
        },
        error: (err) => console.error('Error marking notification as read', err)
      })
    );
  }

  markAllAsRead() {
    if (!this.currentUser) return;
    
    this.subscription.add(
      this.notificationService.markAllAsRead(this.currentUser.id).subscribe({
        next: () => {
          // Cập nhật tất cả thông báo trong danh sách thành đã đọc
          this.notifications.forEach(n => n.isRead = true);
          this.newNotificationsCount = 0;
        },
        error: (err) => console.error('Error marking all notifications as read', err)
      })
    );
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}