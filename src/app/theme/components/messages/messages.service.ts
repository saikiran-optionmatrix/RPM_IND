import { Injectable } from '@angular/core';

export interface AppNotification {
  title: string;
  date: string;
  details: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private readonly notifications: AppNotification[] = [
    { title: 'GMP Process Audit', date: '06/07/2026', details: 'API Synthesis & Crystallization Suite' },
    { title: 'Supplier Quality Audit', date: '01/07/2026', details: 'Primary Packaging - Type I Glass Vials' },
    { title: 'Cleanroom Environmental Audit', date: '05/07/2026', details: 'Aseptic Filling Line 2 (Grade A/B)' },
    { title: 'Analytical Lab Audit', date: '03/07/2026', details: 'QC Laboratory - HPLC & Dissolution Testing' },
    { title: 'Data Integrity Audit', date: '02/07/2026', details: 'LIMS & Chromeleon CDS Electronic Records' }
  ];

  public getNotifications(): AppNotification[] {
    return this.notifications;
  }
}
