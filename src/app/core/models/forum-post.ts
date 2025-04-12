// src/app/core/models/forum-post.ts
export interface ForumPost {
    id: number; // post_id
    userId: number; // user_id
    title: string;
    content: string;
    createdAt: Date; // created_at
    updatedAt?: Date; // updated_at
  }