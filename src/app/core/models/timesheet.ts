export interface Timesheet {
    id: number;
    userId: number;
    date: Date;
    clockIn: Date;
    clockOut: Date;
    breakDuration: number;
    totalHours: number;
    overtime: number;
    status: 'pending' | 'approved' | 'rejected';
    note?: string;
  }