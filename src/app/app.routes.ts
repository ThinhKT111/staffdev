// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./user-management/user-management.routes').then(m => m.USER_MANAGEMENT_ROUTES),
    canActivate: [AuthGuard],
    data: { requiredRole: 'Admin' }
  },
  {
    path: 'tasks',
    loadChildren: () => import('./task-management/task-management.routes').then(m => m.TASK_MANAGEMENT_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'training',
    loadChildren: () => import('./training/training.routes').then(m => m.TRAINING_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'communication',
    loadChildren: () => import('./communication/communication.routes').then(m => m.COMMUNICATION_ROUTES),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];