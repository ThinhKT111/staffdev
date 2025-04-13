// src/app/core/services/document.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { Document } from '../models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private endpoint = 'documents';

  // Dữ liệu mẫu
  private mockDocuments: Document[] = [
    {
      id: 1,
      title: 'Quy trình đào tạo nhân viên mới',
      fileUrl: 'assets/documents/quy-trinh-dao-tao.pdf',
      category: 'HR',
      uploadedBy: 1,
      uploadedAt: new Date('2025-01-15')
    },
    {
      id: 2,
      title: 'Hướng dẫn sử dụng hệ thống StaffDev',
      fileUrl: 'assets/documents/huong-dan-staffdev.pdf',
      category: 'IT',
      uploadedBy: 1,
      uploadedAt: new Date('2025-02-20')
    },
    {
      id: 3,
      title: 'Nội quy công ty',
      fileUrl: 'assets/documents/noi-quy-cong-ty.docx',
      category: 'HR',
      uploadedBy: 2,
      uploadedAt: new Date('2025-03-10')
    },
    {
      id: 4,
      title: 'Kế hoạch phát triển Q2/2025',
      fileUrl: 'assets/documents/ke-hoach-q2-2025.xlsx',
      category: 'Business',
      uploadedBy: 1,
      uploadedAt: new Date('2025-04-01')
    },
    {
      id: 5,
      title: 'Tài liệu Angular cơ bản',
      fileUrl: 'assets/documents/angular-basics.pdf',
      category: 'Training',
      uploadedBy: 2,
      uploadedAt: new Date('2025-03-15')
    }
  ];

  constructor(private apiBaseService: ApiBaseService) { }

  getDocuments(): Observable<Document[]> {
    return of(this.mockDocuments);
    // return this.apiBaseService.get<Document[]>(this.endpoint);
  }

  getDocumentsByCategory(category: string): Observable<Document[]> {
    const filteredDocs = this.mockDocuments.filter(doc => doc.category === category);
    return of(filteredDocs);
    // return this.apiBaseService.get<Document[]>(`${this.endpoint}?category=${category}`);
  }

  getDocumentById(id: number): Observable<Document> {
    const document = this.mockDocuments.find(doc => doc.id === id);
    if (document) {
      return of(document);
    }
    throw new Error('Document not found');
    // return this.apiBaseService.getById<Document>(this.endpoint, id);
  }

  uploadDocument(title: string, category: string, file: File, uploadedBy: number): Observable<Document> {
    // Giả lập upload
    const fileUrl = `assets/documents/${file.name}`;
    const newDocument: Document = {
      id: this.mockDocuments.length + 1,
      title,
      fileUrl,
      category,
      uploadedBy,
      uploadedAt: new Date()
    };
    
    this.mockDocuments.push(newDocument);
    return of(newDocument);
    
    // Trong môi trường thực, cần dùng FormData
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('title', title);
    // formData.append('category', category);
    // formData.append('uploadedBy', uploadedBy.toString());
    // return this.apiBaseService.post<Document>(this.endpoint, formData);
  }

  updateDocument(id: number, data: Partial<Document>): Observable<Document> {
    const index = this.mockDocuments.findIndex(doc => doc.id === id);
    if (index !== -1) {
      const updatedDocument = {
        ...this.mockDocuments[index],
        ...data
      };
      this.mockDocuments[index] = updatedDocument;
      return of(updatedDocument);
    }
    throw new Error('Document not found');
    // return this.apiBaseService.put<Document>(`${this.endpoint}/${id}`, data);
  }

  deleteDocument(id: number): Observable<void> {
    const index = this.mockDocuments.findIndex(doc => doc.id === id);
    if (index !== -1) {
      this.mockDocuments.splice(index, 1);
      return of(undefined);
    }
    throw new Error('Document not found');
    // return this.apiBaseService.delete<void>(`${this.endpoint}/${id}`);
  }

  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.mockDocuments.map(doc => doc.category))];
    return of(categories);
    // return this.apiBaseService.get<string[]>(`${this.endpoint}/categories`);
  }

  downloadDocument(id: number): Observable<string> {
    const document = this.mockDocuments.find(doc => doc.id === id);
    if (document) {
      // Trong môi trường thực, đây sẽ là URL để tải tài liệu
      return of(document.fileUrl);
    }
    throw new Error('Document not found');
    // return this.apiBaseService.get<string>(`${this.endpoint}/${id}/download`);
  }
}