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
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TrainingPathService } from '../../core/services/training-path.service';
import { DepartmentService } from '../../core/services/department.service';
import { TrainingPath } from '../../core/models/training-path';
import { Department } from '../../core/models/department';

@Component({
  selector: 'app-training-path-list',
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
  templateUrl: './training-path-list.component.html',
  styleUrls: ['./training-path-list.component.scss']
})
export class TrainingPathListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'department', 'totalCourses', 'durationInWeeks', 'status', 'actions'];
  trainingPaths: TrainingPath[] = [];
  filteredPaths: TrainingPath[] = [];
  departments: Department[] = [];
  searchControl = new FormControl('');

  constructor(
    private trainingPathService: TrainingPathService,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTrainingPaths();
    this.loadDepartments();
  }

  loadTrainingPaths(): void {
    this.trainingPathService.getTrainingPaths().subscribe({
      next: (paths) => {
        this.trainingPaths = paths;
        this.filteredPaths = paths;
      },
      error: (err) => {
        console.error('Error loading training paths', err);
        this.snackBar.open('Không thể tải danh sách lộ trình đào tạo', 'Đóng', { duration: 3000 });
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (err) => {
        console.error('Error loading departments', err);
      }
    });
  }

  getDepartmentName(departmentId?: number): string {
    if (!departmentId) return 'Tất cả phòng ban';
    const department = this.departments.find(d => d.id === departmentId);
    return department ? department.name : 'Không xác định';
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPaths = this.trainingPaths.filter(path => 
      (path.name ?? path.title ?? '').toLowerCase().includes(filterValue) || 
      (path.description ?? '').toLowerCase().includes(filterValue)
    );
  }

  deletePath(id: number): void {
    if (confirm('Bạn có chắc muốn xóa lộ trình đào tạo này?')) {
      this.trainingPathService.deleteTrainingPath(id).subscribe({
        next: () => {
          this.snackBar.open('Xóa lộ trình đào tạo thành công', 'Đóng', { duration: 3000 });
          this.loadTrainingPaths();
        },
        error: (err) => {
          console.error('Error deleting training path', err);
          this.snackBar.open('Không thể xóa lộ trình đào tạo', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  toggleStatus(path: TrainingPath): void {
    const updatedPath = { ...path, isActive: !path.isActive };
    this.trainingPathService.updateTrainingPath(path.id, { isActive: !path.isActive }).subscribe({
      next: () => {
        this.snackBar.open(
          `Lộ trình đã được ${updatedPath.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`, 
          'Đóng', 
          { duration: 3000 }
        );
        this.loadTrainingPaths();
      },
      error: (err) => {
        console.error('Error updating training path status', err);
        this.snackBar.open('Không thể cập nhật trạng thái lộ trình', 'Đóng', { duration: 3000 });
      }
    });
  }
}