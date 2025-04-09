export interface EmployeeProfile {
    id: number;
    userId: number;
    dateOfBirth: Date;
    address: string;
    phoneNumber: string;
    emergencyContact: string;
    joinDate: Date;
    position: string;
    skills: string[];
    educationBackground: string;
    experience: string;
    profileImage?: string;
  }