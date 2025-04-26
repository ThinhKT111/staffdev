// Mở file src/app/app.component.ts và thêm thuộc tính title:
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { AuthService } from './core/services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    LayoutComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  title = 'staffdev'; // Thêm dòng này
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
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
  
  // Thêm phương thức này
  setupNotifications(): void {
    this.notificationService.onNewNotification(notification => {
      // Hiển thị thông báo, ví dụ thông qua MatSnackBar
      // Hoặc cập nhật số lượng thông báo chưa đọc
      console.log('Thông báo mới:', notification);
    });
  }
  
  // Thêm phương thức này
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.notificationService.disconnectFromSocket();
  }
}