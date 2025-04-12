// src/app/core/models/employee-profile.ts
export interface EmployeeProfile {
  id: number; // Tương ứng với profile_id
  userId: number; // Tương ứng với user_id
  dateOfBirth: Date; // Tương ứng với date_of_birth
  address: string;
  experience: string;
  skills: string; // Lưu ý: Trong DB là TEXT, không phải mảng
  avatarUrl: string; // Tương ứng với avatar_url
  updatedAt?: Date; // Tương ứng với updated_at
  
  // Các trường sau không có trong DB nhưng đã được sử dụng trong code
  phoneNumber?: string; // Phone nên để ở User model
  emergencyContact?: string;
  joinDate?: Date;
  position?: string;
  educationBackground?: string;
}