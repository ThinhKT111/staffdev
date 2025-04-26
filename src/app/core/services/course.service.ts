// src/app/core/services/course.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private endpoint = 'training/courses';

  constructor(private apiBaseService: ApiBaseService) { }

  getCourses(params?: any): Observable<Course[]> {
    return this.apiBaseService.get<any[]>(this.endpoint, params)
      .pipe(
        map((courses: any[]) => courses.map(course => this.mapCourseFromApi(course)))
      );
  }
  
  getCoursesByTrainingPath(trainingPathId: number): Observable<Course[]> {
    return this.apiBaseService.get<any[]>(`${this.endpoint}?pathId=${trainingPathId}`)
      .pipe(
        map((courses: any[]) => courses.map(course => this.mapCourseFromApi(course)))
      );
  }
  
  getCourseById(id: number): Observable<Course> {
    return this.apiBaseService.getById<any>(this.endpoint, id)
      .pipe(
        map(course => this.mapCourseFromApi(course))
      );
  }
  
  createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Observable<Course> {
    const apiCourse = {
      title: course.title || course.name,
      description: course.description,
      trainingPathId: course.trainingPathId,
      type: course.type || 'Online',
      durationHours: course.durationHours || (course.duration ? course.duration * 8 : 0),
      level: course.level,
      totalLessons: course.totalLessons,
      isActive: course.isActive
    };
    
    return this.apiBaseService.post<any>(this.endpoint, apiCourse)
      .pipe(
        map(response => this.mapCourseFromApi(response))
      );
  }
  
  updateCourse(id: number, course: Partial<Course>): Observable<Course> {
    const apiCourse: any = {};
    if (course.title || course.name) apiCourse.title = course.title || course.name;
    if (course.description) apiCourse.description = course.description;
    if (course.trainingPathId) apiCourse.trainingPathId = course.trainingPathId;
    if (course.type) apiCourse.type = course.type;
    if (course.durationHours || course.duration) {
      apiCourse.durationHours = course.durationHours || (course.duration ? course.duration * 8 : undefined);
    }
    if (course.level) apiCourse.level = course.level;
    if (course.totalLessons !== undefined) apiCourse.totalLessons = course.totalLessons;
    if (course.isActive !== undefined) apiCourse.isActive = course.isActive;
    
    return this.apiBaseService.patch<any>(this.endpoint, id, apiCourse)
      .pipe(
        map(response => this.mapCourseFromApi(response))
      );
  }
  
  deleteCourse(id: number): Observable<void> {
    return this.apiBaseService.delete<void>(this.endpoint, id);
  }
  
  private mapCourseFromApi(apiCourse: any): Course {
    return {
      id: apiCourse.course_id,
      title: apiCourse.title,
      name: apiCourse.title, // For backwards compatibility
      description: apiCourse.description,
      trainingPathId: apiCourse.training_path_id,
      type: apiCourse.type,
      durationHours: apiCourse.duration_hours,
      duration: Math.ceil(apiCourse.duration_hours / 8), // For backwards compatibility
      level: apiCourse.level || 'beginner', // May not exist in backend
      totalLessons: apiCourse.total_lessons,
      isActive: apiCourse.is_active,
      createdAt: new Date(apiCourse.created_at),
      updatedAt: apiCourse.updated_at ? new Date(apiCourse.updated_at) : undefined
    };
  }
}