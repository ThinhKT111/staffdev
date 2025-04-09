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
    MatCardModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'department', 'role', 'status', 'actions'];
  dataSource: any[] = [];
  searchControl = new FormControl('');
  totalUsers = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor() { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    // Giả lập dữ liệu - sau này sẽ thay bằng API call thực
    this.dataSource = [
      { id: 1, firstName: 'Nguyễn', lastName: 'Văn A', email: 'nguyenvana@example.com', department: 'IT', role: 'Developer', isActive: true },
      { id: 2, firstName: 'Trần', lastName: 'Thị B', email: 'tranthib@example.com', department: 'HR', role: 'Manager', isActive: true },
      { id: 3, firstName: 'Lê', lastName: 'Văn C', email: 'levanc@example.com', department: 'Finance', role: 'Accountant', isActive: false },
      { id: 4, firstName: 'Phạm', lastName: 'Thị D', email: 'phamthid@example.com', department: 'Marketing', role: 'Specialist', isActive: true },
      { id: 5, firstName: 'Hoàng', lastName: 'Văn E', email: 'hoangvane@example.com', department: 'IT', role: 'Tester', isActive: true },
      { id: 6, firstName: 'Đặng', lastName: 'Thị F', email: 'dangthif@example.com', department: 'Sales', role: 'Representative', isActive: true },
      { id: 7, firstName: 'Vũ', lastName: 'Văn G', email: 'vuvang@example.com', department: 'IT', role: 'Project Manager', isActive: false },
      { id: 8, firstName: 'Bùi', lastName: 'Thị H', email: 'buithih@example.com', department: 'HR', role: 'Recruiter', isActive: true },
      { id: 9, firstName: 'Đỗ', lastName: 'Văn I', email: 'dovani@example.com', department: 'Finance', role: 'Analyst', isActive: true },
      { id: 10, firstName: 'Ngô', lastName: 'Thị K', email: 'ngothik@example.com', department: 'Marketing', role: 'Designer', isActive: true },
    ];
    this.totalUsers = 100; // Giả định có 100 người dùng tổng cộng
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('Filtering by:', filterValue);
    // Implement filtering logic here
  }

  sortData(sort: Sort) {
    console.log('Sorting by:', sort);
    // Implement sorting logic here
  }

  handlePageEvent(event: PageEvent) {
    console.log('Page event:', event);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // Implement pagination logic here
  }

  getFullName(user: any): string {
    return `${user.firstName} ${user.lastName}`;
  }

  deleteUser(id: number) {
    console.log('Deleting user with ID:', id);
    // Implement delete logic here
  }
}