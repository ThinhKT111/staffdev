// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    
    if (!isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    
    // Kiểm tra quyền truy cập nếu có
    const requiredRole = route.data['requiredRole'] as string;
    if (requiredRole && !this.authService.hasRole(requiredRole)) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    return true;
  }
}