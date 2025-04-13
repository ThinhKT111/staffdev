// src/app/core/services/forum.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { ForumPost } from '../models/forum-post';
import { ForumComment } from '../models/forum-comment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private postEndpoint = 'forum/posts';
  private commentEndpoint = 'forum/comments';

  // Dữ liệu mẫu
  private mockPosts: ForumPost[] = [
    {
      id: 1,
      userId: 1,
      title: 'Giới thiệu với mọi người về hệ thống StaffDev',
      content: 'Xin chào mọi người, tôi rất vui mừng được giới thiệu hệ thống StaffDev mới của công ty chúng ta. Đây là một nền tảng để quản lý và phát triển nhân viên với nhiều tính năng hữu ích.',
      createdAt: new Date('2025-04-01T10:30:00'),
      updatedAt: new Date('2025-04-01T10:30:00')
    },
    {
      id: 2,
      userId: 2,
      title: 'Hỏi về khóa học Angular cơ bản',
      content: 'Tôi là nhân viên mới và muốn tìm hiểu về khóa học Angular cơ bản. Mọi người có thể giới thiệu cho tôi một số tài liệu hoặc chia sẻ kinh nghiệm học Angular không?',
      createdAt: new Date('2025-04-05T14:15:00'),
      updatedAt: new Date('2025-04-05T14:15:00')
    },
    {
      id: 3,
      userId: 1,
      title: 'Sắp tới có sự kiện đào tạo nào không?',
      content: 'Dạo này công ty có kế hoạch tổ chức các sự kiện đào tạo nào không? Tôi muốn tham gia để nâng cao kỹ năng của mình.',
      createdAt: new Date('2025-04-08T09:45:00'),
      updatedAt: new Date('2025-04-08T09:45:00')
    }
  ];

  private mockComments: ForumComment[] = [
    {
      id: 1,
      postId: 1,
      userId: 2,
      content: 'Chào Admin, cảm ơn vì hệ thống tuyệt vời. Tôi đã thử sử dụng và thấy rất dễ dàng.',
      createdAt: new Date('2025-04-01T13:20:00')
    },
    {
      id: 2,
      postId: 1,
      userId: 1,
      content: 'Cảm ơn phản hồi của bạn. Sắp tới chúng tôi sẽ cập nhật thêm nhiều tính năng mới.',
      createdAt: new Date('2025-04-01T15:10:00')
    },
    {
      id: 3,
      postId: 2,
      userId: 1,
      content: 'Bạn có thể tham khảo các tài liệu trong mục Tài liệu trên hệ thống. Tôi đã thêm một số tài liệu về Angular cơ bản.',
      createdAt: new Date('2025-04-05T16:30:00')
    },
    {
      id: 4,
      postId: 3,
      userId: 2,
      content: 'Tôi cũng quan tâm đến vấn đề này. Mong nhận được thông tin từ Admin.',
      createdAt: new Date('2025-04-09T10:15:00')
    }
  ];

  constructor(private apiBaseService: ApiBaseService) { }

  getPosts(): Observable<ForumPost[]> {
    return of(this.mockPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    // return this.apiBaseService.get<ForumPost[]>(this.postEndpoint);
  }

  getPostById(id: number): Observable<ForumPost> {
    const post = this.mockPosts.find(p => p.id === id);
    if (post) {
      return of(post);
    }
    throw new Error('Post not found');
    // return this.apiBaseService.getById<ForumPost>(this.postEndpoint, id);
  }

  createPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt'>): Observable<ForumPost> {
    const now = new Date();
    const newPost: ForumPost = {
      ...post,
      id: this.mockPosts.length + 1,
      createdAt: now,
      updatedAt: now
    };
    
    this.mockPosts.push(newPost);
    return of(newPost);
    // return this.apiBaseService.post<ForumPost>(this.postEndpoint, post);
  }

  updatePost(id: number, post: Partial<ForumPost>): Observable<ForumPost> {
    const index = this.mockPosts.findIndex(p => p.id === id);
    if (index !== -1) {
      const updatedPost = {
        ...this.mockPosts[index],
        ...post,
        updatedAt: new Date()
      };
      
      this.mockPosts[index] = updatedPost;
      return of(updatedPost);
    }
    
    throw new Error('Post not found');
    // return this.apiBaseService.put<ForumPost>(`${this.postEndpoint}/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    const index = this.mockPosts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPosts.splice(index, 1);
      
      // Xóa cả comments liên quan
      const commentsToDelete = this.mockComments.filter(c => c.postId === id);
      commentsToDelete.forEach(comment => {
        const commentIndex = this.mockComments.findIndex(c => c.id === comment.id);
        if (commentIndex !== -1) {
          this.mockComments.splice(commentIndex, 1);
        }
      });
      
      return of(undefined);
    }
    
    throw new Error('Post not found');
    // return this.apiBaseService.delete<void>(`${this.postEndpoint}/${id}`);
  }

  getCommentsByPostId(postId: number): Observable<ForumComment[]> {
    const comments = this.mockComments.filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    return of(comments);
    // return this.apiBaseService.get<ForumComment[]>(`${this.commentEndpoint}?postId=${postId}`);
  }

  createComment(comment: Omit<ForumComment, 'id' | 'createdAt'>): Observable<ForumComment> {
    const newComment: ForumComment = {
      ...comment,
      id: this.mockComments.length + 1,
      createdAt: new Date()
    };
    
    this.mockComments.push(newComment);
    return of(newComment);
    // return this.apiBaseService.post<ForumComment>(this.commentEndpoint, comment);
  }

  deleteComment(id: number): Observable<void> {
    const index = this.mockComments.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockComments.splice(index, 1);
      return of(undefined);
    }
    
    throw new Error('Comment not found');
    // return this.apiBaseService.delete<void>(`${this.commentEndpoint}/${id}`);
  }
}