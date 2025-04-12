import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Task } from '../../core/models/task';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  feedbackForm: FormGroup;
  isAdmin = false;
  isAssignedToCurrentUser = false;
  currentUserId = 0;
  
  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.feedbackForm = this.fb.group({
      score: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      feedback: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Admin');
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.currentUserId = currentUser.id;
    }
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTaskData(+id);
    } else {
      this.router.navigate(['/tasks/list']);
    }
  }

  loadTaskData(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.task = task;
        this.isAssignedToCurrentUser = task.assignedTo === this.currentUserId;
      },
      error: (err) => {
        console.error('Error loading task', err);
        this.snackBar.open('Không thể tải thông tin nhiệm vụ', 'Đóng', { duration: 3000 });
        this.router.navigate(['/tasks/list']);
      }
    });
  }

  getUserName(userId: number): string {
    // This will be replaced with actual user data from UserService
    return userId === 1 ? 'Administrator' : `User ${userId}`;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'Pending': return 'Chờ xử lý';
      case 'InProgress': return 'Đang thực hiện';
      case 'Completed': return 'Hoàn thành';
      case 'Rejected': return 'Từ chối';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'InProgress': return 'status-in-progress';
      case 'Pending': return 'status-pending';
      case 'Rejected': return 'status-rejected';
      default: return '';
    }
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  updateTaskStatus(status: 'InProgress' | 'Completed' | 'Rejected'): void {
    if (!this.task) return;
    
    this.taskService.updateTask(this.task.id, { status }).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
        this.snackBar.open('Cập nhật trạng thái thành công', 'Đóng', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error updating task status', err);
        this.snackBar.open('Không thể cập nhật trạng thái', 'Đóng', { duration: 3000 });
      }
    });
  }

  submitFeedback(): void {
    if (!this.task || !this.feedbackForm.valid) return;
    
    const { score, feedback } = this.feedbackForm.value;
    
    this.taskService.submitFeedback(this.task.id, score, feedback).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
        this.snackBar.open('Gửi đánh giá thành công', 'Đóng', { duration: 3000 });
        this.feedbackForm.reset();
      },
      error: (err) => {
        console.error('Error submitting feedback', err);
        this.snackBar.open('Không thể gửi đánh giá', 'Đóng', { duration: 3000 });
      }
    });
  }

  editTask(): void {
    if (!this.task) return;
    this.router.navigate(['/tasks/edit', this.task.id]);
  }

  backToList(): void {
    this.router.navigate(['/tasks/list']);
  }
}