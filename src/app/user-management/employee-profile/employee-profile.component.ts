// src/app/user-management/employee-profile/employee-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs'; // Thêm dòng này

import { EmployeeProfileService } from '../../core/services/employee-profile.service';
import { UserService } from '../../core/services/user.service';
import { DepartmentService } from '../../core/services/department.service';
import { AuthService } from '../../core/services/auth.service';

import { EmployeeProfile } from '../../core/models/employee-profile';
import { User } from '../../core/models/user';
import { Department } from '../../core/models/department';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTabsModule // Thêm dòng này
  ],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {
  userId: number = 0;
  user: User | null = null;
  profile: EmployeeProfile | null = null;
  department: Department | null = null;
  isCurrentUser = false;
  isAdmin = false;
  isEditMode = false;
  profileForm: FormGroup;
  selectedFile: File | null = null;
  avatarPreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profileService: EmployeeProfileService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.createProfileForm();
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Admin');
    const currentUser = this.authService.currentUser;
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.isCurrentUser = currentUser?.id === this.userId;
        this.loadUserData();
      } else if (currentUser) {
        this.userId = currentUser.id;
        this.isCurrentUser = true;
        this.loadUserData();
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  createProfileForm(profile?: EmployeeProfile): FormGroup {
    return this.fb.group({
      dateOfBirth: [profile?.dateOfBirth || null, [Validators.required]],
      address: [profile?.address || '', [Validators.required]],
      experience: [profile?.experience || ''],
      skills: [profile?.skills || '']
    });
  }

  loadUserData(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loadProfileData();
        this.loadDepartmentData(user.departmentId);
      },
      error: (err) => {
        console.error('Error loading user data', err);
        this.snackBar.open('Không thể tải thông tin người dùng', 'Đóng', { duration: 3000 });
      }
    });
  }

  loadProfileData(): void {
    this.profileService.getProfileByUserId(this.userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          dateOfBirth: profile.dateOfBirth,
          address: profile.address,
          experience: profile.experience,
          skills: profile.skills
        });
        this.avatarPreview = profile.avatarUrl || null;
      },
      error: (err) => {
        console.error('Error loading profile data', err);
        this.snackBar.open('Không thể tải thông tin hồ sơ', 'Đóng', { duration: 3000 });
      }
    });
  }

  loadDepartmentData(departmentId: number): void {
    this.departmentService.getDepartmentById(departmentId).subscribe({
      next: (department) => {
        this.department = department;
      },
      error: (err) => {
        console.error('Error loading department data', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadAvatar(): void {
    if (this.selectedFile && this.userId) {
      this.profileService.uploadAvatar(this.userId, this.selectedFile).subscribe({
        next: (avatarUrl) => {
          if (this.profile) {
            this.profile.avatarUrl = avatarUrl;
          }
          this.snackBar.open('Cập nhật ảnh đại diện thành công', 'Đóng', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error uploading avatar', err);
          this.snackBar.open('Không thể cập nhật ảnh đại diện', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode && this.profile) {
      // Reset form when canceling edit
      this.profileForm.patchValue({
        dateOfBirth: this.profile.dateOfBirth,
        address: this.profile.address,
        experience: this.profile.experience,
        skills: this.profile.skills
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid && this.profile) {
      const updatedProfile = {
        ...this.profileForm.value,
        userId: this.userId
      };

      if (this.profile.id) {
        // Update existing profile
        this.profileService.updateProfile(this.profile.id, updatedProfile).subscribe({
          next: (profile) => {
            this.profile = profile;
            this.isEditMode = false;
            this.snackBar.open('Cập nhật hồ sơ thành công', 'Đóng', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error updating profile', err);
            this.snackBar.open('Không thể cập nhật hồ sơ', 'Đóng', { duration: 3000 });
          }
        });
      } else {
        // Create new profile
        this.profileService.createProfile(updatedProfile).subscribe({
          next: (profile) => {
            this.profile = profile;
            this.isEditMode = false;
            this.snackBar.open('Tạo hồ sơ thành công', 'Đóng', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error creating profile', err);
            this.snackBar.open('Không thể tạo hồ sơ', 'Đóng', { duration: 3000 });
          }
        });
      }
    }
  }

  getRoleName(role: string): string {
    switch (role) {
      case 'Admin': return 'Quản trị viên';
      case 'TeamLeader': return 'Trưởng nhóm';
      case 'SeniorManager': return 'Quản lý cấp cao';
      case 'Employee': return 'Nhân viên';
      default: return role;
    }
  }

  getAvatarInitials(): string {
    if (!this.user) return '';
    const nameParts = this.user.fullName.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return '';
  }

  backToUserList(): void {
    this.router.navigate(['/users/list']);
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }
}