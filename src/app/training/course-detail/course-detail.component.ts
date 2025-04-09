import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';

import { CourseService } from '../../core/services/course.service';
import { LessonService } from '../../core/services/lesson.service';
import { TrainingPathService } from '../../core/services/training-path.service';
import { Course } from '../../core/models/course';
import { Lesson } from '../../core/models/lesson';
import { TrainingPath } from '../../core/models/training-path';

interface LessonFormData {
  id?: number;
  title: string;
  description: string;
  content: string;
  duration: number;
  materials: string;
  isPublished: boolean;
}

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatExpansionModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatListModule
  ],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  trainingPath: TrainingPath | null = null;
  lessons: Lesson[] = [];
  lessonForm: FormGroup;
  selectedLesson: Lesson | null = null;
  isEditingLesson = false;
  expandedLessonId: number | null = null;

  constructor(
    private courseService: CourseService,
    private lessonService: LessonService,
    private trainingPathService: TrainingPathService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.lessonForm = this.createLessonForm();
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourse(+courseId);
    } else {
      this.router.navigate(['/training/courses']);
    }
  }

  createLessonForm(lesson?: Lesson): FormGroup {
    return this.fb.group({
      title: [lesson?.title || '', [Validators.required]],
      description: [lesson?.description || '', [Validators.required]],
      content: [lesson?.content || '', [Validators.required]],
      duration: [lesson?.duration || 30, [Validators.required, Validators.min(1)]],
      materials: [lesson?.materials?.join(', ') || ''],
      isPublished: [lesson?.isPublished !== undefined ? lesson.isPublished : true]
    });
  }

  loadCourse(id: number): void {
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.course = course;
        this.loadTrainingPath(course.trainingPathId);
        this.loadLessons(course.id);
      },
      error: (err) => {
        console.error('Error loading course', err);
        this.snackBar.open('Không thể tải thông tin khóa học', 'Đóng', { duration: 3000 });
        this.router.navigate(['/training/courses']);
      }
    });
  }

  loadTrainingPath(id: number): void {
    this.trainingPathService.getTrainingPathById(id).subscribe({
      next: (path) => {
        this.trainingPath = path;
      },
      error: (err) => {
        console.error('Error loading training path', err);
      }
    });
  }

  loadLessons(courseId: number): void {
    this.lessonService.getLessonsByCourse(courseId).subscribe({
      next: (lessons) => {
        this.lessons = lessons;
      },
      error: (err) => {
        console.error('Error loading lessons', err);
        this.snackBar.open('Không thể tải danh sách bài học', 'Đóng', { duration: 3000 });
      }
    });
  }

  getLevelLabel(level: string): string {
    switch (level) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung cấp';
      case 'advanced': return 'Nâng cao';
      default: return 'Không xác định';
    }
  }

  getCompletionPercentage(): number {
    if (!this.lessons.length) return 0;
    const publishedCount = this.lessons.filter(lesson => lesson.isPublished).length;
    return (publishedCount / this.lessons.length) * 100;
  }

  /**
   * Lấy số lượng bài học đã xuất bản
   * @returns Số lượng bài học đã được xuất bản
   */
  getPublishedLessonsCount(): number {
    if (!this.lessons) {
      return 0;
    }
    return this.lessons.filter(lesson => lesson && lesson.isPublished).length;
  }

  /**
   * Lấy tổng số bài học
   * @returns Tổng số bài học
   */
  getLessonsCount(): number {
    return this.lessons ? this.lessons.length : 0;
  }

  toggleLessonExpansion(lessonId: number): void {
    this.expandedLessonId = this.expandedLessonId === lessonId ? null : lessonId;
  }

  editCourse(): void {
    if (this.course) {
      this.router.navigate(['/training/courses/edit', this.course.id]);
    }
  }

  addNewLesson(): void {
    this.isEditingLesson = false;
    this.selectedLesson = null;
    this.lessonForm = this.createLessonForm();
  }

  editLesson(lesson: Lesson): void {
    this.isEditingLesson = true;
    this.selectedLesson = lesson;
    this.lessonForm = this.createLessonForm(lesson);
  }

  cancelLessonEdit(): void {
    this.selectedLesson = null;
    this.lessonForm.reset();
  }

  saveLesson(): void {
    if (this.lessonForm.valid && this.course) {
      const formData = this.lessonForm.value as LessonFormData;
      const materials = formData.materials ? formData.materials.split(',').map(m => m.trim()).filter(m => m) : [];
      
      if (this.isEditingLesson && this.selectedLesson) {
        // Cập nhật bài học
        this.lessonService.updateLesson(this.selectedLesson.id, {
          ...formData,
          materials
        }).subscribe({
          next: () => {
            this.snackBar.open('Cập nhật bài học thành công', 'Đóng', { duration: 3000 });
            this.loadLessons(this.course!.id);
            this.cancelLessonEdit();
          },
          error: (err) => {
            console.error('Error updating lesson', err);
            this.snackBar.open('Không thể cập nhật bài học', 'Đóng', { duration: 3000 });
          }
        });
      } else {
        // Thêm bài học mới
        const newOrder = this.lessons.length + 1;
        this.lessonService.createLesson({
          courseId: this.course.id,
          order: newOrder,
          ...formData,
          materials
        }).subscribe({
          next: () => {
            this.snackBar.open('Thêm bài học thành công', 'Đóng', { duration: 3000 });
            this.loadLessons(this.course!.id);
            this.cancelLessonEdit();
          },
          error: (err) => {
            console.error('Error creating lesson', err);
            this.snackBar.open('Không thể thêm bài học', 'Đóng', { duration: 3000 });
          }
        });
      }
    }
  }

  deleteLesson(lessonId: number): void {
    if (confirm('Bạn có chắc muốn xóa bài học này?')) {
      this.lessonService.deleteLesson(lessonId).subscribe({
        next: () => {
          this.snackBar.open('Xóa bài học thành công', 'Đóng', { duration: 3000 });
          this.loadLessons(this.course!.id);
        },
        error: (err) => {
          console.error('Error deleting lesson', err);
          this.snackBar.open('Không thể xóa bài học', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  toggleLessonStatus(lesson: Lesson): void {
    const newStatus = !lesson.isPublished;
    this.lessonService.updateLesson(lesson.id, { isPublished: newStatus }).subscribe({
      next: () => {
        this.snackBar.open(
          `Bài học đã được ${newStatus ? 'xuất bản' : 'ẩn'}`, 
          'Đóng', 
          { duration: 3000 }
        );
        this.loadLessons(this.course!.id);
      },
      error: (err) => {
        console.error('Error updating lesson status', err);
        this.snackBar.open('Không thể cập nhật trạng thái bài học', 'Đóng', { duration: 3000 });
      }
    });
  }

  backToCourses(): void {
    if (this.course) {
      this.router.navigate(['/training/courses'], { 
        queryParams: { pathId: this.course.trainingPathId } 
      });
    } else {
      this.router.navigate(['/training/courses']);
    }
  }
}