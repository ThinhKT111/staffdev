import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent {
  tasks = [
    { id: 1, title: 'Hoàn thành báo cáo Q2', deadline: '2025-06-15', progress: 75, priority: 'Cao' },
    { id: 2, title: 'Thử nghiệm tính năng mới', deadline: '2025-06-10', progress: 30, priority: 'Trung bình' },
    { id: 3, title: 'Họp nhóm phát triển', deadline: '2025-06-08', progress: 0, priority: 'Thấp' },
    { id: 4, title: 'Cập nhật tài liệu API', deadline: '2025-06-20', progress: 10, priority: 'Trung bình' }
  ];

  courses = [
    { id: 1, title: 'Angular Fundamentals', totalLessons: 12, completedLessons: 8, image: 'assets/images/angular.png' },
    { id: 2, title: 'TypeScript Advanced', totalLessons: 10, completedLessons: 3, image: 'assets/images/typescript.png' },
    { id: 3, title: 'NodeJS Basics', totalLessons: 8, completedLessons: 0, image: 'assets/images/nodejs.png' }
  ];

  statistics = [
    { title: 'Nhiệm vụ', value: 8, icon: 'assignment', color: '#03a9f4' },
    { title: 'Khóa học', value: 5, icon: 'school', color: '#4caf50' },
    { title: 'Tiến độ', value: '65%', icon: 'trending_up', color: '#ff9800' },
    { title: 'Thành tích', value: 'A+', icon: 'emoji_events', color: '#f44336' }
  ];
}