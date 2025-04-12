// src/app/user-management/user-list/user-list.component.ts
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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';


@Component({
  selector: 'app-user-list',
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
    MatTooltipModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'department', 'role', 'status', 'actions'];
  dataSource: User[] = [];
  filteredDataSource: User[] = [];
  searchControl = new FormControl('');
  totalUsers = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource = users;
        this.filteredDataSource = users;
        this.totalUsers = users.length;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.snackBar.open('Không thể tải danh sách người dùng', 'Đóng', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDataSource = this.dataSource.filter(user =>
      user.fullName.toLowerCase().includes(filterValue) ||
      user.email.toLowerCase().includes(filterValue) ||
      user.role.toLowerCase().includes(filterValue)
    );
  }

  sortData(sort: Sort) {
    // Implement sorting logic
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // Implement pagination logic
  }

  getFullName(user: User): string {
    return user.fullName;
  }

  deleteUser(id: number) {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.snackBar.open('Xóa người dùng thành công', 'Đóng', { duration: 3000 });
          this.loadUserData();
        },
        error: (err) => {
          console.error('Error deleting user', err);
          this.snackBar.open('Không thể xóa người dùng', 'Đóng', { duration: 3000 });
        }
      });
    }
  }
}