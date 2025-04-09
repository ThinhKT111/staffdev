export interface Course {
    id: number;
    name: string;
    description: string;
    trainingPathId: number;
    duration: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    totalLessons: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }