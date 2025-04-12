// src/app/core/models/forum-comment.ts
export interface ForumComment {
    id: number; // comment_id
    postId: number; // post_id
    userId: number; // user_id
    content: string;
    createdAt: Date; // created_at
  }