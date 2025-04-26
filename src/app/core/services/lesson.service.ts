import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { Lesson } from '../models/lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private endpoint = 'lessons';

  constructor(private apiBaseService: ApiBaseService) { }

  getLessons(): Observable<Lesson[]> {
    return this.apiBaseService.get<any[]>(this.endpoint)
      .pipe(
        map((lessons: any[]) => lessons.map(lesson => this.mapLessonFromApi(lesson)))
      );
  }

  getLessonsByCourse(courseId: number): Observable<Lesson[]> {
    return this.apiBaseService.get<any[]>(`${this.endpoint}?courseId=${courseId}`)
      .pipe(
        map((lessons: any[]) => 
          lessons
            .map(lesson => this.mapLessonFromApi(lesson))
            .sort((a, b) => a.order - b.order)
        )
      );
  }

  getLessonById(id: number): Observable<Lesson> {
    return this.apiBaseService.getById<any>(this.endpoint, id)
      .pipe(
        map(lesson => this.mapLessonFromApi(lesson))
      );
  }

  createLesson(lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Observable<Lesson> {
    const apiLesson = {
      course_id: lesson.courseId,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      order: lesson.order,
      duration: lesson.duration,
      materials: lesson.materials,
      is_published: lesson.isPublished
    };
    
    return this.apiBaseService.post<any>(this.endpoint, apiLesson)
      .pipe(
        map(response => this.mapLessonFromApi(response))
      );
  }

  updateLesson(id: number, lesson: Partial<Lesson>): Observable<Lesson> {
    const apiLesson: any = {};
    
    if (lesson.title !== undefined) apiLesson.title = lesson.title;
    if (lesson.description !== undefined) apiLesson.description = lesson.description;
    if (lesson.content !== undefined) apiLesson.content = lesson.content;
    if (lesson.order !== undefined) apiLesson.order = lesson.order;
    if (lesson.duration !== undefined) apiLesson.duration = lesson.duration;
    if (lesson.materials !== undefined) apiLesson.materials = lesson.materials;
    if (lesson.isPublished !== undefined) apiLesson.is_published = lesson.isPublished;
    
    return this.apiBaseService.patch<any>(this.endpoint, id, apiLesson)
      .pipe(
        map(response => this.mapLessonFromApi(response))
      );
  }

  deleteLesson(id: number): Observable<void> {
    return this.apiBaseService.delete<void>(this.endpoint, id);
  }

  reorderLessons(courseId: number, lessonIds: number[]): Observable<void> {
    return this.apiBaseService.post<void>(`${this.endpoint}/reorder`, { 
      course_id: courseId, 
      lesson_ids: lessonIds 
    });
  }

  private mapLessonFromApi(apiLesson: any): Lesson {
    return {
      id: apiLesson.lesson_id || apiLesson.id,
      courseId: apiLesson.course_id,
      title: apiLesson.title,
      description: apiLesson.description,
      content: apiLesson.content,
      order: apiLesson.order,
      duration: apiLesson.duration,
      materials: apiLesson.materials,
      isPublished: apiLesson.is_published,
      createdAt: apiLesson.created_at ? new Date(apiLesson.created_at) : undefined,
      updatedAt: apiLesson.updated_at ? new Date(apiLesson.updated_at) : undefined
    };
  }
}