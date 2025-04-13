// src/app/core/models/attendance.ts
export interface Attendance {
  id: number; // Tương ứng với attendance_id
  userId: number; // Tương ứng với user_id
  checkIn?: Date; // Tương ứng với check_in
  checkOut?: Date; // Tương ứng với check_out
  overtimeHours?: number; // Tương ứng với overtime_hours
  leaveType?: 'Annual' | 'Sick' | 'Unpaid'; // Tương ứng với leave_type
  leaveDate?: Date; // Tương ứng với leave_date
  
  // Các trường sau không có trong DB nhưng có thể đã được sử dụng
  date?: Date;
  breakDuration?: number;
  totalHours?: number;
  status?: 'pending' | 'approved' | 'rejected';
  note?: string;
}