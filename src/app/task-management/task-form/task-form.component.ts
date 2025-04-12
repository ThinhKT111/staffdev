import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: number | null = null;
  users: User[] = [];
  
  statusOptions = [
    { value: 'Pending', label: 'Chờ xử lý' },
    { value: 'InProgress', label: 'Đang thực hiện' },
    { value: 'Completed', label: 'Hoàn thành' },
    { value: 'Rejected', label: 'Từ chối' }
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assignedTo: [null, [Validators.required]],
      deadline: [new Date(), [Validators.required]],
      status: ['Pending', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.taskId = +id;
      this.loadTaskData(this.taskId);
    }
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.snackBar.open('Không thể tải danh sách người dùng', 'Đóng', { duration: 3000 });
      }
    });
  }

  loadTaskData(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          assignedTo: task.assignedTo,
          deadline: new Date(task.deadline),
          status: task.status
        });
      },
      error: (err) => {
        console.error('Error loading task', err);
        this.snackBar.open('Không thể tải thông tin nhiệm vụ', 'Đóng', { duration: 3000 });
        this.router.navigate(['/tasks/list']);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.isEditMode && this.taskId) {
        this.taskService.updateTask(this.taskId, this.taskForm.value).subscribe({
          next: () => {
            this.snackBar.open('Cập nhật nhiệm vụ thành công', 'Đóng', { duration: 3000 });
            this.router.navigate(['/tasks/list']);
          },
          error: (err) => {
            console.error('Error updating task', err);
            this.snackBar.open('Không thể cập nhật nhiệm vụ', 'Đóng', { duration: 3000 });
          }
        });
      } else {
        // Lấy ID người dùng đang đăng nhập làm người giao nhiệm vụ
        const formData = {
          ...this.taskForm.value,
          assignedBy: 1 // Hard-coded for now, should use AuthService to get current user ID
        };
        
        this.taskService.createTask(formData).subscribe({
          next: () => {
            this.snackBar.open('Tạo nhiệm vụ mới thành công', 'Đóng', { duration: 3000 });
            this.router.navigate(['/tasks/list']);
          },
          error: (err) => {
            console.error('Error creating task', err);
            this.snackBar.open('Không thể tạo nhiệm vụ mới', 'Đóng', { duration: 3000 });
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/tasks/list']);
  }
}