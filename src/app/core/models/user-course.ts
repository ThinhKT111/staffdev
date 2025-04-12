// src/app/core/models/user-course.ts
export interface UserCourse {
    id: number; // user_course_id
    userId: number; // user_id
    courseId: number; // course_id
    status: 'NotStarted' | 'InProgress' | 'Completed'; // status
    completionDate?: Date; // completion_date
    score?: number; // score
  }