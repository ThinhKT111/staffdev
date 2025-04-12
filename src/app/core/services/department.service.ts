// src/app/core/services/department.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private endpoint = 'departments';

  // Dữ liệu mẫu
  private mockDepartments: Department[] = [
    { id: 1, name: 'IT', description: 'Phòng Công nghệ thông tin', managerId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: 'HR', description: 'Phòng Nhân sự', managerId: 2, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: 'Finance', description: 'Phòng Tài chính', managerId: 3, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, name: 'Marketing', description: 'Phòng Marketing', managerId: 4, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, name: 'Sales', description: 'Phòng Kinh doanh', managerId: 5, createdAt: new Date(), updatedAt: new Date() }
  ];

  constructor(private apiBaseService: ApiBaseService) { }

  getDepartments(): Observable<Department[]> {
    // Giả lập API - sau này sẽ thay bằng API call thực
    return of(this.mockDepartments);
    // return this.apiBaseService.get<Department[]>(this.endpoint);
  }

  getDepartmentById(id: number): Observable<Department> {
    // Giả lập API
    const department = this.mockDepartments.find(d => d.id === id);
    if (department) {
      return of(department);
    }
    throw new Error('Department not found');
    // return this.apiBaseService.getById<Department>(this.endpoint, id);
  }

  createDepartment(department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Observable<Department> {
    // Giả lập API
    const newDepartment = {
      ...department,
      id: this.mockDepartments.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockDepartments.push(newDepartment as Department);
    return of(newDepartment as Department);
    // return this.apiBaseService.post<Department>(this.endpoint, department);
  }

  updateDepartment(id: number, department: Partial<Department>): Observable<Department> {
    // Giả lập API
    const index = this.mockDepartments.findIndex(d => d.id === id);
    if (index !== -1) {
      const updatedDepartment = {
        ...this.mockDepartments[index],
        ...department,
        updatedAt: new Date()
      };
      this.mockDepartments[index] = updatedDepartment;
      return of(updatedDepartment);
    }
    throw new Error('Department not found');
    // return this.apiBaseService.put<Department>(this.endpoint, id, department);
  }

  deleteDepartment(id: number): Observable<void> {
    // Giả lập API
    const index = this.mockDepartments.findIndex(d => d.id === id);
    if (index !== -1) {
      this.mockDepartments.splice(index, 1);
      return of(undefined);
    }
    throw new Error('Department not found');
    // return this.apiBaseService.delete<void>(this.endpoint, id);
  }
}