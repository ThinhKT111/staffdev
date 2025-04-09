import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { TrainingPath } from '../models/training-path';

@Injectable({
  providedIn: 'root'
})
export class TrainingPathService {
  private endpoint = 'training-paths';

  // Dữ liệu mẫu
  private mockTrainingPaths: TrainingPath[] = [
    { 
      id: 1, 
      name: 'Đào tạo nhân viên IT', 
      description: 'Lộ trình đào tạo cho nhân viên mới phòng IT',
      departmentId: 1,
      totalCourses: 5,
      durationInWeeks: 8,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 2, 
      name: 'Đào tạo kỹ năng quản lý', 
      description: 'Lộ trình đào tạo cho các quản lý cấp trung',
      departmentId: 2,
      totalCourses: 3,
      durationInWeeks: 6,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 3, 
      name: 'Đào tạo nhân viên Sales', 
      description: 'Lộ trình đào tạo kỹ năng bán hàng',
      departmentId: 5,
      totalCourses: 4,
      durationInWeeks: 4,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(private apiBaseService: ApiBaseService) { }

  getTrainingPaths(): Observable<TrainingPath[]> {
    return of(this.mockTrainingPaths);
    // return this.apiBaseService.get<TrainingPath[]>(this.endpoint);
  }

  getTrainingPathById(id: number): Observable<TrainingPath> {
    const path = this.mockTrainingPaths.find(p => p.id === id);
    if (path) {
      return of(path);
    }
    throw new Error('Training path not found');
    // return this.apiBaseService.getById<TrainingPath>(this.endpoint, id);
  }

  createTrainingPath(trainingPath: Omit<TrainingPath, 'id' | 'createdAt' | 'updatedAt'>): Observable<TrainingPath> {
    const newPath = {
      ...trainingPath,
      id: this.mockTrainingPaths.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockTrainingPaths.push(newPath);
    return of(newPath);
    // return this.apiBaseService.post<TrainingPath>(this.endpoint, trainingPath);
  }

  updateTrainingPath(id: number, trainingPath: Partial<TrainingPath>): Observable<TrainingPath> {
    const index = this.mockTrainingPaths.findIndex(p => p.id === id);
    if (index !== -1) {
      const updatedPath = {
        ...this.mockTrainingPaths[index],
        ...trainingPath,
        updatedAt: new Date()
      };
      this.mockTrainingPaths[index] = updatedPath;
      return of(updatedPath);
    }
    throw new Error('Training path not found');
    // return this.apiBaseService.put<TrainingPath>(this.endpoint, id, trainingPath);
  }

  deleteTrainingPath(id: number): Observable<void> {
    const index = this.mockTrainingPaths.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockTrainingPaths.splice(index, 1);
      return of(undefined);
    }
    throw new Error('Training path not found');
    // return this.apiBaseService.delete<void>(this.endpoint, id);
  }
}