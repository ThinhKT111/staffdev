// src/app/core/services/forum.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { ForumPost } from '../models/forum-post';
import { ForumComment } from '../models/forum-comment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private postsEndpoint = 'forum/posts';
  private commentsEndpoint = 'forum/comments';

  constructor(private apiBaseService: ApiBaseService) { }

  getPosts(): Observable<ForumPost[]> {
    return this.apiBaseService.get<any[]>(this.postsEndpoint)
      .pipe(
        map((posts: any[]) => posts.map(post => this.mapPostFromApi(post)))
      );
  }
  
  getPostById(id: number): Observable<ForumPost> {
    return this.apiBaseService.getById<any>(this.postsEndpoint, id)
      .pipe(
        map(post => this.mapPostFromApi(post))
      );
  }
  
  createPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt'>): Observable<ForumPost> {
    const apiPost = {
      title: post.title,
      content: post.content,
      user_id: post.userId
    };
    
    return this.apiBaseService.post<any>(this.postsEndpoint, apiPost)
      .pipe(
        map(response => this.mapPostFromApi(response))
      );
  }
  
  updatePost(id: number, post: Partial<ForumPost>): Observable<ForumPost> {
    const apiPost: any = {};
    if (post.title) apiPost.title = post.title;
    if (post.content) apiPost.content = post.content;
    
    return this.apiBaseService.put<any>(this.postsEndpoint, id, apiPost)
      .pipe(
        map(response => this.mapPostFromApi(response))
      );
  }
  
  deletePost(id: number): Observable<void> {
    return this.apiBaseService.delete<void>(this.postsEndpoint, id);
  }
  
  getCommentsByPostId(postId: number): Observable<ForumComment[]> {
    return this.apiBaseService.get<any[]>(`${this.postsEndpoint}/${postId}/comments`)
      .pipe(
        map((comments: any[]) => comments.map(comment => this.mapCommentFromApi(comment)))
      );
  }
  
  createComment(comment: Omit<ForumComment, 'id' | 'createdAt'>): Observable<ForumComment> {
    const apiComment = {
      content: comment.content,
      post_id: comment.postId,
      user_id: comment.userId
    };
    
    return this.apiBaseService.post<any>(this.commentsEndpoint, apiComment)
      .pipe(
        map(response => this.mapCommentFromApi(response))
      );
  }
  
  deleteComment(id: number): Observable<void> {
    return this.apiBaseService.delete<void>(this.commentsEndpoint, id);
  }
  
  private mapPostFromApi(apiPost: any): ForumPost {
    return {
      id: apiPost.post_id,
      userId: apiPost.user_id,
      title: apiPost.title,
      content: apiPost.content,
      createdAt: new Date(apiPost.created_at),
      updatedAt: apiPost.updated_at ? new Date(apiPost.updated_at) : undefined
    };
  }
  
  private mapCommentFromApi(apiComment: any): ForumComment {
    return {
      id: apiComment.comment_id,
      postId: apiComment.post_id,
      userId: apiComment.user_id,
      content: apiComment.content,
      createdAt: new Date(apiComment.created_at)
    };
  }
}