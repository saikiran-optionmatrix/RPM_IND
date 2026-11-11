import { Component, OnInit, ViewEncapsulation, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MessagesService } from './messages.service';

// Strict typing for the notification model
export interface AppNotification {
  title: string;
  date: string;
  details: string;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    NgScrollbarModule
  ],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessagesComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  // Modern Dependency Injection
  private readonly messagesService = inject(MessagesService);
  private readonly router = inject(Router);

  public notifications: AppNotification[] = [];

  ngOnInit(): void {
    // Only fetching notifications now since tabs are gone
    this.notifications = this.messagesService.getNotifications();
  }

  openMessagesMenu(): void {
    if (this.trigger) {
      this.trigger.openMenu();
    }
  }

  onMouseLeave(): void {
    if (this.trigger) {
      this.trigger.closeMenu();
    }
  }

  viewAllNotifications(): void {
    this.onMouseLeave();
    this.router.navigate(['/app/test-activity']);
  }

  stopClickPropagate(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }
}
