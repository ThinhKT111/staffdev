import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private endpoint = 'tasks';

  // Mock data
  private mockTasks: Task[] = [
    {
      id: 1,
      title: 'Hoàn thành báo cáo quý 2',
      description: 'Tổng hợp và phân tích dữ liệu quý 2/2025, đánh giá hiệu suất, dự báo cho quý tiếp theo.',
      assignedTo: 1,
      assignedBy: 2,
      deadline: new Date('2025-06-15'),
      status: 'InProgress',
      createdAt: new Date('2025-04-01')
    },
    {
      id: 2,
      title: 'Kiểm tra chất lượng ứng dụng',
      description: 'Rà soát các tính năng mới và đảm bảo chất lượng trước khi phát hành phiên bản mới.',
      assignedTo: 1,
      assignedBy: 2,
      deadline: new Date('2025-05-20'),
      status: 'Pending',
      createdAt: new Date('2025-04-05')
    },
    {
      id: 3,
      title: 'Đào tạo nhân viên mới',
      description: 'Hướng dẫn các quy trình và công nghệ cơ bản cho nhân viên mới.',
      assignedTo: 1,
      assignedBy: 3,
      deadline: new Date('2025-04-30'),
      status: 'Completed',
      score: 95,
      feedback: 'Hoàn thành xuất sắc, nhân viên mới đã nắm được kiến thức cơ bản.',
      createdAt: new Date('2025-04-10'),
      updatedAt: new Date('2025-04-25')
    }
  ];

  constructor(private apiBaseService: ApiBaseService) { }

  getTasks(): Observable<Task[]> {
    return of(this.mockTasks);
    // return this.apiBaseService.get<Task[]>(this.endpoint);
  }

  getTasksByUser(userId: number): Observable<Task[]> {
    return of(this.mockTasks.filter(task => task.assignedTo === userId));
    // return this.apiBaseService.get<Task[]>(`${this.endpoint}?assignedTo=${userId}`);
  }

  getTasksByAssigner(userId: number): Observable<Task[]> {
    return of(this.mockTasks.filter(task => task.assignedBy === userId));
    // return this.apiBaseService.get<Task[]>(`${this.endpoint}?assignedBy=${userId}`);
  }

  getTaskById(id: number): Observable<Task> {
    const task = this.mockTasks.find(t => t.id === id);
    if (task) {
      return of(task);
    }
    throw new Error('Task not found');
    // return this.apiBaseService.getById<Task>(this.endpoint, id);
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    const newTask = {
      ...task,
      id: this.mockTasks.length + 1,
      createdAt: new Date(),
      updatedAt: undefined
    };
    this.mockTasks.push(newTask);
    return of(newTask);
    // return this.apiBaseService.post<Task>(this.endpoint, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    const index = this.mockTasks.findIndex(t => t.id === id);
    if (index !== -1) {
      const updatedTask = {
        ...this.mockTasks[index],
        ...task,
        updatedAt: new Date()
      };
      this.mockTasks[index] = updatedTask;
      return of(updatedTask);
    }
    throw new Error('Task not found');
    // return this.apiBaseService.put<Task>(`${this.endpoint}/${id}`, task);
  }

  submitFeedback(id: number, score: number, feedback: string): Observable<Task> {
    return this.updateTask(id, { 
      status: 'Completed', 
      score, 
      feedback 
    });
    // return this.apiBaseService.post<Task>(`${this.endpoint}/${id}/feedback`, { score, feedback });
  }

  deleteTask(id: number): Observable<void> {
    const index = this.mockTasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTasks.splice(index, 1);
      return of(undefined);
    }
    throw new Error('Task not found');
    // return this.apiBaseService.delete<void>(`${this.endpoint}/${id}`);
  }
}