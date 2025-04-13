// src/app/user-management/user-management.routes.ts
import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserFormComponent } from './user-form/user-form.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { AttendanceComponent } from './attendance/attendance.component';

export const USER_MANAGEMENT_ROUTES: Routes = [
  { path: 'list', component: UserListComponent },
  { path: 'detail/:id', component: UserDetailComponent },
  { path: 'create', component: UserFormComponent },
  { path: 'edit/:id', component: UserFormComponent },
  { path: 'profile/:id', component: EmployeeProfileComponent },
  { path: 'profile', component: EmployeeProfileComponent },
  { path: 'departments', component: DepartmentListComponent },
  { path: 'attendance', component: AttendanceComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];