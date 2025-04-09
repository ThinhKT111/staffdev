export interface User {
    id: number;
    username: string;
    password?: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
    departmentId: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }