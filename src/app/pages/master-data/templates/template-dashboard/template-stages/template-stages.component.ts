import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

export interface StageItem {
  stageCode: string;
  name: string;
  planEffort: string;
  planDuration: string;
  actualEffort?: string;
  actualDuration?: string;
  percentCompletion?: number;
  done?: boolean;
  description: string;
  planStart: string;
  planEnd: string;
  actualStart: string;
  actualEnd: string;
  eta: string;
  buffer: string;
  gateName: string;
  gateStatus: 'Approved' | 'Pending' | 'Rejected';
  gateCode: string;
  status: boolean;
  setupCount: number;
}

@Component({
  selector: 'app-template-stages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
  ],
  templateUrl: './template-stages.component.html',
  styleUrl: './template-stages.component.scss',
})
export class TemplateStagesComponent implements OnInit, OnDestroy {
  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Oral Solid Dosage (OSD) Formulation & Commercialization';

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  stages: StageItem[] = [
    {
      stageCode: 'S1',
      name: 'Opportunity and Portfolio Assessment',
      planEffort: '80 hrs',
      planDuration: '10 days',
      actualEffort: '80 hrs',
      actualDuration: '10 days',
      percentCompletion: 0,
      done: false,
      description: 'Coordinate the pharmaceutical product development work for opportunity and portfolio assessment. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.',
      planStart: '2026-01-05',
      planEnd: '2026-01-15',
      actualStart: '2026-01-05',
      actualEnd: '2026-01-15',
      eta: '2026-01-15',
      buffer: '2 days',
      gateName: 'Opportunity and portfolio approval',
      gateStatus: 'Approved',
      gateCode: 'Gate 1',
      status: true,
      setupCount: 8,
    },
    {
      stageCode: 'S2',
      name: 'Product Definition and Project Charter',
      planEffort: '60 hrs',
      planDuration: '10 days',
      actualEffort: '60 hrs',
      actualDuration: '10 days',
      percentCompletion: 0,
      done: false,
      description: 'Coordinate the pharmaceutical product development work for product definition and project charter. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.',
      planStart: '2026-01-16',
      planEnd: '2026-01-25',
      actualStart: '2026-01-16',
      actualEnd: '2026-01-25',
      eta: '2026-01-25',
      buffer: '2 days',
      gateName: 'Product definition and project charter approval',
      gateStatus: 'Approved',
      gateCode: 'Gate 2',
      status: true,
      setupCount: 17,
    },
    {
      stageCode: 'S3',
      name: 'Formulation and Product Concept Development',
      planEffort: '120 hrs',
      planDuration: '60 days',
      actualEffort: '120 hrs',
      actualDuration: '60 days',
      percentCompletion: 0,
      done: false,
      description: 'Coordinate the pharmaceutical product development work for formulation and product concept development. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.',
      planStart: '2026-01-26',
      planEnd: '2026-03-27',
      actualStart: '2026-01-26',
      actualEnd: '2026-03-27',
      eta: '2026-03-27',
      buffer: '5 days',
      gateName: 'Formulation concept and sourcing strategy approval',
      gateStatus: 'Approved',
      gateCode: 'Gate 3',
      status: true,
      setupCount: 17,
    },
    {
      stageCode: 'S4',
      name: 'API, Excipient and Supplier Sourcing',
      planEffort: '160 hrs',
      planDuration: '48 days',
      actualEffort: '160 hrs',
      actualDuration: '48 days',
      percentCompletion: 0,
      done: false,
      description: 'Coordinate the pharmaceutical product development work for api, excipient and supplier sourcing. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.',
      planStart: '2026-03-28',
      planEnd: '2026-05-15',
      actualStart: '2026-03-28',
      actualEnd: '2026-05-15',
      eta: '2026-05-15',
      buffer: '4 days',
      gateName: 'Formulation and process development approval',
      gateStatus: 'Approved',
      gateCode: 'Gate 4',
      status: true,
      setupCount: 7,
    },
    {
      stageCode: 'S5',
      name: 'Formulation and Process Development',
      planEffort: '240 hrs',
      planDuration: '76 days',
      actualEffort: '240 hrs',
      actualDuration: '76 days',
      percentCompletion: 0,
      done: false,
      description: 'Coordinate the pharmaceutical product development work for formulation and process development. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.',
      planStart: '2026-05-16',
      planEnd: '2026-07-31',
      actualStart: '2026-05-16',
      actualEnd: '2026-07-31',
      eta: '2026-07-31',
      buffer: '5 days',
      gateName: '-',
      gateStatus: 'Approved',
      gateCode: '-',
      status: true,
      setupCount: 26,
    },
    {
      stageCode: 'S6',
      name: 'Development Batches and Verification',
      planEffort: '180 hrs',
      planDuration: '60 days',
      actualEffort: '180 hrs',
      actualDuration: '60 days',
      percentCompletion: 0,
      done: false,
      description: 'Coordinate the pharmaceutical product development work for development batches and verification. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.',
      planStart: '2026-08-01',
      planEnd: '2026-09-30',
      actualStart: '2026-08-01',
      actualEnd: '2026-09-30',
      eta: '2026-09-30',
      buffer: '4 days',
      gateName: '-',
      gateStatus: 'Approved',
      gateCode: '-',
      status: true,
      setupCount: 13,
    },
    {
      stageCode: 'S7',
      name: 'Facility, Equipment and Process Readiness',
      planEffort: '120 hrs',
      planDuration: '30 days',
      actualEffort: '120 hrs',
      actualDuration: '30 days',
      percentCompletion: 0,
      done: false,
      description: 'Coordinate the pharmaceutical product development work for facility, equipment and process readiness. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.',
      planStart: '2026-10-01',
      planEnd: '2026-10-31',
      actualStart: '2026-10-01',
      actualEnd: '2026-10-31',
      eta: '2026-10-31',
      buffer: '3 days',
      gateName: 'Facility and manufacturing readiness approval',
      gateStatus: 'Approved',
      gateCode: 'Gate 5',
      status: true,
      setupCount: 12,
    },
    {
      stageCode: 'S8',
      name: 'Analytical Validation and Technology Transfer',
      planEffort: '140 hrs',
      planDuration: '45 days',
      actualEffort: '140 hrs',
      actualDuration: '45 days',
      percentCompletion: 0,
      done: false,
      description: 'Coordinate the pharmaceutical product development work for analytical validation and technology transfer. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.',
      planStart: '2026-11-01',
      planEnd: '2026-12-15',
      actualStart: '2026-11-01',
      actualEnd: '2026-12-15',
      eta: '2026-12-15',
      buffer: '4 days',
      gateName: '-',
      gateStatus: 'Approved',
      gateCode: '-',
      status: true,
      setupCount: 8,
    },
    {
      stageCode: 'S9',
      name: 'Registration and Process Validation Batches',
      planEffort: '190 hrs',
      planDuration: '61 days',
      actualEffort: '190 hrs',
      actualDuration: '61 days',
      percentCompletion: 0,
      done: false,
      description: 'Coordinate the pharmaceutical product development work for registration and process validation batches. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.',
      planStart: '2026-12-16',
      planEnd: '2027-02-15',
      actualStart: '2026-12-16',
      actualEnd: '2027-02-15',
      eta: '2027-02-15',
      buffer: '5 days',
      gateName: 'Validation and regulatory submission readiness',
      gateStatus: 'Approved',
      gateCode: 'Gate 6',
      status: true,
      setupCount: 11,
    },
    {
      stageCode: 'S10',
      name: 'Regulatory Submission and Approval',
      planEffort: '200 hrs',
      planDuration: '104 days',
      actualEffort: '200 hrs',
      actualDuration: '104 days',
      percentCompletion: 0,
      done: false,
      description: 'Coordinate the pharmaceutical product development work for regulatory submission and approval. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.',
      planStart: '2027-02-16',
      planEnd: '2027-05-31',
      actualStart: '2027-02-16',
      actualEnd: '2027-05-31',
      eta: '2027-05-31',
      buffer: '6 days',
      gateName: '-',
      gateStatus: 'Approved',
      gateCode: '-',
      status: true,
      setupCount: 9,
    },
    {
      stageCode: 'S11',
      name: 'Commercial Launch and Lifecycle Management',
      planEffort: '150 hrs',
      planDuration: '91 days',
      actualEffort: '150 hrs',
      actualDuration: '91 days',
      percentCompletion: 0,
      done: false,
      description: 'Coordinate the pharmaceutical product development work for commercial launch and lifecycle management. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.',
      planStart: '2027-06-01',
      planEnd: '2027-08-31',
      actualStart: '2027-06-01',
      actualEnd: '2027-08-31',
      eta: '2027-08-31',
      buffer: '4 days',
      gateName: 'Commercial launch authorization',
      gateStatus: 'Approved',
      gateCode: 'Gate 7',
      status: true,
      setupCount: 10,
    }
  ];

