// src/app/core/services/document.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { Document } from '../models/document';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private endpoint = 'documents';
  private apiUrl = environment.apiUrl;

  constructor(
    private apiBaseService: ApiBaseService,
    private http: HttpClient
  ) { }

  getDocuments(params?: any): Observable<Document[]> {
    return this.apiBaseService.get<any[]>(this.endpoint, params)
      .pipe(
        map((documents: any[]) => documents.map(doc => this.mapDocumentFromApi(doc)))
      );
  }
  
  getDocumentsByCategory(category: string): Observable<Document[]> {
    return this.apiBaseService.get<any[]>(`${this.endpoint}?category=${category}`)
      .pipe(
        map((documents: any[]) => documents.map(doc => this.mapDocumentFromApi(doc)))
      );
  }
  
  getDocumentById(id: number): Observable<Document> {
    return this.apiBaseService.getById<any>(this.endpoint, id)
      .pipe(
        map(document => this.mapDocumentFromApi(document))
      );
  }
  
  getCategories(): Observable<string[]> {
    return this.apiBaseService.get<string[]>(`${this.endpoint}/categories`);
  }
  
  downloadDocument(id: number): Observable<string> {
    return this.apiBaseService.get<string>(`${this.endpoint}/${id}/download`);
  }

  uploadDocument(title: string, category: string, file: File, uploadedBy: number): Observable<Document> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('uploadedBy', uploadedBy.toString());
    formData.append('file', file);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post<any>(`${this.apiUrl}/${this.endpoint}`, formData, { headers })
      .pipe(
        map(response => this.mapDocumentFromApi(response)),
        catchError(error => {
          let errorMsg = 'Lỗi khi tải lên tài liệu';
          if (error.error && error.error.message) {
            errorMsg = error.error.message;
          }
          throw new Error(errorMsg);
        })
      );
  }
  
  updateDocument(id: number, data: Partial<Document>): Observable<Document> {
    const apiDocument: any = {};
    if (data.title) apiDocument.title = data.title;
    if (data.category) apiDocument.category = data.category;
    
    return this.apiBaseService.patch<any>(this.endpoint, id, apiDocument)
      .pipe(
        map(response => this.mapDocumentFromApi(response))
      );
  }
  
  deleteDocument(id: number): Observable<void> {
    return this.apiBaseService.delete<void>(this.endpoint, id);
  }
  
  private mapDocumentFromApi(apiDocument: any): Document {
    return {
      id: apiDocument.document_id,
      title: apiDocument.title,
      fileUrl: apiDocument.file_url,
      category: apiDocument.category,
      uploadedBy: apiDocument.uploaded_by,
      uploadedAt: new Date(apiDocument.uploaded_at)
    };
  }
}