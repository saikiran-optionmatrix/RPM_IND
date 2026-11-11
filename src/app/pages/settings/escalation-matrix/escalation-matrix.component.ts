import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface EscalationItem {
  id: string;
  escalation: string;
  description: string;
  currentValue: string;
  revisedValue: string;
}

@Component({
  selector: 'app-escalation-matrix',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './escalation-matrix.component.html',
  styleUrl: './escalation-matrix.component.scss',
})
export class EscalationMatrixComponent {
  escalationList: EscalationItem[] = [
    {
      id: 'urgent',
      escalation: 'Urgent',
      description: 'Remaining days before due date when a referral gets flagged.',
      currentValue: '0',
      revisedValue: '',
    },
    {
      id: 'overdue',
      escalation: 'Overdue',
      description: 'Overdue period after which the referral is flagged as overdue.',
      currentValue: '1',
      revisedValue: '',
    },
    {
      id: 'escalate',
      escalation: 'Escalate',
      description: 'Overdue period after which the referral is flagged as escalated.',
      currentValue: '5',
      revisedValue: '',
    },
  ];

  save(item: EscalationItem): void {
    if (!item.revisedValue || !item.revisedValue.trim()) {
      alert(`Please enter a revised value for "${item.escalation}".`);
      return;
    }

    item.currentValue = item.revisedValue.trim();
    alert(`"${item.escalation}" revised value updated successfully to "${item.currentValue}"!`);
    item.revisedValue = '';
  }
}
