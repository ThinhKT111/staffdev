// src/app/core/models/department.ts
export interface Department {
  id: number;
  name: string;
  description: string;
  managerId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}