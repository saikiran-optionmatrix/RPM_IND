import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  INDUSTRIAL_STAGE_ACTIVITIES_MAP,
  INDUSTRIAL_STAGE_DELIVERABLES_MAP,
  INDUSTRIAL_STAGE_OPTIONS,
} from '../../industrial-stages.data';

export interface PredecessorItem {
  id?: string | number;
  stage: string;
  deliverable?: string;
  activity: string;
  type?: string;
}

@Component({
  selector: 'app-stages-predecessor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './stages-predecessor.component.html',
  styleUrl: './stages-predecessor.component.scss',
})
export class StagesPredecessorComponent implements OnInit {
  pageIndex = 0;
  pageSize = 5;

  taskName: string = '';
  taskSlNo: string = '';

  readonly typeOptions: string[] = [
    'FS - Finish to Start - Finish A to Start B',
    'SF - Start to Finish - B must be started to finish A',
    'SS - Start to Start - A must start before B is started',
    'FF - Finish to Finish - B can be finished only after A is finished'
  ];

  stageOptions: string[] = INDUSTRIAL_STAGE_OPTIONS;
  stageDeliverablesMap: { [key: string]: string[] } = INDUSTRIAL_STAGE_DELIVERABLES_MAP;
  stageActivitiesMap: { [key: string]: string[] } = INDUSTRIAL_STAGE_ACTIVITIES_MAP;
  allActivities: string[] = Object.values(INDUSTRIAL_STAGE_ACTIVITIES_MAP).flat();

  predecessorList: PredecessorItem[] = [
    {
      stage: INDUSTRIAL_STAGE_OPTIONS[0],
      deliverable: INDUSTRIAL_STAGE_DELIVERABLES_MAP[INDUSTRIAL_STAGE_OPTIONS[0]]?.[0] || '',
      activity: '1.11 - Plant throughput & bottleneck assessment',
      type: 'FS - Finish to Start - Finish A to Start B'
    },
    {
      stage: INDUSTRIAL_STAGE_OPTIONS[0],
      deliverable: INDUSTRIAL_STAGE_DELIVERABLES_MAP[INDUSTRIAL_STAGE_OPTIONS[0]]?.[0] || '',
      activity: '1.12 - Existing asset & industrial equipment benchmarking',
      type: 'SS - Start to Start - A must start before B is started'
    }
  ];

  get paginatedPredecessors(): PredecessorItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.predecessorList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialogRef: MatDialogRef<StagesPredecessorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  normalizeType(val?: string): string {
    if (!val) return this.typeOptions[0];
    const cleanVal = val.trim().toLowerCase();
    const found = this.typeOptions.find(t =>
      t.toLowerCase() === cleanVal ||
      t.toLowerCase().startsWith(cleanVal) ||
      cleanVal.startsWith(t.toLowerCase().slice(0, 2))
    );
    return found || this.typeOptions[0];
  }

  normalizeStage(val?: string): string {
    if (!val) return this.stageOptions[0];
    const cleanVal = val.trim().toLowerCase();
    const found = this.stageOptions.find(s =>
      s.toLowerCase() === cleanVal ||
      s.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(s.toLowerCase().split(' - ')[1]?.toLowerCase() || '') ||
      cleanVal.includes(s.toLowerCase().split(' - ')[0]?.toLowerCase() || '')
    );
    return found || this.stageOptions[0];
  }

  normalizeDeliverable(stage: string, val?: string): string {
    if (!val) return '';
    const cleanVal = val.trim().toLowerCase();
    const list = this.getDeliverablesForStage(stage);
    const found = list.find(d =>
      d.toLowerCase() === cleanVal ||
      d.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(d.toLowerCase().split(' - ')[1]?.toLowerCase() || '')
    );
    return found || val;
  }

  normalizeActivity(stage: string, del: string, val?: string): string {
    if (!val) return '';
    const cleanVal = val.trim().toLowerCase();
    const list = this.getActivitiesFor(stage, del);
    const found = list.find(a =>
      a.toLowerCase() === cleanVal ||
      a.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(a.toLowerCase().split(' - ')[1]?.toLowerCase() || '')
    );
    return found || val;
  }

  ngOnInit(): void {
    if (this.data?.row) {
      this.taskName = this.data.row.task || '';
      this.taskSlNo = this.data.row.slNo || '';

      if (this.data.row.predecessorsData && Array.isArray(this.data.row.predecessorsData) && this.data.row.predecessorsData.length > 0) {
        this.predecessorList = this.data.row.predecessorsData.map((p: any) => {
          const stage = this.normalizeStage(p.stage);
          const deliverable = this.normalizeDeliverable(stage, p.deliverable);
          const activity = this.normalizeActivity(stage, deliverable, p.activity);
          const type = this.normalizeType(p.type);
          return { ...p, stage, deliverable, activity, type };
        });
      }
    }
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getDeliverablesForStage(stage: string): string[] {
    if (!stage) return Object.values(this.stageDeliverablesMap).flat();
    if (this.stageDeliverablesMap[stage]) return this.stageDeliverablesMap[stage];
    const matchedKey = Object.keys(this.stageDeliverablesMap).find(k =>
      k.toLowerCase().includes(stage.toLowerCase()) || stage.toLowerCase().includes(k.toLowerCase())
    );
    return (matchedKey && this.stageDeliverablesMap[matchedKey]) || Object.values(this.stageDeliverablesMap).flat();
  }

  getActivitiesFor(stage: string, deliverable?: string): string[] {
    if (deliverable && this.stageActivitiesMap[deliverable]) return this.stageActivitiesMap[deliverable];
    if (deliverable) {
      const matchedDel = Object.keys(this.stageActivitiesMap).find(k =>
        k.toLowerCase().includes(deliverable.toLowerCase()) || deliverable.toLowerCase().includes(k.toLowerCase())
      );
      if (matchedDel && this.stageActivitiesMap[matchedDel]) return this.stageActivitiesMap[matchedDel];
    }
    if (stage) {
      const deliverables = this.getDeliverablesForStage(stage);
      const acts: string[] = [];
      deliverables.forEach(d => {
        if (this.stageActivitiesMap[d]) acts.push(...this.stageActivitiesMap[d]);
      });
      if (acts.length > 0) return acts;
    }
    return this.allActivities;
  }

  onStageChange(row: PredecessorItem): void {
    const availableDeliverables = this.getDeliverablesForStage(row.stage);
    if (row.deliverable && !availableDeliverables.includes(row.deliverable)) {
      row.deliverable = '';
    }
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (row.activity && !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '';
    }
  }

  onDeliverableChange(row: PredecessorItem): void {
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (row.activity && !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '';
    }
  }

  addRow(): void {
    const newRow: PredecessorItem = {
      stage: this.stageOptions[0] || 'S1 - Business Need & Opportunity Assessment',
      deliverable: '',
      activity: '',
      type: this.typeOptions[0]
    };
    this.pageIndex = 0;
    this.predecessorList.unshift(newRow);
  }

  deleteRow(row: PredecessorItem): void {
    const index = this.predecessorList.indexOf(row);
    if (index > -1) {
      this.predecessorList.splice(index, 1);
      if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.predecessorList.length) {
        this.pageIndex = Math.max(0, this.pageIndex - 1);
      }
    }
  }

  save(): void {
    this.dialogRef.close({
      predecessors: this.predecessorList,
      count: this.predecessorList.length,
      predecessor: this.predecessorList.length > 0 ? String(this.predecessorList.length + 3) : '—'
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
