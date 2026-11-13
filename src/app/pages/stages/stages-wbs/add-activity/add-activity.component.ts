import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  INDUSTRIAL_STAGE_ACTIVITIES_MAP,
  INDUSTRIAL_STAGE_DELIVERABLES_MAP,
  INDUSTRIAL_STAGE_DEPARTMENTS,
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
  selector: 'app-add-activity',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './add-activity.component.html',
  styleUrl: './add-activity.component.scss'
})
export class AddActivityComponent implements OnInit, AfterViewInit {
  activeTab: 'activity' | 'predecessor' = 'activity';

  activityForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  deliverables: string[] = [];
  uploadedFileNames: string[] = [];

  departmentOptions: string[] = [...INDUSTRIAL_STAGE_DEPARTMENTS];

  predecessorPageIndex = 0;
  predecessorPageSize = 5;

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
    const startIndex = this.predecessorPageIndex * this.predecessorPageSize;
    return this.predecessorList.slice(startIndex, startIndex + this.predecessorPageSize);
  }

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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.deliverables = this.data?.deliverables || [
      'Plant needs and capacity opportunity assessment',
      'Program economics and CapEx feasibility assessment',
      'Business case approval package',
      'Operational requirements and functional specification',
      'Equipment architecture and plant layout concepts'
    ];

    if (this.data?.departments && Array.isArray(this.data.departments) && this.data.departments.length > 0) {
      this.departmentOptions = [...this.data.departments];
    }
    if (this.data?.department && !this.departmentOptions.includes(this.data.department)) {
      this.departmentOptions.unshift(this.data.department);
    }

    const initialDeliverable = this.data?.deliverable || (this.deliverables.length > 0 ? this.deliverables[0] : '');

    this.activityForm = this.fb.group({
      stage: [this.data?.stage || 'Business Need & Opportunity Assessment', [Validators.required]],
      deliverable: [initialDeliverable, [Validators.required]],
      activityName: ['', [Validators.required]],
      activityCode: [''],
      department: [this.data?.department || (this.departmentOptions[0] || 'Engineering & R&D')],
      applicability: ['All Programs'],
      description: [''],
      planDuration: [''],
      planEffort: [''],
      materialBudget: [''],
      predecessor: ['']
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      if (this.data.department && !this.departmentOptions.includes(this.data.department)) {
        this.departmentOptions.unshift(this.data.department);
      }
      this.activityForm.patchValue({
        stage: this.data.stage ?? 'Business Need & Opportunity Assessment',
        deliverable: this.data.deliverable ?? (this.deliverables[0] || ''),
        activityName: this.data.activityName ?? this.data.task ?? '',
        activityCode: this.data.activityCode ?? this.data.taskCode ?? '',
        department: this.data.department ?? (this.departmentOptions[0] || 'Engineering & R&D'),
        applicability: this.data.applicability ?? 'All Programs',
        description: this.data.description ?? '',
        planDuration: this.data.planDuration ?? this.data.duration ?? '',
        planEffort: this.data.planEffort ?? this.data.effort ?? '',
        materialBudget: this.data.materialBudget ?? this.data.cost ?? '',
        predecessor: this.data.predecessor ?? ''
      });

      const rawPreds = this.data.predecessorsData || this.data.predecessors;
      if (rawPreds && Array.isArray(rawPreds) && rawPreds.length > 0) {
        this.predecessorList = rawPreds.map((p: any) => {
          const stage = this.normalizeStage(p.stage);
          const deliverable = this.normalizeDeliverable(stage, p.deliverable);
          const activity = this.normalizeActivity(stage, deliverable, p.activity);
          const type = this.normalizeType(p.type);
          return { ...p, stage, deliverable, activity, type };
        });
      }
    }
  }

  ngAfterViewInit(): void {
    this.resetScroll();
  }

  private resetScroll(): void {
    setTimeout(() => {
      const dialogContent = document.querySelector('.mat-mdc-dialog-content');
      if (dialogContent) {
        dialogContent.scrollTop = 0;
      }
    }, 0);
  }

  setActiveTab(tab: 'activity' | 'predecessor'): void {
    this.activeTab = tab;
    this.resetScroll();
  }

  prevTab(): void {
    if (this.activeTab === 'predecessor') {
      this.activeTab = 'activity';
    }
  }

  nextTab(): void {
    if (this.activeTab === 'activity') {
      this.activeTab = 'predecessor';
    }
  }

  handlePredecessorPage(event: PageEvent): void {
    this.predecessorPageIndex = event.pageIndex;
    this.predecessorPageSize = event.pageSize;
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

  onPredecessorStageChange(row: PredecessorItem): void {
    const availableDeliverables = this.getDeliverablesForStage(row.stage);
    if (row.deliverable && !availableDeliverables.includes(row.deliverable)) {
      row.deliverable = '';
    }
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (row.activity && !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '';
    }
  }

  onPredecessorDeliverableChange(row: PredecessorItem): void {
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (row.activity && !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '';
    }
  }

  addPredecessorRow(): void {
    const currentStage = this.activityForm.get('stage')?.value;
    const stage = this.normalizeStage(currentStage);
    const newRow: PredecessorItem = {
      stage,
      deliverable: '',
      activity: '',
      type: this.typeOptions[0]
    };
    this.predecessorPageIndex = 0;
    this.predecessorList.unshift(newRow);
  }

  deletePredecessorRow(row: PredecessorItem): void {
    const index = this.predecessorList.indexOf(row);
    if (index > -1) {
      this.predecessorList.splice(index, 1);
      if (this.predecessorPageIndex > 0 && this.predecessorPageIndex * this.predecessorPageSize >= this.predecessorList.length) {
        this.predecessorPageIndex = Math.max(0, this.predecessorPageIndex - 1);
      }
    }
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.uploadedFileNames.push(files[i].name);
      }
    }
  }

  save(): void {
    this.isSubmitting = true;
    if (this.activityForm.invalid) {
      this.activeTab = 'activity';
      return;
    }
    const result = {
      ...this.data,
      ...this.activityForm.value,
      files: this.uploadedFileNames,
      predecessors: this.predecessorList,
      predecessorsData: this.predecessorList,
      predecessor: this.predecessorList.length > 0
        ? String(this.predecessorList.length + 3)
        : (this.activityForm.get('predecessor')?.value || '—')
    };
    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
