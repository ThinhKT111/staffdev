// src/app/training/training.routes.ts
import { Routes } from '@angular/router';
import { TrainingPathListComponent } from './training-path-list/training-path-list.component';
import { TrainingPathFormComponent } from './training-path-form/training-path-form.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseFormComponent } from './course-form/course-form.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { DocumentListComponent } from './document-list/document-list.component';

export const TRAINING_ROUTES: Routes = [
  { path: 'paths', component: TrainingPathListComponent },
  { path: 'paths/create', component: TrainingPathFormComponent },
  { path: 'paths/edit/:id', component: TrainingPathFormComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/create', component: CourseFormComponent },
  { path: 'courses/edit/:id', component: CourseFormComponent },
  { path: 'courses/:id', component: CourseDetailComponent },
  { path: 'documents', component: DocumentListComponent },
  { path: '', redirectTo: 'paths', pathMatch: 'full' }
];