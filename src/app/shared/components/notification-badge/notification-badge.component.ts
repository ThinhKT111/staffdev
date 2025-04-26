// src/app/shared/components/notification-badge/notification-badge.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Notification } from '../../../core/models/notification';

@Component({
  selector: 'app-notification-badge',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.scss']
})
export class NotificationBadgeComponent implements OnInit {
  @Input() count = 0;
  @Input() notifications: Notification[] = [];
  @Input() markAsRead: (id: number) => void = () => {};
  @Input() markAllAsRead: () => void = () => {};

  constructor() { }

  ngOnInit(): void {
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'Task': return 'assignment';
      case 'Assignment': return 'school';
      case 'Training': return 'menu_book';
      case 'General': return 'notifications';
      default: return 'notifications';
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays < 30) {
      return `${diffDays} ngày trước`;
    } else {
      return `${notificationDate.getDate().toString().padStart(2, '0')}/${(notificationDate.getMonth() + 1).toString().padStart(2, '0')}/${notificationDate.getFullYear()}`;
    }
  }
}