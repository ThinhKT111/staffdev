// src/app/core/services/attendance.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { Attendance } from '../models/attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private endpoint = 'attendance';

  constructor(private apiBaseService: ApiBaseService) { }

  getAttendanceByUser(userId: number): Observable<Attendance[]> {
    return this.apiBaseService.get<any[]>(`${this.endpoint}?userId=${userId}`)
      .pipe(
        map((records: any[]) => records.map(record => this.mapAttendanceFromApi(record)))
      );
  }
  
  getAttendanceByDate(date: Date): Observable<Attendance[]> {
    const dateString = date.toISOString().split('T')[0];
    return this.apiBaseService.get<any[]>(`${this.endpoint}/date?date=${dateString}`)
      .pipe(
        map((records: any[]) => records.map(record => this.mapAttendanceFromApi(record)))
      );
  }
  
  checkIn(userId: number): Observable<Attendance> {
    return this.apiBaseService.post<any>(`${this.endpoint}/check-in`, { userId })
      .pipe(
        map(record => this.mapAttendanceFromApi(record))
      );
  }
  
  checkOut(userId: number): Observable<Attendance> {
    return this.apiBaseService.post<any>(`${this.endpoint}/check-out`, { userId })
      .pipe(
        map(record => this.mapAttendanceFromApi(record))
      );
  }
  
  requestLeave(userId: number, leaveType: 'Annual' | 'Sick' | 'Unpaid', date: Date, reason?: string): Observable<Attendance> {
    const dateString = date.toISOString().split('T')[0];
    return this.apiBaseService.post<any>(`${this.endpoint}/leave`, {
      userId,
      leaveType,
      date: dateString,
      reason
    })
      .pipe(
        map(record => this.mapAttendanceFromApi(record))
      );
  }
  
  approveLeave(id: number): Observable<Attendance> {
    return this.apiBaseService.post<any>(`${this.endpoint}/leave/${id}/approve`, {})
      .pipe(
        map(record => this.mapAttendanceFromApi(record))
      );
  }
  
  rejectLeave(id: number): Observable<Attendance> {
    return this.apiBaseService.post<any>(`${this.endpoint}/leave/${id}/reject`, {})
      .pipe(
        map(record => this.mapAttendanceFromApi(record))
      );
  }
  
  getAttendanceStats(userId: number, month: number, year: number): Observable<any> {
    return this.apiBaseService.get<any>(`${this.endpoint}/stats?userId=${userId}&month=${month}&year=${year}`);
  }
  
  private mapAttendanceFromApi(apiAttendance: any): Attendance {
    return {
      id: apiAttendance.attendance_id,
      userId: apiAttendance.user_id,
      checkIn: apiAttendance.check_in ? new Date(apiAttendance.check_in) : undefined,
      checkOut: apiAttendance.check_out ? new Date(apiAttendance.check_out) : undefined,
      overtimeHours: apiAttendance.overtime_hours,
      leaveType: apiAttendance.leave_type,
      leaveDate: apiAttendance.leave_date ? new Date(apiAttendance.leave_date) : undefined,
      status: apiAttendance.status,
      note: apiAttendance.note
    };
  }
}