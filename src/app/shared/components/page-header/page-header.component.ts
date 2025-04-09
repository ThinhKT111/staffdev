import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Breadcrumb {
  label: string;
  link: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
  @Input() pageTitle = 'Dashboard';
  @Input() breadcrumbs: Breadcrumb[] = [
    { label: 'Home', link: '/dashboard' },
    { label: 'Dashboard', link: '' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}