// src/app/communication/communication.routes.ts
import { Routes } from '@angular/router';
import { ForumListComponent } from './forum-list/forum-list.component';
import { ForumDetailComponent } from './forum-detail/forum-detail.component';
import { ForumFormComponent } from './forum-form/forum-form.component';

export const COMMUNICATION_ROUTES: Routes = [
  { path: 'forum', component: ForumListComponent },
  { path: 'forum/create', component: ForumFormComponent },
  { path: 'forum/edit/:id', component: ForumFormComponent },
  { path: 'forum/:id', component: ForumDetailComponent },
  { path: 'notifications', redirectTo: 'forum', pathMatch: 'full' }, // Để sau sẽ phát triển thêm
  { path: '', redirectTo: 'forum', pathMatch: 'full' }
];