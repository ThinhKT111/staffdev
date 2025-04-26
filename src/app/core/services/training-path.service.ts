// src/app/core/services/training-path.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { TrainingPath } from '../models/training-path';

@Injectable({
  providedIn: 'root'
})
export class TrainingPathService {
  private endpoint = 'training/paths';

  constructor(private apiBaseService: ApiBaseService) { }

  getTrainingPaths(): Observable<TrainingPath[]> {
    return this.apiBaseService.get<any[]>(this.endpoint)
      .pipe(
        map((paths: any[]) => paths.map(path => this.mapTrainingPathFromApi(path)))
      );
  }
  
  getTrainingPathById(id: number): Observable<TrainingPath> {
    return this.apiBaseService.getById<any>(this.endpoint, id)
      .pipe(
        map(path => this.mapTrainingPathFromApi(path))
      );
  }
  
  createTrainingPath(path: Omit<TrainingPath, 'id' | 'createdAt' | 'updatedAt'>): Observable<TrainingPath> {
    const apiPath = {
      title: path.title || path.name,
      description: path.description,
      department_id: path.departmentId,
      duration: path.duration,
      created_by: path.createdBy,
      // The following fields don't exist in database schema but are used in frontend
      total_courses: path.totalCourses,
      duration_in_weeks: path.durationInWeeks,
      is_active: path.isActive
    };
    
    return this.apiBaseService.post<any>(this.endpoint, apiPath)
      .pipe(map(response => this.mapTrainingPathFromApi(response)));
  }
  
  updateTrainingPath(id: number, path: Partial<TrainingPath>): Observable<TrainingPath> {
    const apiPath: any = {};
    if (path.title || path.name) apiPath.title = path.title || path.name;
    if (path.description) apiPath.description = path.description;
    if (path.departmentId !== undefined) apiPath.departmentId = path.departmentId;
    if (path.duration) apiPath.duration = path.duration;
    if (path.totalCourses !== undefined) apiPath.totalCourses = path.totalCourses;
    if (path.durationInWeeks !== undefined) apiPath.durationInWeeks = path.durationInWeeks;
    if (path.isActive !== undefined) apiPath.isActive = path.isActive;
    
    return this.apiBaseService.patch<any>(this.endpoint, id, apiPath)
      .pipe(
        map(response => this.mapTrainingPathFromApi(response))
      );
  }
  
  deleteTrainingPath(id: number): Observable<void> {
    return this.apiBaseService.delete<void>(this.endpoint, id);
  }
  
  private mapTrainingPathFromApi(apiPath: any): TrainingPath {
    return {
      id: apiPath.training_path_id,
      title: apiPath.title,
      name: apiPath.title, // Cho tương thích với code cũ
      description: apiPath.description,
      departmentId: apiPath.department_id,
      duration: apiPath.duration,
      createdBy: apiPath.created_by,
      totalCourses: apiPath.total_courses,
      durationInWeeks: apiPath.duration_in_weeks,
      isActive: apiPath.is_active,
      createdAt: new Date(apiPath.created_at),
      updatedAt: apiPath.updated_at ? new Date(apiPath.updated_at) : undefined
    };
  }
}