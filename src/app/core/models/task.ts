export interface Task {
  id: number; // task_id
  title: string;
  description: string;
  assignedTo: number; // assigned_to
  assignedBy: number; // assigned_by
  deadline: Date;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Rejected';
  score?: number;
  feedback?: string;
  createdAt: Date; // created_at
  updatedAt?: Date; // updated_at
}