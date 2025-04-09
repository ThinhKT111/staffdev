import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private endpoint = 'courses';

  // Dữ liệu mẫu
  private mockCourses: Course[] = [
    { 
      id: 1, 
      name: 'Angular Fundamentals', 
      description: 'Khóa học cơ bản về Angular framework',
      trainingPathId: 1,
      duration: 3,
      level: 'beginner',
      totalLessons: 12,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 2, 
      name: 'Advanced TypeScript', 
      description: 'Khóa học nâng cao về TypeScript',
      trainingPathId: 1,
      duration: 2,
      level: 'advanced',
      totalLessons: 8,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 3, 
      name: 'Node.js Backend Development', 
      description: 'Phát triển backend với Node.js',
      trainingPathId: 1,
      duration: 4,
      level: 'intermediate',
      totalLessons: 15,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 4, 
      name: 'Kỹ năng quản lý nhóm', 
      description: 'Khóa học về kỹ năng quản lý nhóm làm việc hiệu quả',
      trainingPathId: 2,
      duration: 2,
      level: 'intermediate',
      totalLessons: 10,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 5, 
      name: 'Kỹ năng giao tiếp', 
      description: 'Khóa học về kỹ năng giao tiếp trong môi trường doanh nghiệp',
      trainingPathId: 2,
      duration: 1,
      level: 'beginner',
      totalLessons: 6,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(private apiBaseService: ApiBaseService) { }

  getCourses(): Observable<Course[]> {
    return of(this.mockCourses);
    // return this.apiBaseService.get<Course[]>(this.endpoint);
  }

  getCoursesByTrainingPath(trainingPathId: number): Observable<Course[]> {
    const courses = this.mockCourses.filter(c => c.trainingPathId === trainingPathId);
    return of(courses);
    // return this.apiBaseService.get<Course[]>(`${this.endpoint}?trainingPathId=${trainingPathId}`);
  }

  getCourseById(id: number): Observable<Course> {
    const course = this.mockCourses.find(c => c.id === id);
    if (course) {
      return of(course);
    }
    throw new Error('Course not found');
    // return this.apiBaseService.getById<Course>(this.endpoint, id);
  }

  createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Observable<Course> {
    const newCourse = {
      ...course,
      id: this.mockCourses.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockCourses.push(newCourse);
    return of(newCourse);
    // return this.apiBaseService.post<Course>(this.endpoint, course);
  }

  updateCourse(id: number, course: Partial<Course>): Observable<Course> {
    const index = this.mockCourses.findIndex(c => c.id === id);
    if (index !== -1) {
      const updatedCourse = {
        ...this.mockCourses[index],
        ...course,
        updatedAt: new Date()
      };
      this.mockCourses[index] = updatedCourse;
      return of(updatedCourse);
    }
    throw new Error('Course not found');
    // return this.apiBaseService.put<Course>(this.endpoint, id, course);
  }

  deleteCourse(id: number): Observable<void> {
    const index = this.mockCourses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCourses.splice(index, 1);
      return of(undefined);
    }
    throw new Error('Course not found');
    // return this.apiBaseService.delete<void>(this.endpoint, id);
  }
}