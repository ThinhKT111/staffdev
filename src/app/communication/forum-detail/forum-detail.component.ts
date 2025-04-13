// src/app/communication/forum-detail/forum-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ForumService } from '../../core/services/forum.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { ForumPost } from '../../core/models/forum-post';
import { ForumComment } from '../../core/models/forum-comment';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-forum-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.scss']
})
export class ForumDetailComponent implements OnInit {
  post: ForumPost | null = null;
  comments: ForumComment[] = [];
  users: User[] = [];
  commentForm: FormGroup;
  
  isAdmin = false;
  currentUser: User | null = null;
  postId = 0;

  constructor(
    private fb: FormBuilder,
    private forumService: ForumService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.commentForm = this.createCommentForm();
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Admin');
    this.currentUser = this.authService.currentUser;
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postId = +id;
      this.loadPost();
      this.loadComments();
      this.loadUsers();
    } else {
      this.router.navigate(['/communication/forum']);
    }
  }

  createCommentForm(): FormGroup {
    return this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  loadPost(): void {
    this.forumService.getPostById(this.postId).subscribe({
      next: (post) => {
        this.post = post;
      },
      error: (err) => {
        console.error('Error loading post', err);
        this.snackBar.open('Không thể tải bài đăng', 'Đóng', { duration: 3000 });
        this.router.navigate(['/communication/forum']);
      }
    });
  }

  loadComments(): void {
    this.forumService.getCommentsByPostId(this.postId).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (err) => {
        console.error('Error loading comments', err);
        this.snackBar.open('Không thể tải bình luận', 'Đóng', { duration: 3000 });
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  addComment(): void {
    if (this.commentForm.valid && this.currentUser) {
      const comment: Omit<ForumComment, 'id' | 'createdAt'> = {
        postId: this.postId,
        userId: this.currentUser.id,
        content: this.commentForm.value.content
      };
      
      this.forumService.createComment(comment).subscribe({
        next: () => {
          this.commentForm.reset({ content: '' });
          this.loadComments();
        },
        error: (err) => {
          console.error('Error adding comment', err);
          this.snackBar.open('Không thể thêm bình luận', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  deletePost(): void {
    if (confirm('Bạn có chắc muốn xóa bài đăng này?')) {
      this.forumService.deletePost(this.postId).subscribe({
        next: () => {
          this.snackBar.open('Đã xóa bài đăng', 'Đóng', { duration: 3000 });
          this.router.navigate(['/communication/forum']);
        },
        error: (err) => {
          console.error('Error deleting post', err);
          this.snackBar.open('Không thể xóa bài đăng', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  deleteComment(commentId: number): void {
    if (confirm('Bạn có chắc muốn xóa bình luận này?')) {
      this.forumService.deleteComment(commentId).subscribe({
        next: () => {
          this.snackBar.open('Đã xóa bình luận', 'Đóng', { duration: 3000 });
          this.loadComments();
        },
        error: (err) => {
          console.error('Error deleting comment', err);
          this.snackBar.open('Không thể xóa bình luận', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.fullName : 'Người dùng không xác định';
  }

  getUserAvatar(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    if (!user) return '??';
    
    const nameParts = user.fullName.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return '??';
  }

  formatDate(date: Date): string {
    if (!date) return '';
    
    const postDate = new Date(date);
    return `${postDate.getDate().toString().padStart(2, '0')}/${(postDate.getMonth() + 1).toString().padStart(2, '0')}/${postDate.getFullYear()} ${postDate.getHours().toString().padStart(2, '0')}:${postDate.getMinutes().toString().padStart(2, '0')}`;
  }

  canEditOrDelete(userId: number): boolean {
    return this.isAdmin || (this.currentUser !== null && this.currentUser.id === userId);
  }

  backToForum(): void {
    this.router.navigate(['/communication/forum']);
  }
}