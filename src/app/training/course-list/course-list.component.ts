import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CourseService } from '../../core/services/course.service';
import { TrainingPathService } from '../../core/services/training-path.service';
import { Course } from '../../core/models/course';
import { TrainingPath } from '../../core/models/training-path';

@Component({
  selector: 'app-course-list',
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
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'path', 'level', 'duration', 'totalLessons', 'status', 'actions'];
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  trainingPaths: TrainingPath[] = [];
  searchControl = new FormControl('');
  selectedPathId: number | null = null;

  constructor(
    private courseService: CourseService,
    private trainingPathService: TrainingPathService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTrainingPaths();
    
    // Kiểm tra xem có pathId trong query params không
    this.route.queryParams.subscribe(params => {
      if (params['pathId']) {
        this.selectedPathId = +params['pathId'];
        this.loadCoursesByPath(this.selectedPathId);
      } else {
        this.loadAllCourses();
      }
    });
  }

  loadTrainingPaths(): void {
    this.trainingPathService.getTrainingPaths().subscribe({
      next: (paths) => {
        this.trainingPaths = paths;
      },
      error: (err) => {
        console.error('Error loading training paths', err);
      }
    });
  }

  loadAllCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.filteredCourses = courses;
      },
      error: (err) => {
        console.error('Error loading courses', err);
        this.snackBar.open('Không thể tải danh sách khóa học', 'Đóng', { duration: 3000 });
      }
    });
  }

  loadCoursesByPath(pathId: number): void {
    this.courseService.getCoursesByTrainingPath(pathId).subscribe({
      next: (courses) => {
        this.courses = courses;
        this.filteredCourses = courses;
      },
      error: (err) => {
        console.error('Error loading courses by path', err);
        this.snackBar.open('Không thể tải danh sách khóa học theo lộ trình', 'Đóng', { duration: 3000 });
      }
    });
  }

  getPathName(pathId: number): string {
    const path = this.trainingPaths.find(p => p.id === pathId);
    return path ? path.name : 'Không xác định';
  }

  getLevelLabel(level: string): string {
    switch (level) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung cấp';
      case 'advanced': return 'Nâng cao';
      default: return 'Không xác định';
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCourses = this.courses.filter(course => 
      course.name.toLowerCase().includes(filterValue) || 
      course.description.toLowerCase().includes(filterValue)
    );
  }

  deleteCourse(id: number): void {
    if (confirm('Bạn có chắc muốn xóa khóa học này?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.snackBar.open('Xóa khóa học thành công', 'Đóng', { duration: 3000 });
          if (this.selectedPathId) {
            this.loadCoursesByPath(this.selectedPathId);
          } else {
            this.loadAllCourses();
          }
        },
        error: (err) => {
          console.error('Error deleting course', err);
          this.snackBar.open('Không thể xóa khóa học', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  toggleStatus(course: Course): void {
    const updatedCourse = { ...course, isActive: !course.isActive };
    this.courseService.updateCourse(course.id, { isActive: !course.isActive }).subscribe({
      next: () => {
        this.snackBar.open(
          `Khóa học đã được ${updatedCourse.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`, 
          'Đóng', 
          { duration: 3000 }
        );
        
        if (this.selectedPathId) {
          this.loadCoursesByPath(this.selectedPathId);
        } else {
          this.loadAllCourses();
        }
      },
      error: (err) => {
        console.error('Error updating course status', err);
        this.snackBar.open('Không thể cập nhật trạng thái khóa học', 'Đóng', { duration: 3000 });
      }
    });
  }
}