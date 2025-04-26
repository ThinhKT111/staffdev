// src/app/core/services/task.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private endpoint = 'tasks';

  constructor(private apiBaseService: ApiBaseService) { }

  getTasks(params?: any): Observable<Task[]> {
    return this.apiBaseService.get<any[]>(this.endpoint, params)
      .pipe(
        map((tasks: any[]) => tasks.map(task => this.mapTaskFromApi(task)))
      );
  }
  
  getTasksByUser(userId: number): Observable<Task[]> {
    return this.apiBaseService.get<any[]>(`${this.endpoint}?assignedTo=${userId}`)
      .pipe(
        map((tasks: any[]) => tasks.map(task => this.mapTaskFromApi(task)))
      );
  }
  
  getTasksByAssigner(userId: number): Observable<Task[]> {
    return this.apiBaseService.get<any[]>(`${this.endpoint}?assignedBy=${userId}`)
      .pipe(
        map((tasks: any[]) => tasks.map(task => this.mapTaskFromApi(task)))
      );
  }
  
  getTaskById(id: number): Observable<Task> {
    return this.apiBaseService.getById<any>(this.endpoint, id)
      .pipe(
        map(task => this.mapTaskFromApi(task))
      );
  }
  
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    const apiTask = {
      title: task.title,
      description: task.description,
      assigned_to: task.assignedTo,
      assigned_by: task.assignedBy,
      deadline: task.deadline,
      status: task.status || 'Pending'
    };
    
    return this.apiBaseService.post<any>(this.endpoint, apiTask)
      .pipe(
        map(response => this.mapTaskFromApi(response))
      );
  }
  
  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    const apiTask: any = {};
    if (task.title) apiTask.title = task.title;
    if (task.description) apiTask.description = task.description;
    if (task.assignedTo !== undefined) apiTask.assigned_to = task.assignedTo;
    if (task.assignedBy !== undefined) apiTask.assigned_by = task.assignedBy;
    if (task.deadline) apiTask.deadline = task.deadline;
    if (task.status) apiTask.status = task.status;
    if (task.score !== undefined) apiTask.score = task.score;
    if (task.feedback !== undefined) apiTask.feedback = task.feedback;
    
    return this.apiBaseService.put<any>(this.endpoint, id, apiTask)
      .pipe(
        map(response => this.mapTaskFromApi(response))
      );
  }
  
  submitFeedback(id: number, score: number, feedback: string): Observable<Task> {
    return this.apiBaseService.post<any>(`${this.endpoint}/${id}/feedback`, { score, feedback })
      .pipe(
        map(response => this.mapTaskFromApi(response))
      );
  }
  
  deleteTask(id: number): Observable<void> {
    return this.apiBaseService.delete<void>(this.endpoint, id);
  }
  
  private mapTaskFromApi(apiTask: any): Task {
    return {
      id: apiTask.task_id,
      title: apiTask.title,
      description: apiTask.description,
      assignedTo: apiTask.assigned_to,
      assignedBy: apiTask.assigned_by,
      deadline: new Date(apiTask.deadline),
      status: apiTask.status,
      score: apiTask.score,
      feedback: apiTask.feedback,
      createdAt: new Date(apiTask.created_at),
      updatedAt: apiTask.updated_at ? new Date(apiTask.updated_at) : undefined
    };
  }
}