// src/app/communication/forum-form/forum-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ForumService } from '../../core/services/forum.service';
import { AuthService } from '../../core/services/auth.service';
import { ForumPost } from '../../core/models/forum-post';

@Component({
  selector: 'app-forum-form',
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
    MatSnackBarModule
  ],
  templateUrl: './forum-form.component.html',
  styleUrls: ['./forum-form.component.scss']
})
export class ForumFormComponent implements OnInit {
  postForm: FormGroup;
  isEditMode = false;
  postId = 0;
  post: ForumPost | null = null;

  constructor(
    private fb: FormBuilder,
    private forumService: ForumService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.postForm = this.createPostForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.postId = +id;
      this.loadPost();
    }
  }

  createPostForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadPost(): void {
    this.forumService.getPostById(this.postId).subscribe({
      next: (post) => {
        this.post = post;
        
        // Kiểm tra quyền chỉnh sửa
        const currentUser = this.authService.currentUser;
        const isAdmin = this.authService.hasRole('Admin');
        
        if (!currentUser || (!isAdmin && currentUser.id !== post.userId)) {
          this.snackBar.open('Bạn không có quyền chỉnh sửa bài viết này', 'Đóng', { duration: 3000 });
          this.router.navigate(['/communication/forum']);
          return;
        }
        
        this.postForm.patchValue({
          title: post.title,
          content: post.content
        });
      },
      error: (err) => {
        console.error('Error loading post', err);
        this.snackBar.open('Không thể tải bài viết', 'Đóng', { duration: 3000 });
        this.router.navigate(['/communication/forum']);
      }
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const currentUser = this.authService.currentUser;
      if (!currentUser) {
        this.snackBar.open('Bạn cần đăng nhập để thực hiện thao tác này', 'Đóng', { duration: 3000 });
        return;
      }

      if (this.isEditMode) {
        this.updatePost();
      } else {
        this.createPost(currentUser.id);
      }
    }
  }

  createPost(userId: number): void {
    const newPost: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      title: this.postForm.value.title,
      content: this.postForm.value.content
    };
    
    this.forumService.createPost(newPost).subscribe({
      next: (post) => {
        this.snackBar.open('Tạo bài viết thành công', 'Đóng', { duration: 3000 });
        this.router.navigate(['/communication/forum', post.id]);
      },
      error: (err) => {
        console.error('Error creating post', err);
        this.snackBar.open('Không thể tạo bài viết', 'Đóng', { duration: 3000 });
      }
    });
  }

  updatePost(): void {
    if (!this.post) return;
    
    const updatedPost: Partial<ForumPost> = {
      title: this.postForm.value.title,
      content: this.postForm.value.content
    };
    
    this.forumService.updatePost(this.postId, updatedPost).subscribe({
      next: () => {
        this.snackBar.open('Cập nhật bài viết thành công', 'Đóng', { duration: 3000 });
        this.router.navigate(['/communication/forum', this.postId]);
      },
      error: (err) => {
        console.error('Error updating post', err);
        this.snackBar.open('Không thể cập nhật bài viết', 'Đóng', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    if (this.isEditMode) {
      this.router.navigate(['/communication/forum', this.postId]);
    } else {
      this.router.navigate(['/communication/forum']);
    }
  }
}