// src/app/core/models/user.ts
export interface User {
  id: number; // Tương ứng với user_id
  cccd: string;
  password?: string; // Optional vì không phải lúc nào cũng trả về trong API
  email: string;
  phone: string;
  fullName: string; // Tương ứng với full_name
  role: 'Admin' | 'Employee' | 'TeamLeader' | 'SeniorManager';
  departmentId: number; // Tương ứng với department_id
  createdAt: Date; // Tương ứng với created_at
  updatedAt: Date; // Tương ứng với updated_at
}