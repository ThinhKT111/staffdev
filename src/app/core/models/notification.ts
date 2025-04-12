// src/app/core/models/notification.ts
export interface Notification {
    id: number; // notification_id
    userId: number; // user_id
    title: string;
    content: string;
    type: 'Task' | 'Assignment' | 'Training' | 'General';
    isRead: boolean; // is_read
    createdAt: Date; // created_at
  }