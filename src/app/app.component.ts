import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';

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

  ngOnInit(): void {
    // Tạm thời set isLoggedIn = true để xem layout
    this.isLoggedIn = true;
    
    // Sau này sẽ dùng AuthService
    // this.authService.isLoggedIn$.subscribe(status => {
    //   this.isLoggedIn = status;
    // });
  }
}