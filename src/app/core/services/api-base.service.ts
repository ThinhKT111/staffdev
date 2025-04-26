// src/app/core/services/api-base.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params: httpParams })
      .pipe(catchError(error => this.handleError(error)));
  }
  
  getById<T>(endpoint: string, id: any): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}/${id}`)
      .pipe(catchError(error => this.handleError(error)));
  }
  
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data)
      .pipe(catchError(error => this.handleError(error)));
  }
  
  put<T>(endpoint: string, id: any, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}`, data)
      .pipe(catchError(error => this.handleError(error)));
  }
  
  patch<T>(endpoint: string, id: any, data: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}/${id}`, data)
      .pipe(catchError(error => this.handleError(error)));
  }
  
  delete<T>(endpoint: string, id: any): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}/${id}`)
      .pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Xử lý lỗi xác thực
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      this.router.navigate(['/auth/login']);
      return throwError(() => new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'));
    }
    
    let errorMessage = 'Đã xảy ra lỗi';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}