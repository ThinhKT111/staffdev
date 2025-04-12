// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  getUsers(params?: any): Observable<User[]> {
    // Mock API - will be replaced with real API call later
    return of(this.mockUsers);
    // return this.apiBaseService.get<User[]>(this.endpoint, params);
  }

  getUserById(id: number): Observable<User> {
    // Mock API
    const user = this.mockUsers.find(u => u.id === id);
    if (user) {
      return of(user);
    }
    throw new Error('User not found');
    // return this.apiBaseService.getById<User>(this.endpoint, id);
  }

  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    // Mock API
    const newUser = {
      ...user,
      id: this.mockUsers.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockUsers.push(newUser);
    return of(newUser);
    // return this.apiBaseService.post<User>(this.endpoint, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    // Mock API
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      const updatedUser = {
        ...this.mockUsers[index],
        ...user,
        updatedAt: new Date()
      };
      this.mockUsers[index] = updatedUser;
      return of(updatedUser);
    }
    throw new Error('User not found');
    // return this.apiBaseService.put<User>(this.endpoint, id, user);
  }

  deleteUser(id: number): Observable<void> {
    // Mock API
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
      return of(undefined);
    }
    throw new Error('User not found');
    // return this.apiBaseService.delete<void>(this.endpoint, id);
  }
}