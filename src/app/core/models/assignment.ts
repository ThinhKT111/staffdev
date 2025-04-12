// src/app/core/models/assignment.ts
export interface Assignment {
    id: number; // assignment_id
    courseId: number; // course_id
    title: string;
    description: string;
    maxSubmissions: number; // max_submissions
    deadline: Date;
    createdAt: Date; // created_at
  }