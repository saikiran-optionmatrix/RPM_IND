import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface PreferenceItem {
  id: string;
  subject: string;
  description: string;
  previousValue: string;
  newValue: string;
  type: 'select' | 'text' | 'email';
  options?: number[] | string[];
  placeholder?: string;
}

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss',
})
export class PreferencesComponent {
  preferences: PreferenceItem[] = [
    {
      id: 'grid_length',
      subject: 'Grid Length',
      description: 'Default Grid Length',
      previousValue: '10',
      newValue: '',
      type: 'select',
      options: [5, 10, 20, 50, 100],
      placeholder: 'Select Grid Length',
    },
    {
      id: 'notification_email',
      subject: 'Notification Email',
      description: 'Default Admin Notification Email',
      previousValue: 'mg@optionmatrix.com',
      newValue: '',
      type: 'email',
      placeholder: 'Enter Notification Email',
    },
    {
      id: 'director_email',
      subject: 'Email of the Director',
      description: 'Email Address of the Director',
      previousValue: 'abc@mgmotor.com',
      newValue: '',
      type: 'email',
      placeholder: 'Enter Director Email',
    },
    {
      id: 'audit_approval',
      subject: 'Audit Approval',
      description: 'Manager will approve the Audit',
      previousValue: 'Auditor',
      newValue: '',
      type: 'text',
      placeholder: 'Enter Manager Name',
    },
  ];

  savePreference(item: PreferenceItem): void {
    if (!item.newValue || !item.newValue.toString().trim()) {
      alert(`Please provide a new value for "${item.subject}".`);
      return;
    }

    item.previousValue = item.newValue.toString();
    alert(`"${item.subject}" updated successfully to "${item.newValue}"!`);
    item.newValue = '';
  }


  
}
