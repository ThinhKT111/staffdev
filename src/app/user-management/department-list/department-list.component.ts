import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { DepartmentService } from '../../core/services/department.service';
import { Department } from '../../core/models/department';
import { DepartmentFormComponent } from '../department-form/department-form.component';

@Component({
  selector: 'app-department-list',
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
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'manager', 'actions'];
  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  searchControl = new FormControl('');
  isLoading = false;

  constructor(
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.filteredDepartments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading departments', err);
        this.snackBar.open('Không thể tải danh sách phòng ban', 'Đóng', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDepartments = this.departments.filter(dept => 
      dept.name.toLowerCase().includes(filterValue) || 
      dept.description.toLowerCase().includes(filterValue)
    );
  }

  openDepartmentForm(department?: Department): void {
    const dialogRef = this.dialog.open(DepartmentFormComponent, {
      width: '500px',
      data: { department }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDepartments();
      }
    });
  }

  deleteDepartment(id: number): void {
    if (confirm('Bạn có chắc muốn xóa phòng ban này?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.snackBar.open('Xóa phòng ban thành công', 'Đóng', { duration: 3000 });
          this.loadDepartments();
        },
        error: (err) => {
          console.error('Error deleting department', err);
          this.snackBar.open('Không thể xóa phòng ban', 'Đóng', { duration: 3000 });
        }
      });
    }
  }
}