// src/app/core/services/department.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private endpoint = 'departments';

  constructor(private apiBaseService: ApiBaseService) { }

  getDepartments(): Observable<Department[]> {
    return this.apiBaseService.get<any[]>(this.endpoint)
      .pipe(
        map((departments: any[]) => departments.map(dept => this.mapDepartmentFromApi(dept)))
      );
  }
  
  getDepartmentById(id: number): Observable<Department> {
    return this.apiBaseService.getById<any>(this.endpoint, id)
      .pipe(
        map(department => this.mapDepartmentFromApi(department))
      );
  }
  
  createDepartment(department: Omit<Department, 'id'>): Observable<Department> {
    const apiDepartment = {
      department_name: department.name,
      manager_id: department.managerId,
      description: department.description
    };
    
    return this.apiBaseService.post<any>(this.endpoint, apiDepartment)
      .pipe(
        map(response => this.mapDepartmentFromApi(response))
      );
  }
  
  updateDepartment(id: number, department: Partial<Department>): Observable<Department> {
    const apiDepartment: any = {};
    if (department.name) apiDepartment.department_name = department.name;
    if (department.managerId !== undefined) apiDepartment.manager_id = department.managerId;
    if (department.description) apiDepartment.description = department.description;
    
    return this.apiBaseService.put<any>(this.endpoint, id, apiDepartment)
      .pipe(
        map(response => this.mapDepartmentFromApi(response))
      );
  }
  
  deleteDepartment(id: number): Observable<void> {
    return this.apiBaseService.delete<void>(this.endpoint, id);
  }
  
  private mapDepartmentFromApi(apiDepartment: any): Department {
    return {
      id: apiDepartment.department_id,
      name: apiDepartment.department_name,
      managerId: apiDepartment.manager_id,
      description: apiDepartment.description || ''
    };
  }
}