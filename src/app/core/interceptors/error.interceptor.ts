// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
) => {
  const snackBar = inject(MatSnackBar);
  
  return next(req).pipe(
    catchError(error => {
      if (error.status === 0) {
        snackBar.open('Không thể kết nối đến máy chủ', 'Đóng', { duration: 3000 });
      } else if (error.status >= 400) {
        const errorMessage = error.error?.message || error.statusText || 'Đã có lỗi xảy ra';
        snackBar.open(errorMessage, 'Đóng', { duration: 3000 });
      }
      
      return throwError(() => error);
    })
  );
};