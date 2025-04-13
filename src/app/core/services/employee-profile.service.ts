// src/app/core/services/employee-profile.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { EmployeeProfile } from '../models/employee-profile';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  private endpoint = 'profiles';

  // Dữ liệu mẫu
  private mockProfiles: EmployeeProfile[] = [
    {
      id: 1,
      userId: 1,
      dateOfBirth: new Date('1990-05-15'),
      address: 'Số 123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
      experience: '5 năm kinh nghiệm trong lĩnh vực CNTT',
      skills: 'Angular, React, NodeJS, SQL, MongoDB',
      avatarUrl: 'assets/images/avatars/avatar-1.jpg',
      updatedAt: new Date()
    },
    {
      id: 2,
      userId: 2,
      dateOfBirth: new Date('1992-11-23'),
      address: 'Số 456 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      experience: '3 năm kinh nghiệm trong lĩnh vực tiếp thị',
      skills: 'Content Writing, SEO, Social Media Marketing',
      avatarUrl: 'assets/images/avatars/avatar-2.jpg',
      updatedAt: new Date()
    }
  ];

  constructor(private apiBaseService: ApiBaseService) { }

  getProfiles(): Observable<EmployeeProfile[]> {
    return of(this.mockProfiles);
    // return this.apiBaseService.get<EmployeeProfile[]>(this.endpoint);
  }

  getProfileByUserId(userId: number): Observable<EmployeeProfile> {
    const profile = this.mockProfiles.find(p => p.userId === userId);
    if (profile) {
      return of(profile);
    }
    // Nếu không tìm thấy, tạo một profile mới
    const newProfile: EmployeeProfile = {
      id: this.mockProfiles.length + 1,
      userId: userId,
      dateOfBirth: new Date(),
      address: '',
      experience: '',
      skills: '',
      avatarUrl: '',
      updatedAt: new Date()
    };
    return of(newProfile);
    // return this.apiBaseService.get<EmployeeProfile>(`${this.endpoint}/user/${userId}`);
  }

  createProfile(profile: Omit<EmployeeProfile, 'id' | 'updatedAt'>): Observable<EmployeeProfile> {
    const newProfile = {
      ...profile,
      id: this.mockProfiles.length + 1,
      updatedAt: new Date()
    };
    this.mockProfiles.push(newProfile);
    return of(newProfile);
    // return this.apiBaseService.post<EmployeeProfile>(this.endpoint, profile);
  }

  updateProfile(id: number, profile: Partial<EmployeeProfile>): Observable<EmployeeProfile> {
    const index = this.mockProfiles.findIndex(p => p.id === id);
    if (index !== -1) {
      const updatedProfile = {
        ...this.mockProfiles[index],
        ...profile,
        updatedAt: new Date()
      };
      this.mockProfiles[index] = updatedProfile;
      return of(updatedProfile);
    }
    throw new Error('Profile not found');
    // return this.apiBaseService.put<EmployeeProfile>(`${this.endpoint}/${id}`, profile);
  }

  uploadAvatar(userId: number, file: File): Observable<string> {
    // Giả lập upload avatar
    const avatarUrl = `assets/images/avatars/user-${userId}.jpg`;
    const profile = this.mockProfiles.find(p => p.userId === userId);
    if (profile) {
      profile.avatarUrl = avatarUrl;
    }
    return of(avatarUrl);
    // Trong API thực tế, sẽ cần sử dụng FormData để upload file
    // const formData = new FormData();
    // formData.append('avatar', file);
    // return this.apiBaseService.post<{avatarUrl: string}>(`${this.endpoint}/${userId}/avatar`, formData)
    //   .pipe(map(response => response.avatarUrl));
  }
}