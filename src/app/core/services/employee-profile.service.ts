// src/app/core/services/employee-profile.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { EmployeeProfile } from '../models/employee-profile';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  private endpoint = 'profiles';
  private apiUrl = environment.apiUrl;

  constructor(
    private apiBaseService: ApiBaseService,
    private http: HttpClient
  ) { }

  private mapProfileFromApi(apiProfile: any): EmployeeProfile {
    return {
      id: apiProfile.profile_id,
      userId: apiProfile.user_id,
      dateOfBirth: new Date(apiProfile.date_of_birth),
      address: apiProfile.address,
      experience: apiProfile.experience,
      skills: apiProfile.skills,
      avatarUrl: apiProfile.avatar_url,
      updatedAt: new Date(apiProfile.updated_at)
    };
  }

  getProfiles(): Observable<EmployeeProfile[]> {
    return this.apiBaseService.get<any[]>(this.endpoint)
      .pipe(
        map((profiles: any[]) => profiles.map(profile => this.mapProfileFromApi(profile)))
      );
  }

  getProfileByUserId(userId: number): Observable<EmployeeProfile> {
    return this.apiBaseService.get<any>(`${this.endpoint}/user/${userId}`)
      .pipe(
        map(profile => this.mapProfileFromApi(profile))
      );
  }

  createProfile(profile: Omit<EmployeeProfile, 'id' | 'updatedAt'>): Observable<EmployeeProfile> {
    const apiProfile = {
      user_id: profile.userId,
      date_of_birth: profile.dateOfBirth,
      address: profile.address,
      experience: profile.experience,
      skills: profile.skills,
      avatar_url: profile.avatarUrl
    };
    
    return this.apiBaseService.post<any>(this.endpoint, apiProfile)
      .pipe(
        map(response => this.mapProfileFromApi(response))
      );
  }

  updateProfile(id: number, profile: Partial<EmployeeProfile>): Observable<EmployeeProfile> {
    const apiProfile: any = {};
    if (profile.dateOfBirth) apiProfile.date_of_birth = profile.dateOfBirth;
    if (profile.address) apiProfile.address = profile.address;
    if (profile.experience !== undefined) apiProfile.experience = profile.experience;
    if (profile.skills !== undefined) apiProfile.skills = profile.skills;
    if (profile.avatarUrl) apiProfile.avatar_url = profile.avatarUrl;
    
    return this.apiBaseService.put<any>(`${this.endpoint}/${id}`, id, apiProfile)
      .pipe(
        map(response => this.mapProfileFromApi(response))
      );
  }

  uploadAvatar(userId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<{avatarUrl: string}>(`${this.apiUrl}/${this.endpoint}/user/${userId}/avatar`, formData, { headers })
      .pipe(
        map(response => response.avatarUrl)
      );
  }
}