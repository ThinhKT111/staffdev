import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { TrainingPathService } from '../../core/services/training-path.service';
import { DepartmentService } from '../../core/services/department.service';
import { Department } from '../../core/models/department';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user'; // Thêm import User model

@Component({
  selector: 'app-training-path-form',
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
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './training-path-form.component.html',
  styleUrls: ['./training-path-form.component.scss']
})
export class TrainingPathFormComponent implements OnInit {
  pathForm: FormGroup;
  isEditMode = false;
  pathId: number | null = null;
  departments: Department[] = [];

  isLoading = false;
  // Thay đổi kiểu dữ liệu để phù hợp với giá trị sẽ được gán
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private trainingPathService: TrainingPathService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.pathForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      departmentId: [null],
      totalCourses: [0, [Validators.required, Validators.min(0)]],
      durationInWeeks: [1, [Validators.required, Validators.min(1)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.currentUser = this.authService.currentUser;
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.pathId = +id;
      this.loadPathData(this.pathId);
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

  loadPathData(id: number): void {
    this.trainingPathService.getTrainingPathById(id).subscribe({
      next: (path) => {
        this.pathForm.patchValue({
          name: path.name,
          description: path.description,
          departmentId: path.departmentId,
          totalCourses: path.totalCourses,
          durationInWeeks: path.durationInWeeks,
          isActive: path.isActive
        });
      },
      error: (err) => {
        console.error('Error loading training path', err);
        this.snackBar.open('Không thể tải thông tin lộ trình đào tạo', 'Đóng', { duration: 3000 });
        this.router.navigate(['/training/paths']);
      }
    });
  }

  onSubmit(): void {
    if (this.pathForm.valid) {
      this.isLoading = true;
      if (this.isEditMode && this.pathId) {
        this.trainingPathService.updateTrainingPath(this.pathId, this.pathForm.value).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Cập nhật lộ trình đào tạo thành công', 'Đóng', { duration: 3000 });
            this.router.navigate(['/training/paths']);
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error updating training path', err);
            this.snackBar.open('Không thể cập nhật lộ trình đào tạo', 'Đóng', { duration: 3000 });
          }
        });
      } else {
        const pathData = {
          ...this.pathForm.value,
          createdBy: this.currentUser?.id // Đây vẫn ổn vì currentUser bây giờ có kiểu User | null
        };
        this.trainingPathService.createTrainingPath(pathData).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Thêm lộ trình đào tạo thành công', 'Đóng', { duration: 3000 });
            this.router.navigate(['/training/paths']);
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error creating training path', err);
            this.snackBar.open('Không thể thêm lộ trình đào tạo', 'Đóng', { duration: 3000 });
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/training/paths']);
  }
}