// src/app/user-management/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UserService } from '../../core/services/user.service';
import { DepartmentService } from '../../core/services/department.service';
import { User } from '../../core/models/user';
import { Department } from '../../core/models/department';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  departments: Department[] = [];

  isLoading = false;
  
  roles = [
    { value: 'Admin', label: 'Admin' },
    { value: 'TeamLeader', label: 'Trưởng nhóm' },
    { value: 'SeniorManager', label: 'Quản lý cấp cao' },
    { value: 'Employee', label: 'Nhân viên' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      cccd: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      role: ['Employee', [Validators.required]],
      departmentId: [null, [Validators.required]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.loadUserData(this.userId);
    }
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (err) => {
        console.error('Error loading departments', err);
        this.snackBar.open('Không thể tải danh sách phòng ban', 'Đóng', { duration: 3000 });
      }
    });
  }

  loadUserData(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        // Xóa các trường không thuộc form
        const { createdAt, updatedAt, id, password, ...formData } = user;
        this.userForm.patchValue(formData);
      },
      error: (err) => {
        console.error('Error loading user', err);
        this.snackBar.open('Không thể tải thông tin người dùng', 'Đóng', { duration: 3000 });
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      if (this.isEditMode && this.userId) {
        this.userService.updateUser(this.userId, this.userForm.value).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Cập nhật người dùng thành công', 'Đóng', { duration: 3000 });
            this.router.navigate(['/users']);
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error updating user', err);
            this.snackBar.open('Không thể cập nhật người dùng', 'Đóng', { duration: 3000 });
          }
        });
      } else {
        // Thêm password mặc định khi tạo mới
        const userData = { ...this.userForm.value, password: 'password123' };
        
        this.userService.createUser(userData).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Thêm người dùng mới thành công', 'Đóng', { duration: 3000 });
            this.router.navigate(['/users']);
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error creating user', err);
            this.snackBar.open('Không thể thêm người dùng mới', 'Đóng', { duration: 3000 });
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}