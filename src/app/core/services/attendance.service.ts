// src/app/core/services/attendance.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { Attendance } from '../models/attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private endpoint = 'attendance';

  // Dữ liệu mẫu
  private mockAttendance: Attendance[] = [
    {
      id: 1,
      userId: 1,
      checkIn: new Date('2025-04-12T08:30:00'),
      checkOut: new Date('2025-04-12T17:45:00'),
      overtimeHours: 1.5,
      date: new Date('2025-04-12')
    },
    {
      id: 2,
      userId: 1,
      checkIn: new Date('2025-04-11T08:15:00'),
      checkOut: new Date('2025-04-11T17:30:00'),
      overtimeHours: 0,
      date: new Date('2025-04-11')
    },
    {
      id: 3,
      userId: 1,
      checkIn: new Date('2025-04-10T08:40:00'),
      checkOut: new Date('2025-04-10T18:00:00'),
      overtimeHours: 1,
      date: new Date('2025-04-10')
    },
    {
      id: 4,
      userId: 2,
      checkIn: new Date('2025-04-12T08:20:00'),
      checkOut: new Date('2025-04-12T17:00:00'),
      overtimeHours: 0,
      date: new Date('2025-04-12')
    },
    {
      id: 5,
      userId: 1,
      leaveType: 'Annual',
      leaveDate: new Date('2025-04-05'),
      date: new Date('2025-04-05')
    }
  ];

  constructor(private apiBaseService: ApiBaseService) { }

  getAttendanceByUser(userId: number): Observable<Attendance[]> {
    const records = this.mockAttendance.filter(a => a.userId === userId);
    return of(records);
    // return this.apiBaseService.get<Attendance[]>(`${this.endpoint}/user/${userId}`);
  }

  getAttendanceByDate(date: Date): Observable<Attendance[]> {
    const dateString = date.toISOString().split('T')[0];
    const records = this.mockAttendance.filter(a => {
      const recordDate = new Date(a.date || a.checkIn || a.leaveDate || '').toISOString().split('T')[0];
      return recordDate === dateString;
    });
    return of(records);
    // return this.apiBaseService.get<Attendance[]>(`${this.endpoint}/date/${dateString}`);
  }

  checkIn(userId: number): Observable<Attendance> {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Kiểm tra xem đã check-in chưa
    const existingRecord = this.mockAttendance.find(a => {
      const recordDate = new Date(a.date || a.checkIn || '').toISOString().split('T')[0];
      return a.userId === userId && recordDate === todayString && a.checkIn;
    });
    
    if (existingRecord) {
      return of(existingRecord);
    }
    
    const newRecord: Attendance = {
      id: this.mockAttendance.length + 1,
      userId: userId,
      checkIn: today,
      date: today
    };
    
    this.mockAttendance.push(newRecord);
    return of(newRecord);
    // return this.apiBaseService.post<Attendance>(`${this.endpoint}/check-in`, { userId });
  }

  checkOut(userId: number): Observable<Attendance> {
    const now = new Date();
    const todayString = now.toISOString().split('T')[0];
    
    // Tìm record check-in của hôm nay
    const index = this.mockAttendance.findIndex(a => {
      const recordDate = new Date(a.date || a.checkIn || '').toISOString().split('T')[0];
      return a.userId === userId && recordDate === todayString && a.checkIn && !a.checkOut;
    });
    
    if (index !== -1) {
      // Tính overtime nếu checkout sau 17:30
      let overtimeHours = 0;
      const workHours = (now.getHours() - 8.5) + (now.getMinutes() / 60); // Giả sử giờ làm việc từ 8:30
      
      if (now.getHours() >= 17 && now.getMinutes() >= 30) {
        overtimeHours = (now.getHours() - 17) + (now.getMinutes() - 30) / 60;
        if (overtimeHours < 0) overtimeHours = 0;
      }
      
      const updatedRecord = {
        ...this.mockAttendance[index],
        checkOut: now,
        overtimeHours: overtimeHours
      };
      
      this.mockAttendance[index] = updatedRecord;
      return of(updatedRecord);
    }
    
    throw new Error('No check-in record found for today');
    // return this.apiBaseService.post<Attendance>(`${this.endpoint}/check-out`, { userId });
  }

  requestLeave(userId: number, leaveType: 'Annual' | 'Sick' | 'Unpaid', date: Date): Observable<Attendance> {
    const dateString = date.toISOString().split('T')[0];
    
    // Kiểm tra xem đã có yêu cầu nghỉ phép cho ngày này chưa
    const existingRecord = this.mockAttendance.find(a => {
      const recordDate = new Date(a.leaveDate || '').toISOString().split('T')[0];
      return a.userId === userId && recordDate === dateString;
    });
    
    if (existingRecord) {
      return of(existingRecord);
    }
    
    const newRecord: Attendance = {
      id: this.mockAttendance.length + 1,
      userId: userId,
      leaveType: leaveType,
      leaveDate: date,
      date: date,
      status: 'pending'
    };
    
    this.mockAttendance.push(newRecord);
    return of(newRecord);
    // return this.apiBaseService.post<Attendance>(`${this.endpoint}/leave`, { userId, leaveType, date });
  }

  approveLeave(id: number): Observable<Attendance> {
    const index = this.mockAttendance.findIndex(a => a.id === id && a.leaveType);
    
    if (index !== -1) {
      const updatedRecord = {
        ...this.mockAttendance[index],
        status: 'approved'
      };
      
      this.mockAttendance[index] = updatedRecord;
      return of(updatedRecord);
    }
    
    throw new Error('Leave record not found');
    // return this.apiBaseService.put<Attendance>(`${this.endpoint}/leave/${id}/approve`, {});
  }

  rejectLeave(id: number): Observable<Attendance> {
    const index = this.mockAttendance.findIndex(a => a.id === id && a.leaveType);
    
    if (index !== -1) {
      const updatedRecord = {
        ...this.mockAttendance[index],
        status: 'rejected'
      };
      
      this.mockAttendance[index] = updatedRecord;
      return of(updatedRecord);
    }
    
    throw new Error('Leave record not found');
    // return this.apiBaseService.put<Attendance>(`${this.endpoint}/leave/${id}/reject`, {});
  }

  getAttendanceStats(userId: number, month: number, year: number): Observable<any> {
    const records = this.mockAttendance.filter(a => {
      const recordDate = new Date(a.date || a.checkIn || a.leaveDate || '');
      return a.userId === userId && 
             recordDate.getMonth() + 1 === month && 
             recordDate.getFullYear() === year;
    });
    
    const workDays = records.filter(a => a.checkIn && a.checkOut).length;
    const leaveDays = records.filter(a => a.leaveType).length;
    const approvedLeaves = records.filter(a => a.leaveType && a.status === 'approved').length;
    
    let totalWorkHours = 0;
    let totalOvertimeHours = 0;
    
    records.forEach(record => {
      if (record.checkIn && record.checkOut) {
        const checkIn = new Date(record.checkIn);
        const checkOut = new Date(record.checkOut);
        const workHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        totalWorkHours += workHours;
        
        if (record.overtimeHours) {
          totalOvertimeHours += record.overtimeHours;
        }
      }
    });
    
    return of({
      workDays,
      leaveDays,
      approvedLeaves,
      totalWorkHours,
      totalOvertimeHours
    });
    
    // return this.apiBaseService.get<any>(`${this.endpoint}/stats/${userId}?month=${month}&year=${year}`);
  }
}