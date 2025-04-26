// src/app/communication/forum-list/forum-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { ForumService } from '../../core/services/forum.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { ForumPost } from '../../core/models/forum-post';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-forum-list',
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
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule // Added MatMenuModule here
  ],
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.scss']
})
export class ForumListComponent implements OnInit {
  posts: ForumPost[] = [];
  filteredPosts: ForumPost[] = [];
  users: User[] = [];
  searchControl = new FormControl('');
  
  isAdmin = false;
  currentUser: User | null = null;

  constructor(
    private forumService: ForumService,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Admin');
    this.currentUser = this.authService.currentUser;
    
    this.loadPosts();
    this.loadUsers();
    
    this.searchControl.valueChanges.subscribe(value => {
      this.filterPosts(value || '');
    });
  }

  loadPosts(): void {
    this.isLoading = true;
    this.forumService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.filteredPosts = posts;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading forum posts', err);
        this.snackBar.open('Không thể tải bài đăng', 'Đóng', { duration: 3000 });
        this.isLoading = false;
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

  filterPosts(searchText: string): void {
    if (!searchText) {
      this.filteredPosts = this.posts;
      return;
    }
    
    const searchLower = searchText.toLowerCase();
    this.filteredPosts = this.posts.filter(post => 
      post.title.toLowerCase().includes(searchLower) || 
      post.content.toLowerCase().includes(searchLower)
    );
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.fullName : 'Người dùng không xác định';
  }

  getUserAvatar(userId: number): string {
    // Temporary function to generate avatar text
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
    
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays < 30) {
      return `${diffDays} ngày trước`;
    } else {
      return `${postDate.getDate().toString().padStart(2, '0')}/${(postDate.getMonth() + 1).toString().padStart(2, '0')}/${postDate.getFullYear()}`;
    }
  }

  deletePost(postId: number): void {
    if (confirm('Bạn có chắc muốn xóa bài đăng này?')) {
      this.forumService.deletePost(postId).subscribe({
        next: () => {
          this.snackBar.open('Đã xóa bài đăng', 'Đóng', { duration: 3000 });
          this.loadPosts();
        },
        error: (err) => {
          console.error('Error deleting post', err);
          this.snackBar.open('Không thể xóa bài đăng', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  truncateContent(content: string, maxLength: number = 200): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}