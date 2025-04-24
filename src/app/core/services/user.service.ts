// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; // Thêm import này
import { ApiBaseService } from './api-base.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'users';

  // Mock data - will be removed when connecting to real API
  private mockUsers: User[] = [
    { 
      id: 1, 
      cccd: '034095000123',
      email: 'nguyenvana@example.com', 
      phone: '0912345678',
      fullName: 'Nguyễn Văn A', 
      role: 'TeamLeader', 
      departmentId: 1, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 2, 
      cccd: '034095000124',
      email: 'tranthib@example.com', 
      phone: '0912345679',
      fullName: 'Trần Thị B', 
      role: 'Employee', 
      departmentId: 2, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    }
  ];

  constructor(private apiBaseService: ApiBaseService) { }

  private mapUserFromApi(apiUser: any): User {
    return {
      id: apiUser.user_id,
      cccd: apiUser.cccd,
      email: apiUser.email,
      phone: apiUser.phone,
      fullName: apiUser.full_name,
      role: apiUser.role,
      departmentId: apiUser.department_id,
      createdAt: new Date(apiUser.created_at),
      updatedAt: new Date(apiUser.updated_at)
    };
  }
  
  getUsers(params?: any): Observable<User[]> {
    return this.apiBaseService.get<any[]>(this.endpoint, params)
      .pipe(
        map((users: any[]) => users.map((user: any) => this.mapUserFromApi(user)))
      );
  }
  
  getUserById(id: number): Observable<User> {
    return this.apiBaseService.getById<any>(this.endpoint, id)
      .pipe(
        map((user: any) => this.mapUserFromApi(user))
      );
  }
  
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    // Chuyển đổi từ camelCase sang snake_case cho API
    const apiUser = {
      cccd: user.cccd,
      email: user.email,
      phone: user.phone,
      full_name: user.fullName,
      role: user.role,
      department_id: user.departmentId,
      password: user.password || 'password123' // Mật khẩu mặc định nếu không có
    };
    
    return this.apiBaseService.post<any>(this.endpoint, apiUser)
      .pipe(
        map((response: any) => this.mapUserFromApi(response))
      );
  }
  
  updateUser(id: number, user: Partial<User>): Observable<User> {
    // Chuyển đổi từ camelCase sang snake_case cho API
    const apiUser: any = {};
    if (user.email) apiUser.email = user.email;
    if (user.phone) apiUser.phone = user.phone;
    if (user.fullName) apiUser.full_name = user.fullName;
    if (user.role) apiUser.role = user.role;
    if (user.departmentId) apiUser.department_id = user.departmentId;
    if (user.password) apiUser.password = user.password;
    
    return this.apiBaseService.put<any>(this.endpoint, id, apiUser)
      .pipe(
        map((response: any) => this.mapUserFromApi(response))
      );
  }
  
  deleteUser(id: number): Observable<void> {
    return this.apiBaseService.delete<void>(this.endpoint, id);
  }
}