  // Stage table pagination
  pagedStagesList: StageItem[] = [];
  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 0;

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  private subs = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
  ) {}

  ngOnInit(): void {
    const sub = this.route.queryParams.subscribe((params) => {
      const templateName = params['templateName'] || params['projectName'] || params['name'];
      if (templateName) {
        this.projectName = templateName;
      }
    });
    this.subs.add(sub);

    this.updatePagedStages();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.setBodyScrollLock(false);
  }

  goBack(): void {
    this.router.navigate(['/master-data/templates']);
  }

  // Scrolling logic
  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  // Pagination
  updatePagedStages() {
    const start = this.currentPage * this.pageSize;
    this.pagedStagesList = this.stages.slice(start, start + this.pageSize);
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedStages();
  }

  get pagedStages(): StageItem[] {
    return this.pagedStagesList;
  }

  toggleStatus(item: StageItem): void {
    item.status = !item.status;
  }

  getSliderColor(percent: number): string {
    if (percent === 100) return '#008000';
    if (!percent || percent === 0) return '#ff0000';
    if (percent <= 30) return '#ff0000';
    if (percent <= 80) return '#ffb300';
    return '#008000';
  }

  onDoneChange(s: StageItem, checked: boolean): void {
    s.done = checked;
    s.percentCompletion = checked ? 100 : 0;
  }

  openTimelineModal(item: any) {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal() {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  openSetup(item: StageItem) {
    this.router.navigate(['stages/wbs'], {
      relativeTo: this.route.parent,
      queryParams: {
        stageCode: item.stageCode,
        stageName: item.name,
        projectName: this.projectName,
      },
      queryParamsHandling: 'merge',
    });
  }

  private setBodyScrollLock(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }
}
