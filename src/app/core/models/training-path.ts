// src/app/core/models/training-path.ts
export interface TrainingPath {
  id: number;
  name?: string;        // Giữ lại để tương thích với code cũ
  title: string;        // Thuộc tính mới theo database
  description: string;
  departmentId?: number;
  duration: 'ShortTerm' | 'LongTerm';
  createdBy: number;
  totalCourses?: number;
  durationInWeeks?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}