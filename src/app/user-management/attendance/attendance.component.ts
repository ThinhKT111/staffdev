// src/app/user-management/attendance/attendance.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs'; // Added MatTabsModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AttendanceService } from '../../core/services/attendance.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Attendance } from '../../core/models/attendance';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule, // Added MatTabsModule
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  currentUser: User | null = null;
  isAdmin = false;
  currentDate = new Date();
  attendanceRecords: Attendance[] = [];
  leaveForm: FormGroup;
  displayedColumns: string[] = ['date', 'checkIn', 'checkOut', 'workHours', 'overtime', 'leaveType', 'status'];
  
  todayAttendance: Attendance | null = null;
  hasCheckedInToday = false;
  hasCheckedOutToday = false;
  
  // For admin page
  users: User[] = [];
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  selectedUserId: number | null = null;
  
  // Stats
  stats: any = {
    workDays: 0,
    leaveDays: 0,
    approvedLeaves: 0,
    totalWorkHours: 0,
    totalOvertimeHours: 0
  };

  // Add filtered records for leave records
  filteredLeaveRecords: Attendance[] = [];

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.leaveForm = this.createLeaveForm();
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Admin');
    this.currentUser = this.authService.currentUser;
    
    if (this.currentUser) {
      this.loadAttendanceData(this.currentUser.id);
      this.loadAttendanceStats(this.currentUser.id, this.selectedMonth, this.selectedYear);
      this.checkTodayAttendance();
    }
    
    if (this.isAdmin) {
      this.loadUsers();
    }
  }

  createLeaveForm(): FormGroup {
    return this.fb.group({
      leaveType: ['Annual', [Validators.required]],
      date: [new Date(), [Validators.required]],
      reason: ['', [Validators.required]]
    });
  }

  loadAttendanceData(userId: number): void {
    this.attendanceService.getAttendanceByUser(userId).subscribe({
      next: (records) => {
        this.attendanceRecords = records.sort((a, b) => {
          const dateA = new Date(a.date || a.checkIn || a.leaveDate || '');
          const dateB = new Date(b.date || b.checkIn || b.leaveDate || '');
          return dateB.getTime() - dateA.getTime(); // Sort descending by date
        });
        // Update filtered leave records
        this.updateFilteredLeaveRecords();
      },
      error: (err) => {
        console.error('Error loading attendance data', err);
        this.snackBar.open('Không thể tải dữ liệu điểm danh', 'Đóng', { duration: 3000 });
      }
    });
  }

  // Add a method to filter leave records
  updateFilteredLeaveRecords(): void {
    this.filteredLeaveRecords = this.attendanceRecords.filter(record => record.leaveType);
  }

  loadAttendanceStats(userId: number, month: number, year: number): void {
    this.attendanceService.getAttendanceStats(userId, month, year).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Error loading attendance stats', err);
      }
    });
  }

  checkTodayAttendance(): void {
    if (!this.currentUser) return;
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    this.attendanceService.getAttendanceByDate(today).subscribe({
      next: (records) => {
        const myRecord = records.find(r => r.userId === this.currentUser?.id);
        if (myRecord) {
          this.todayAttendance = myRecord;
          this.hasCheckedInToday = !!myRecord.checkIn;
          this.hasCheckedOutToday = !!myRecord.checkOut;
        }
      },
      error: (err) => {
        console.error('Error checking today attendance', err);
      }
    });
  }

  checkIn(): void {
    if (!this.currentUser) return;
    
    this.attendanceService.checkIn(this.currentUser.id).subscribe({
      next: (record) => {
        this.todayAttendance = record;
        this.hasCheckedInToday = true;
        this.snackBar.open('Điểm danh vào ca thành công', 'Đóng', { duration: 3000 });
        this.loadAttendanceData(this.currentUser!.id);
      },
      error: (err) => {
        console.error('Error checking in', err);
        this.snackBar.open('Không thể điểm danh vào ca', 'Đóng', { duration: 3000 });
      }
    });
  }

  checkOut(): void {
    if (!this.currentUser || !this.todayAttendance) return;
    
    this.attendanceService.checkOut(this.currentUser.id).subscribe({
      next: (record) => {
        this.todayAttendance = record;
        this.hasCheckedOutToday = true;
        this.snackBar.open('Điểm danh ra ca thành công', 'Đóng', { duration: 3000 });
        this.loadAttendanceData(this.currentUser!.id);
      },
      error: (err) => {
        console.error('Error checking out', err);
        this.snackBar.open('Không thể điểm danh ra ca', 'Đóng', { duration: 3000 });
      }
    });
  }

  requestLeave(): void {
    if (!this.currentUser || !this.leaveForm.valid) return;
    
    const { leaveType, date } = this.leaveForm.value;
    
    this.attendanceService.requestLeave(this.currentUser.id, leaveType, date).subscribe({
      next: (record) => {
        this.snackBar.open('Đã gửi yêu cầu nghỉ phép', 'Đóng', { duration: 3000 });
        this.leaveForm.reset({ leaveType: 'Annual', date: new Date() });
        this.loadAttendanceData(this.currentUser!.id);
      },
      error: (err) => {
        console.error('Error requesting leave', err);
        this.snackBar.open('Không thể gửi yêu cầu nghỉ phép', 'Đóng', { duration: 3000 });
      }
    });
  }

  // Admin functions
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  selectUser(userId: number): void {
    this.selectedUserId = userId;
    this.loadAttendanceData(userId);
    this.loadAttendanceStats(userId, this.selectedMonth, this.selectedYear);
  }

  approveLeave(id: number): void {
    this.attendanceService.approveLeave(id).subscribe({
      next: () => {
        this.snackBar.open('Đã duyệt yêu cầu nghỉ phép', 'Đóng', { duration: 3000 });
        if (this.selectedUserId) {
          this.loadAttendanceData(this.selectedUserId);
        }
      },
      error: (err) => {
        console.error('Error approving leave', err);
        this.snackBar.open('Không thể duyệt yêu cầu nghỉ phép', 'Đóng', { duration: 3000 });
      }
    });
  }

  rejectLeave(id: number): void {
    this.attendanceService.rejectLeave(id).subscribe({
      next: () => {
        this.snackBar.open('Đã từ chối yêu cầu nghỉ phép', 'Đóng', { duration: 3000 });
        if (this.selectedUserId) {
          this.loadAttendanceData(this.selectedUserId);
        }
      },
      error: (err) => {
        console.error('Error rejecting leave', err);
        this.snackBar.open('Không thể từ chối yêu cầu nghỉ phép', 'Đóng', { duration: 3000 });
      }
    });
  }

  updateMonthYear(): void {
    if (this.selectedUserId) {
      this.loadAttendanceStats(this.selectedUserId, this.selectedMonth, this.selectedYear);
    } else if (this.currentUser) {
      this.loadAttendanceStats(this.currentUser.id, this.selectedMonth, this.selectedYear);
    }
  }

  // Helper functions
  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  formatTime(date: Date | string | null | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  calculateWorkHours(checkIn: Date | string | null | undefined, checkOut: Date | string | null | undefined): string {
    if (!checkIn || !checkOut) return '-';
    
    const inTime = new Date(checkIn);
    const outTime = new Date(checkOut);
    const diffMs = outTime.getTime() - inTime.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    return diffHrs.toFixed(2);
  }

  getLeaveTypeLabel(type: string | null | undefined): string {
    if (!type) return '-';
    
    switch (type) {
      case 'Annual': return 'Nghỉ phép năm';
      case 'Sick': return 'Nghỉ ốm';
      case 'Unpaid': return 'Nghỉ không lương';
      default: return type;
    }
  }

  getStatusLabel(status: string | null | undefined): string {
    if (!status) return '-';
    
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  }

  getStatusClass(status: string | null | undefined): string {
    if (!status) return '';
    
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }
}