import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'users',
    loadChildren: () => import('./user-management/user-management.routes').then(m => m.USER_MANAGEMENT_ROUTES)
  },
  {
    path: 'training',
    loadChildren: () => import('./training/training.routes').then(m => m.TRAINING_ROUTES)
  },
  {
    path: 'communication',
    loadChildren: () => import('./communication/communication.routes').then(m => m.COMMUNICATION_ROUTES)
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];