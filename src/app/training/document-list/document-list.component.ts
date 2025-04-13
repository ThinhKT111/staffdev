// src/app/training/document-list/document-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Thêm nếu cần cho loading
import { MatBadgeModule } from '@angular/material/badge'; // Thêm nếu cần cho badge

import { DocumentService } from '../../core/services/document.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Document } from '../../core/models/document';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressBarModule, // Thêm nếu cần
    MatBadgeModule // Thêm nếu cần
  ],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  // Phần code còn lại giữ nguyên không đổi
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  categories: string[] = [];
  users: User[] = [];
  displayedColumns: string[] = ['title', 'category', 'uploadedBy', 'uploadedAt', 'actions'];
  searchText = '';
  selectedCategory = '';
  
  isAdmin = false;
  currentUser: User | null = null;
  
  showUploadForm = false;
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  
  constructor(
    private documentService: DocumentService,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.uploadForm = this.createUploadForm();
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Admin');
    this.currentUser = this.authService.currentUser;
    
    this.loadDocuments();
    this.loadCategories();
    this.loadUsers();
  }

  createUploadForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]]
    });
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: (docs) => {
        this.documents = docs;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading documents', err);
        this.snackBar.open('Không thể tải danh sách tài liệu', 'Đóng', { duration: 3000 });
      }
    });
  }

  loadCategories(): void {
    this.documentService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories', err);
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.documents];

    // Filter by search text
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter(doc => doc.category === this.selectedCategory);
    }

    this.filteredDocuments = filtered;
  }

  onSearchChange(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  toggleUploadForm(): void {
    this.showUploadForm = !this.showUploadForm;
    if (!this.showUploadForm) {
      this.uploadForm.reset();
      this.selectedFile = null;
    }
  }

  uploadDocument(): void {
    if (this.uploadForm.valid && this.selectedFile && this.currentUser) {
      const { title, category } = this.uploadForm.value;
      
      this.documentService.uploadDocument(title, category, this.selectedFile, this.currentUser.id).subscribe({
        next: () => {
          this.snackBar.open('Tải lên tài liệu thành công', 'Đóng', { duration: 3000 });
          this.uploadForm.reset();
          this.selectedFile = null;
          this.showUploadForm = false;
          this.loadDocuments();
        },
        error: (err) => {
          console.error('Error uploading document', err);
          this.snackBar.open('Không thể tải lên tài liệu', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  downloadDocument(id: number): void {
    this.documentService.downloadDocument(id).subscribe({
      next: (url) => {
        // Trong môi trường thực, cần tạo một link element và kích hoạt click để tải
        const a = document.createElement('a');
        a.href = url;
        a.download = url.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        this.snackBar.open('Đang tải tài liệu...', 'Đóng', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error downloading document', err);
        this.snackBar.open('Không thể tải tài liệu', 'Đóng', { duration: 3000 });
      }
    });
  }

  deleteDocument(id: number): void {
    if (confirm('Bạn có chắc muốn xóa tài liệu này?')) {
      this.documentService.deleteDocument(id).subscribe({
        next: () => {
          this.snackBar.open('Xóa tài liệu thành công', 'Đóng', { duration: 3000 });
          this.loadDocuments();
        },
        error: (err) => {
          console.error('Error deleting document', err);
          this.snackBar.open('Không thể xóa tài liệu', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.fullName : 'Không xác định';
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  getFileIcon(fileUrl: string): string {
    if (!fileUrl) return 'insert_drive_file';
    
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') return 'picture_as_pdf';
    if (extension === 'doc' || extension === 'docx') return 'description';
    if (extension === 'xls' || extension === 'xlsx') return 'table_chart';
    if (extension === 'ppt' || extension === 'pptx') return 'slideshow';
    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') return 'image';
    
    return 'insert_drive_file';
  }
}