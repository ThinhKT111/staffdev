import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Task } from '../../core/models/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'deadline', 'status', 'assignedBy', 'actions'];
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchControl = new FormControl('');
  isAdmin = false;
  currentUserId = 0;
  
  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Admin');
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.currentUserId = currentUser.id;
    }
    this.loadTasks();
  }

  loadTasks(): void {
    if (this.isAdmin) {
      // Admin sees all tasks
      this.taskService.getTasks().subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filteredTasks = tasks;
        },
        error: (err) => {
          console.error('Error loading tasks', err);
          this.snackBar.open('Không thể tải danh sách nhiệm vụ', 'Đóng', { duration: 3000 });
        }
      });
    } else {
      // Regular users see only their assigned tasks
      this.taskService.getTasksByUser(this.currentUserId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filteredTasks = tasks;
        },
        error: (err) => {
          console.error('Error loading tasks', err);
          this.snackBar.open('Không thể tải danh sách nhiệm vụ', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredTasks = this.tasks.filter(task => 
      task.title.toLowerCase().includes(filterValue) || 
      task.description.toLowerCase().includes(filterValue) || 
      this.formatDate(task.deadline).toLowerCase().includes(filterValue) ||
      this.getStatusText(task.status).toLowerCase().includes(filterValue)
    );
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
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  deleteTask(id: number): void {
    if (confirm('Bạn có chắc muốn xóa nhiệm vụ này?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.snackBar.open('Xóa nhiệm vụ thành công', 'Đóng', { duration: 3000 });
          this.loadTasks();
        },
        error: (err) => {
          console.error('Error deleting task', err);
          this.snackBar.open('Không thể xóa nhiệm vụ', 'Đóng', { duration: 3000 });
        }
      });
    }
  }
}