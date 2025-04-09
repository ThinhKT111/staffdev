import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  
  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Developer' },
    { id: 4, name: 'Tester' },
    { id: 5, name: 'HR' }
  ];
  
  departments = [
    { id: 1, name: 'IT' },
    { id: 2, name: 'HR' },
    { id: 3, name: 'Finance' },
    { id: 4, name: 'Marketing' },
    { id: 5, name: 'Sales' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      idNumber: ['', [Validators.required]],
      roleId: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      joinDate: [new Date(), [Validators.required]],
      phoneNumber: ['', [Validators.pattern(/^\d{10}$/)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.loadUserData(this.userId);
    }
  }

  loadUserData(id: number) {
    // Giả lập tải dữ liệu người dùng - sau này sẽ thay bằng API call thực
    if (id === 1) {
      this.userForm.patchValue({
        firstName: 'Nguyễn',
        lastName: 'Văn A',
        email: 'nguyenvana@example.com',
        idNumber: '034095000123',
        roleId: 3,
        departmentId: 1,
        joinDate: new Date('2023-01-15'),
        phoneNumber: '0912345678',
        isActive: true
      });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form submitted:', this.userForm.value);
      
      if (this.isEditMode) {
        // Implement update user logic
        console.log(`Updating user ${this.userId} with data:`, this.userForm.value);
      } else {
        // Implement create user logic
        console.log('Creating new user with data:', this.userForm.value);
      }
      
      // Navigate back to user list after save
      this.router.navigate(['/users/list']);
    }
  }

  cancel() {
    this.router.navigate(['/users/list']);
  }
}