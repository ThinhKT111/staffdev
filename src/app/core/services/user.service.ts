// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'users';

  constructor(private apiBaseService: ApiBaseService) { }
  
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
    const apiUser = {
      cccd: user.cccd,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role,
      departmentId: user.departmentId,
      password: user.password || 'password123'
    };
    
    return this.apiBaseService.post<any>(this.endpoint, apiUser)
      .pipe(
        map((response: any) => this.mapUserFromApi(response))
      );
  }
  
  updateUser(id: number, user: Partial<User>): Observable<User> {
    const apiUser: any = {};
    if (user.email) apiUser.email = user.email;
    if (user.phone) apiUser.phone = user.phone;
    if (user.fullName) apiUser.fullName = user.fullName;
    if (user.role) apiUser.role = user.role;
    if (user.departmentId) apiUser.departmentId = user.departmentId;
    if (user.password) apiUser.password = user.password;
    
    return this.apiBaseService.patch<any>(this.endpoint, id, apiUser)
      .pipe(
        map((response: any) => this.mapUserFromApi(response))
      );
  }
  
  deleteUser(id: number): Observable<void> {
    return this.apiBaseService.delete<void>(this.endpoint, id);
  }
  
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
      updatedAt: new Date(apiUser.updated_at),
      password: apiUser.password // Include password if returned by API
    };
  }
}