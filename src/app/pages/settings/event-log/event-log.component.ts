import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface EventLogItem {
  id?: number;
  eventName: string;
  eventType: string;
  module: string;
  dateTime: string;
  userName: string;
  userRole: string;
  ipAddress: string;
}

@Component({
  selector: 'app-event-log',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './event-log.component.html',
  styleUrl: './event-log.component.scss',
})
export class EventLogComponent {
  eventLogs: EventLogItem[] = [
    {
      eventName: 'Escalation Matrix : Viewed Records',
      eventType: 'Create',
      module: 'Admin',
      dateTime: '20/03/2022, 6:30 A:M',
      userName: 'Satya',
      userRole: 'Admin',
      ipAddress: '192.168.0.115',
    },
    {
      eventName: 'Viewed Roles Screen',
      eventType: 'Update',
      module: 'Admin',
      dateTime: '12/03/2022, 4:00 A:M',
      userName: 'Surya',
      userRole: 'Manager',
      ipAddress: '192.168.0.115',
    },
    {
      eventName: 'Viewed Users Screen',
      eventType: 'Delete',
      module: 'Admin',
      dateTime: '24/03/2022, 2:30 A:M',
      userName: 'Sagar',
      userRole: 'Admin',
      ipAddress: '192.168.0.222',
    },
    {
      eventName: 'Dashboard : Viewed the screen',
      eventType: 'Create',
      module: 'Admin',
      dateTime: '30/03/2022, 3:00 A:M',
      userName: 'Sai',
      userRole: 'Admin',
      ipAddress: '192.168.0.115',
    },
    {
      eventName: 'Viewed Roles Screen',
      eventType: 'Delete',
      module: 'Admin',
      dateTime: '10/03/2022, 7:10 A:M',
      userName: 'Mohan',
      userRole: 'Admin',
      ipAddress: '192.168.0.115',
    },
  ];

  pageIndex = 0;
  pageSize = 10;

  get paginatedEventLogs(): EventLogItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.eventLogs.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
