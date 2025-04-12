// src/app/core/models/course.ts
export interface Course {
  id: number;
  name?: string;        // Giữ lại để tương thích với code cũ
  title: string;        // Thuộc tính mới theo database
  description: string;
  trainingPathId: number;
  type: 'Online' | 'Offline' | 'Video' | 'Document';
  durationHours: number;
  duration?: number;    // Giữ lại để tương thích với code cũ
  level?: 'beginner' | 'intermediate' | 'advanced';
  totalLessons?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}