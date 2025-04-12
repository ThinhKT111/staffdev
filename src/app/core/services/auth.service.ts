// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Mock user
  private mockUser: User = {
    id: 1,
    cccd: '034095000123',
    email: 'admin@example.com',
    phone: '0912345678',
    fullName: 'Administrator',
    role: 'Admin',
    departmentId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  constructor(
    private apiBaseService: ApiBaseService,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }
  login(cccd: string, password: string): Observable<User> {
    // Giả lập đăng nhập với mock data
    if (cccd === '034095000123' && password === 'password') {
      localStorage.setItem('currentUser', JSON.stringify(this.mockUser));
      this.currentUserSubject.next(this.mockUser);
      return of(this.mockUser);
    }
    
    return throwError(() => new Error('Thông tin đăng nhập không hợp lệ'));
    
    // Khi có API thực tế:
    // return this.apiBaseService.post<User>('auth/login', { cccd, password })
    //  .pipe(
    //    tap(user => {
    //      localStorage.setItem('currentUser', JSON.stringify(user));
    //      this.currentUserSubject.next(user);
    //    }),
    //    catchError(error => {
    //      return throwError(() => new Error('Đăng nhập thất bại: ' + error.message));
    //    })
    //  );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.role === role;
  }
}