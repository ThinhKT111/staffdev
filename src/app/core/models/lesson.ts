export interface Lesson {
    id: number;
    courseId: number;
    title: string;
    description: string;
    content: string;
    order: number;
    duration: number; // Thời lượng (phút)
    materials?: string[]; // Danh sách tài liệu
    isPublished: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }