import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DepartmentService } from '../../core/services/department.service';
import { UserService } from '../../core/services/user.service';
import { Department } from '../../core/models/department';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss']
})
export class DepartmentFormComponent implements OnInit {
  departmentForm: FormGroup;
  isEditMode = false;
  managers: any[] = [];

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DepartmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { department?: Department }
  ) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      managerId: [null]
    });
  }

  ngOnInit(): void {
    this.loadManagers();
    
    if (this.data.department) {
      this.isEditMode = true;
      this.departmentForm.patchValue({
        name: this.data.department.name,
        description: this.data.department.description,
        managerId: this.data.department.managerId
      });
    }
  }

  loadManagers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.managers = users.map(user => ({
          id: user.id,
          name: user.fullName // Thay thế `${user.firstName} ${user.lastName}` bằng `user.fullName`
        }));
      },
      error: (err) => {
        console.error('Error loading managers', err);
      }
    });
  }

  onSubmit(): void {
    if (this.departmentForm.valid) {
      this.isLoading = true;
      if (this.isEditMode) {
        this.departmentService.updateDepartment(
          this.data.department!.id,
          this.departmentForm.value
        ).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Cập nhật phòng ban thành công', 'Đóng', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error updating department', err);
            this.snackBar.open('Không thể cập nhật phòng ban', 'Đóng', { duration: 3000 });
          }
        });
      } else {
        this.departmentService.createDepartment(this.departmentForm.value).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Thêm phòng ban thành công', 'Đóng', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error creating department', err);
            this.snackBar.open('Không thể thêm phòng ban', 'Đóng', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}