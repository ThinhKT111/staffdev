import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

interface Notification {
  id: number;
  type: 'task' | 'course' | 'system' | 'alert';
  message: string;
  time: string;
  read: boolean;
}

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
  
  notifications: Notification[] = [
    {
      id: 1,
      type: 'task',
      message: 'Nhiệm vụ mới "Báo cáo tiến độ dự án" đã được giao cho bạn',
      time: '5 phút trước',
      read: false
    },
    {
      id: 2,
      type: 'course',
      message: 'Bạn đã hoàn thành khóa học "Angular Fundamentals"',
      time: '2 giờ trước',
      read: false
    },
    {
      id: 3,
      type: 'system',
      message: 'Hệ thống sẽ bảo trì lúc 22:00 tối nay',
      time: 'Hôm nay, 14:30',
      read: true
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'task': return 'assignment';
      case 'course': return 'school';
      case 'system': return 'info';
      case 'alert': return 'warning';
      default: return 'notifications';
    }
  }
}