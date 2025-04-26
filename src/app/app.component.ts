// src/app/app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { AuthService } from './core/services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationService } from './core/services/notification.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    LayoutComponent,
    MatSnackBarModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  title = 'staffdev';
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      
      // Kết nối socket cho thông báo thời gian thực nếu đã đăng nhập
      if (user) {
        this.notificationService.connectToSocket(user.id);
        this.setupNotifications();
      }
    });
  }
  
  setupNotifications(): void {
    this.notificationService.onNewNotification(notification => {
      // Hiển thị thông báo
      this.snackBar.open(`${notification.title}: ${notification.content}`, 'Đóng', { 
        duration: 5000 
      });
    });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.notificationService.disconnectFromSocket();
  }
}