export interface TrainingPath {
    id: number;
    name: string;
    description: string;
    departmentId?: number;
    totalCourses: number;
    durationInWeeks: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }