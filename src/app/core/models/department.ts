// src/app/core/models/department.ts
export interface Department {
  id: number; // Tương ứng với department_id
  name: string; // Tương ứng với department_name
  managerId?: number; // Tương ứng với manager_id
  // description, createdAt, updatedAt không có trong DB nhưng giữ lại vì đã được sử dụng trong code
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}