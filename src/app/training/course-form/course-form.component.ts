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

import { CourseService } from '../../core/services/course.service';
import { TrainingPathService } from '../../core/services/training-path.service';
import { TrainingPath } from '../../core/models/training-path';

@Component({
  selector: 'app-course-form',
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
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = false;
  courseId: number | null = null;
  trainingPaths: TrainingPath[] = [];
  
  levels = [
    { value: 'beginner', label: 'Cơ bản' },
    { value: 'intermediate', label: 'Trung cấp' },
    { value: 'advanced', label: 'Nâng cao' }
  ];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private trainingPathService: TrainingPathService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      trainingPathId: [null, [Validators.required]],
      level: ['beginner', [Validators.required]],
      duration: [1, [Validators.required, Validators.min(1)]],
      totalLessons: [1, [Validators.required, Validators.min(1)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadTrainingPaths();
    
    // Kiểm tra pathId trong query params
    this.route.queryParams.subscribe(params => {
      if (params['pathId']) {
        this.courseForm.patchValue({
          trainingPathId: +params['pathId']
        });
      }
    });
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.courseId = +id;
      this.loadCourseData(this.courseId);
    }
  }

  loadTrainingPaths(): void {
    this.trainingPathService.getTrainingPaths().subscribe({
      next: (paths) => {
        this.trainingPaths = paths.filter(p => p.isActive);
      },
      error: (err) => {
        console.error('Error loading training paths', err);
        this.snackBar.open('Không thể tải danh sách lộ trình đào tạo', 'Đóng', { duration: 3000 });
      }
    });
  }

  loadCourseData(id: number): void {
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.courseForm.patchValue({
          name: course.name,
          description: course.description,
          trainingPathId: course.trainingPathId,
          level: course.level,
          duration: course.duration,
          totalLessons: course.totalLessons,
          isActive: course.isActive
        });
      },
      error: (err) => {
        console.error('Error loading course', err);
        this.snackBar.open('Không thể tải thông tin khóa học', 'Đóng', { duration: 3000 });
        this.router.navigate(['/training/courses']);
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      if (this.isEditMode && this.courseId) {
        this.courseService.updateCourse(this.courseId, this.courseForm.value).subscribe({
          next: () => {
            this.snackBar.open('Cập nhật khóa học thành công', 'Đóng', { duration: 3000 });
            this.navigateBack();
          },
          error: (err) => {
            console.error('Error updating course', err);
            this.snackBar.open('Không thể cập nhật khóa học', 'Đóng', { duration: 3000 });
          }
        });
      } else {
        this.courseService.createCourse(this.courseForm.value).subscribe({
          next: () => {
            this.snackBar.open('Thêm khóa học thành công', 'Đóng', { duration: 3000 });
            this.navigateBack();
          },
          error: (err) => {
            console.error('Error creating course', err);
            this.snackBar.open('Không thể thêm khóa học', 'Đóng', { duration: 3000 });
          }
        });
      }
    }
  }

  navigateBack(): void {
    const pathId = this.courseForm.get('trainingPathId')?.value;
    if (pathId) {
      this.router.navigate(['/training/courses'], { queryParams: { pathId: pathId } });
    } else {
      this.router.navigate(['/training/courses']);
    }
  }

  cancel(): void {
    this.navigateBack();
  }
}