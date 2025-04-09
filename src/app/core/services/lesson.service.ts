import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { Lesson } from '../models/lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private endpoint = 'lessons';

  // Dữ liệu mẫu
  private mockLessons: Lesson[] = [
    {
      id: 1,
      courseId: 1,
      title: 'Giới thiệu về Angular',
      description: 'Tổng quan về framework Angular và các tính năng chính',
      content: 'Angular là một platform và framework để xây dựng các ứng dụng client trong HTML và TypeScript. Angular được viết bằng TypeScript. Nó triển khai các chức năng cốt lõi và tùy chọn như một tập hợp các thư viện TypeScript mà bạn nhập vào ứng dụng của mình.',
      order: 1,
      duration: 30,
      materials: ['Slide giới thiệu', 'Tài liệu tham khảo'],
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      courseId: 1,
      title: 'Component trong Angular',
      description: 'Tìm hiểu về Component và cách sử dụng',
      content: 'Components là khối xây dựng chính cho các ứng dụng Angular. Mỗi component bao gồm một lớp TypeScript với một bộ trang trí @Component, một template HTML và styles. Bộ trang trí @Component xác định: Một selector CSS xác định cách component được sử dụng trong template. Một template HTML hiển thị view của component. Một tập hợp tùy chọn CSS styles áp dụng cho template HTML của component.',
      order: 2,
      duration: 45,
      materials: ['Ví dụ mẫu', 'Bài tập thực hành'],
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      courseId: 1,
      title: 'Services và Dependency Injection',
      description: 'Học về Services và Dependency Injection trong Angular',
      content: 'Service là một hạng mục rộng bao gồm bất kỳ giá trị, chức năng hoặc tính năng nào mà ứng dụng của bạn cần. Một service thường là một lớp có mục đích hẹp. Nó nên làm một việc cụ thể và làm tốt việc đó. Angular phân biệt các components với các services để tăng tính mô-đun và khả năng tái sử dụng.',
      order: 3,
      duration: 60,
      materials: ['Hướng dẫn thực hành', 'Bài tập về nhà'],
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      courseId: 2,
      title: 'Kiểu dữ liệu nâng cao trong TypeScript',
      description: 'Tìm hiểu về các kiểu dữ liệu phức tạp trong TypeScript',
      content: 'TypeScript cung cấp nhiều kiểu dữ liệu nâng cao như Union Types, Intersection Types, Type Guards, Type Aliases, và Generic Types. Những kiểu này giúp bạn định nghĩa cấu trúc dữ liệu phức tạp và tăng tính an toàn cho mã của bạn.',
      order: 1,
      duration: 45,
      materials: ['Tài liệu tham khảo', 'Ví dụ mẫu'],
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(private apiBaseService: ApiBaseService) { }

  getLessons(): Observable<Lesson[]> {
    return of(this.mockLessons);
    // return this.apiBaseService.get<Lesson[]>(this.endpoint);
  }

  getLessonsByCourse(courseId: number): Observable<Lesson[]> {
    const lessons = this.mockLessons.filter(l => l.courseId === courseId)
      .sort((a, b) => a.order - b.order);
    return of(lessons);
    // return this.apiBaseService.get<Lesson[]>(`${this.endpoint}?courseId=${courseId}`);
  }

  getLessonById(id: number): Observable<Lesson> {
    const lesson = this.mockLessons.find(l => l.id === id);
    if (lesson) {
      return of(lesson);
    }
    throw new Error('Lesson not found');
    // return this.apiBaseService.getById<Lesson>(this.endpoint, id);
  }

  createLesson(lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Observable<Lesson> {
    const newLesson = {
      ...lesson,
      id: this.mockLessons.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockLessons.push(newLesson);
    return of(newLesson);
    // return this.apiBaseService.post<Lesson>(this.endpoint, lesson);
  }

  updateLesson(id: number, lesson: Partial<Lesson>): Observable<Lesson> {
    const index = this.mockLessons.findIndex(l => l.id === id);
    if (index !== -1) {
      const updatedLesson = {
        ...this.mockLessons[index],
        ...lesson,
        updatedAt: new Date()
      };
      this.mockLessons[index] = updatedLesson;
      return of(updatedLesson);
    }
    throw new Error('Lesson not found');
    // return this.apiBaseService.put<Lesson>(this.endpoint, id, lesson);
  }

  deleteLesson(id: number): Observable<void> {
    const index = this.mockLessons.findIndex(l => l.id === id);
    if (index !== -1) {
      this.mockLessons.splice(index, 1);
      return of(undefined);
    }
    throw new Error('Lesson not found');
    // return this.apiBaseService.delete<void>(this.endpoint, id);
  }

  reorderLessons(courseId: number, lessonIds: number[]): Observable<void> {
    // Lấy các bài học thuộc khóa học
    const courseLessons = this.mockLessons.filter(l => l.courseId === courseId);
    
    // Cập nhật thứ tự mới
    lessonIds.forEach((id, index) => {
      const lesson = courseLessons.find(l => l.id === id);
      if (lesson) {
        const lessonIndex = this.mockLessons.findIndex(l => l.id === id);
        if (lessonIndex !== -1) {
          this.mockLessons[lessonIndex] = {
            ...this.mockLessons[lessonIndex],
            order: index + 1,
            updatedAt: new Date()
          };
        }
      }
    });
    
    return of(undefined);
    // return this.apiBaseService.post<void>(`${this.endpoint}/reorder`, { courseId, lessonIds });
  }
}