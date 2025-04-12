// src/app/core/models/document.ts
export interface Document {
    id: number; // document_id
    title: string;
    fileUrl: string; // file_url
    category: string;
    uploadedBy: number; // uploaded_by
    uploadedAt: Date; // uploaded_at
  }