import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { AddDeliverableComponent } from './add-deliverable/add-deliverable.component';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { AssignRequirementsComponent } from './assign-requirements/assign-requirements.component';
import { AssignTasksComponent } from './assign-tasks/assign-tasks.component';
import { StagesPredecessorComponent } from './stages-predecessor/stages-predecessor.component';
import { DescriptionDialogComponent } from '../../../common/shared/description-dialog/description-dialog.component';

export interface WbsTask {
  deliverableSlNo: string;
  slNo: string;
  task: string;
  predecessor: string;
  department?: string;
  applicability: string;
  taskCode: string;
  jobCode: string;
  activityCode?: string;
  effort: string;
  duration: string;
  description: string;
  procedure: string;
  planned: string;
  assignedTo: string;
  assigned: string;
  actual: string;
  cost: string;
  worked: string;
  remaining: string;
  scheduled: string;
  date: string;
  status: string;
  submitted: string;
  requirements?: string;
  tasks?: string;
  requirementsData?: any[];
  tasksData?: any[];
  predecessorsData?: any[];
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

export interface SidebarMenu {
  slNo?: string;
  name: string;
  description?: string;
  count: number;
  isOpen: boolean;
  subItems?: string[];
}

export interface StageWbsConfig {
  sidebarMenus: SidebarMenu[];
  modulesData: WbsTask[][];
}

@Component({
  selector: 'app-stages-wbs',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DragDropModule
  ],
  templateUrl: './stages-wbs.component.html',
  styleUrls: ['./stages-wbs.component.scss']
})
export class StagesWbsComponent implements OnInit {
  // Modern Dependency Injection
  private readonly dialog = inject(MatDialog);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  // @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  // View State
  stageCode: string = 'S1';
  stageName: string = 'Opportunity and Portfolio Assessment';
  gateCode: string = 'Gate 1';

  sidebarMenus: SidebarMenu[] = [];
  modulesData: WbsTask[][] = [];
  selectedMenuIndex: number = 0;

  tableData: WbsTask[] = [];
  paginatedData: WbsTask[] = [];

  // Pagination properties
  totalItems: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;

  private stageWbsMap: { [key: string]: StageWbsConfig } = {
  "S1": {
    "sidebarMenus": [
      {
        "slNo": "1.1",
        "name": "Market and therapeutic opportunity assessment",
        "description": "Compile and obtain cross-functional approval of the market and therapeutic opportunity assessment deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 4,
        "isOpen": true
      },
      {
        "slNo": "1.2",
        "name": "Program economics and feasibility assessment",
        "description": "Compile and obtain cross-functional approval of the program economics and feasibility assessment deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 3,
        "isOpen": false
      },
      {
        "slNo": "1.3",
        "name": "Concept and portfolio approval package",
        "description": "Compile and obtain cross-functional approval of the concept and portfolio approval package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 1,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "1.1",
          "slNo": "1.1.1",
          "task": "Market and therapeutic-area assessment",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "TC-111",
          "jobCode": "JOB-111",
          "department": "Product Strategy / Commercial",
          "effort": "0",
          "duration": "0",
          "description": "Complete market and therapeutic-area assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Product Strategy / Commercial specialists; Cross-functional review; Documented SOP",
          "planned": "515207",
          "assignedTo": "Product Strategy",
          "assigned": "515207",
          "actual": "515207",
          "cost": "515207",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "1.1",
          "slNo": "1.1.2",
          "task": "Unmet medical need and target product profile research",
          "predecessor": "1.1.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-112",
          "jobCode": "JOB-112",
          "department": "Clinical & Medical Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete unmet medical need and target product profile research by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Clinical & Medical Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "515344",
          "assignedTo": "Clinical & Medical Affairs",
          "assigned": "515344",
          "actual": "515344",
          "cost": "515344",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "1.1",
          "slNo": "1.1.3",
          "task": "Competitor and reference product benchmarking",
          "predecessor": "1.1.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-113",
          "jobCode": "JOB-113",
          "department": "Product Strategy / Commercial",
          "effort": "0",
          "duration": "0",
          "description": "Complete competitor and reference product benchmarking by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Product Strategy / Commercial specialists; Cross-functional review; Documented SOP",
          "planned": "515481",
          "assignedTo": "Product Strategy",
          "assigned": "515481",
          "actual": "515481",
          "cost": "515481",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "1.1",
          "slNo": "1.1.4",
          "task": "Target markets and regulatory pathway shortlist",
          "predecessor": "1.1.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-114",
          "jobCode": "JOB-114",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete target markets and regulatory pathway shortlist by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "515618",
          "assignedTo": "Regulatory Affairs",
          "assigned": "515618",
          "actual": "515618",
          "cost": "515618",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "1.2",
          "slNo": "1.2.1",
          "task": "Patient population and demand forecast",
          "predecessor": "1.1.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-121",
          "jobCode": "JOB-121",
          "department": "Product Strategy / Commercial",
          "effort": "0",
          "duration": "0",
          "description": "Complete patient population and demand forecast by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Product Strategy / Commercial specialists; Cross-functional review; Documented SOP",
          "planned": "516577",
          "assignedTo": "Product Strategy",
          "assigned": "516577",
          "actual": "516577",
          "cost": "516577",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "1.2",
          "slNo": "1.2.2",
          "task": "Preliminary pricing and access assessment",
          "predecessor": "1.2.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-122",
          "jobCode": "JOB-122",
          "department": "Product Strategy / Commercial",
          "effort": "0",
          "duration": "0",
          "description": "Complete preliminary pricing and access assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Product Strategy / Commercial specialists; Cross-functional review; Documented SOP",
          "planned": "516714",
          "assignedTo": "Product Strategy",
          "assigned": "516714",
          "actual": "516714",
          "cost": "516714",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "1.2",
          "slNo": "1.2.3",
          "task": "Initial product feasibility and risk screening",
          "predecessor": "1.2.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-123",
          "jobCode": "JOB-123",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete initial product feasibility and risk screening by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "516851",
          "assignedTo": "Formulation R&D",
          "assigned": "516851",
          "actual": "516851",
          "cost": "516851",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "1.3",
          "slNo": "1.3.1",
          "task": "Portfolio committee concept approval",
          "predecessor": "1.2.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-131",
          "jobCode": "JOB-131",
          "department": "Executive / Portfolio Committee",
          "effort": "0",
          "duration": "0",
          "description": "Complete portfolio committee concept approval by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Executive / Portfolio Committee specialists; Cross-functional review; Documented SOP",
          "planned": "517947",
          "assignedTo": "Executive",
          "assigned": "517947",
          "actual": "517947",
          "cost": "517947",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S2": {
    "sidebarMenus": [
      {
        "slNo": "2.1",
        "name": "Product requirements and target profile",
        "description": "Compile and obtain cross-functional approval of the product requirements and target profile deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 5,
        "isOpen": true
      },
      {
        "slNo": "2.2",
        "name": "Regulatory, quality and IP strategy",
        "description": "Compile and obtain cross-functional approval of the regulatory, quality and ip strategy deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 4,
        "isOpen": false
      },
      {
        "slNo": "2.3",
        "name": "Development plan, budget and project charter",
        "description": "Compile and obtain cross-functional approval of the development plan, budget and project charter deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 3,
        "isOpen": false
      },
      {
        "slNo": "2.4",
        "name": "Risk and resource management plan",
        "description": "Compile and obtain cross-functional approval of the risk and resource management plan deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 3,
        "isOpen": false
      },
      {
        "slNo": "2.5",
        "name": "Product development feasibility assessment",
        "description": "Compile and obtain cross-functional approval of the product development feasibility assessment deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 2,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "2.1",
          "slNo": "2.1.1",
          "task": "Target Product Profile (TPP) definition",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "TC-211",
          "jobCode": "JOB-211",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete target product profile (tpp) definition by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "528907",
          "assignedTo": "Formulation R&D",
          "assigned": "528907",
          "actual": "528907",
          "cost": "528907",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.1",
          "slNo": "2.1.2",
          "task": "Quality Target Product Profile (QTPP) definition",
          "predecessor": "2.1.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-212",
          "jobCode": "JOB-212",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete quality target product profile (qtpp) definition by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "529044",
          "assignedTo": "Formulation R&D",
          "assigned": "529044",
          "actual": "529044",
          "cost": "529044",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.1",
          "slNo": "2.1.3",
          "task": "Preliminary Critical Quality Attributes (CQA) identification",
          "predecessor": "2.1.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-213",
          "jobCode": "JOB-213",
          "department": "Quality Assurance",
          "effort": "0",
          "duration": "0",
          "description": "Complete preliminary critical quality attributes (cqa) identification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Quality Assurance specialists; Cross-functional review; Documented SOP",
          "planned": "529181",
          "assignedTo": "Quality Assurance",
          "assigned": "529181",
          "actual": "529181",
          "cost": "529181",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.1",
          "slNo": "2.1.4",
          "task": "Regulatory strategy and submission pathway assessment",
          "predecessor": "2.1.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-214",
          "jobCode": "JOB-214",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete regulatory strategy and submission pathway assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "529318",
          "assignedTo": "Regulatory Affairs",
          "assigned": "529318",
          "actual": "529318",
          "cost": "529318",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.1",
          "slNo": "2.1.5",
          "task": "Intellectual property and freedom-to-operate review",
          "predecessor": "2.1.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-215",
          "jobCode": "JOB-215",
          "department": "Legal / IP",
          "effort": "0",
          "duration": "0",
          "description": "Complete intellectual property and freedom-to-operate review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Legal / IP specialists; Cross-functional review; Documented SOP",
          "planned": "529455",
          "assignedTo": "Legal",
          "assigned": "529455",
          "actual": "529455",
          "cost": "529455",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "2.2",
          "slNo": "2.2.1",
          "task": "Product development strategy and project charter",
          "predecessor": "2.1.5 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-221",
          "jobCode": "JOB-221",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete product development strategy and project charter by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "530277",
          "assignedTo": "Regulatory Affairs",
          "assigned": "530277",
          "actual": "530277",
          "cost": "530277",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.2",
          "slNo": "2.2.2",
          "task": "Development budget and resource estimate",
          "predecessor": "2.2.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-222",
          "jobCode": "JOB-222",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete development budget and resource estimate by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "530414",
          "assignedTo": "Regulatory Affairs",
          "assigned": "530414",
          "actual": "530414",
          "cost": "530414",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.2",
          "slNo": "2.2.3",
          "task": "Integrated project schedule and milestone plan",
          "predecessor": "2.2.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-223",
          "jobCode": "JOB-223",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete integrated project schedule and milestone plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "530551",
          "assignedTo": "Regulatory Affairs",
          "assigned": "530551",
          "actual": "530551",
          "cost": "530551",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.2",
          "slNo": "2.2.4",
          "task": "Cross-functional responsibility matrix",
          "predecessor": "2.2.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-224",
          "jobCode": "JOB-224",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete cross-functional responsibility matrix by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "530688",
          "assignedTo": "Regulatory Affairs",
          "assigned": "530688",
          "actual": "530688",
          "cost": "530688",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "2.3",
          "slNo": "2.3.1",
          "task": "Preliminary risk register and mitigation plan",
          "predecessor": "2.2.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-231",
          "jobCode": "JOB-231",
          "department": "Project Management",
          "effort": "0",
          "duration": "0",
          "description": "Complete preliminary risk register and mitigation plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Project Management specialists; Cross-functional review; Documented SOP",
          "planned": "531647",
          "assignedTo": "Project Management",
          "assigned": "531647",
          "actual": "531647",
          "cost": "531647",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.3",
          "slNo": "2.3.2",
          "task": "Commercial forecast and profitability assessment",
          "predecessor": "2.3.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-232",
          "jobCode": "JOB-232",
          "department": "Product Strategy / Commercial",
          "effort": "0",
          "duration": "0",
          "description": "Complete commercial forecast and profitability assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Product Strategy / Commercial specialists; Cross-functional review; Documented SOP",
          "planned": "531784",
          "assignedTo": "Product Strategy",
          "assigned": "531784",
          "actual": "531784",
          "cost": "531784",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.3",
          "slNo": "2.3.3",
          "task": "Make-or-buy and external partner strategy",
          "predecessor": "2.3.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-233",
          "jobCode": "JOB-233",
          "department": "Project Management",
          "effort": "0",
          "duration": "0",
          "description": "Complete make-or-buy and external partner strategy by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Project Management specialists; Cross-functional review; Documented SOP",
          "planned": "531921",
          "assignedTo": "Project Management",
          "assigned": "531921",
          "actual": "531921",
          "cost": "531921",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "2.4",
          "slNo": "2.4.1",
          "task": "Project charter review and approval",
          "predecessor": "2.3.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-241",
          "jobCode": "JOB-241",
          "department": "Project Management",
          "effort": "0",
          "duration": "0",
          "description": "Complete project charter review and approval by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Project Management specialists; Cross-functional review; Documented SOP",
          "planned": "533017",
          "assignedTo": "Project Management",
          "assigned": "533017",
          "actual": "533017",
          "cost": "533017",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.4",
          "slNo": "2.4.2",
          "task": "Product specification and acceptance criteria draft",
          "predecessor": "2.4.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-242",
          "jobCode": "JOB-242",
          "department": "Project Management",
          "effort": "0",
          "duration": "0",
          "description": "Complete product specification and acceptance criteria draft by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Project Management specialists; Cross-functional review; Documented SOP",
          "planned": "533154",
          "assignedTo": "Project Management",
          "assigned": "533154",
          "actual": "533154",
          "cost": "533154",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.4",
          "slNo": "2.4.3",
          "task": "Clinical and nonclinical evidence gap assessment",
          "predecessor": "2.4.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-243",
          "jobCode": "JOB-243",
          "department": "Clinical & Medical Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete clinical and nonclinical evidence gap assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Clinical & Medical Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "533291",
          "assignedTo": "Clinical & Medical Affairs",
          "assigned": "533291",
          "actual": "533291",
          "cost": "533291",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "2.5",
          "slNo": "2.5.1",
          "task": "Data integrity and documentation strategy",
          "predecessor": "2.4.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-251",
          "jobCode": "JOB-251",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete data integrity and documentation strategy by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "534387",
          "assignedTo": "Formulation R&D",
          "assigned": "534387",
          "actual": "534387",
          "cost": "534387",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "2.5",
          "slNo": "2.5.2",
          "task": "Development governance and change-control plan",
          "predecessor": "2.5.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-252",
          "jobCode": "JOB-252",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete development governance and change-control plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "534524",
          "assignedTo": "Formulation R&D",
          "assigned": "534524",
          "actual": "534524",
          "cost": "534524",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S3": {
    "sidebarMenus": [
      {
        "slNo": "3.1",
        "name": "Pre-formulation and material characterization package",
        "description": "Compile and obtain cross-functional approval of the pre-formulation and material characterization package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 5,
        "isOpen": true
      },
      {
        "slNo": "3.2",
        "name": "Prototype formulation and performance assessment",
        "description": "Compile and obtain cross-functional approval of the prototype formulation and performance assessment deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 6,
        "isOpen": false
      },
      {
        "slNo": "3.3",
        "name": "Product concept and development risk review",
        "description": "Compile and obtain cross-functional approval of the product concept and development risk review deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 5,
        "isOpen": false
      },
      {
        "slNo": "3.4",
        "name": "Preliminary control and stability strategy",
        "description": "Compile and obtain cross-functional approval of the preliminary control and stability strategy deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 1,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "3.1",
          "slNo": "3.1.1",
          "task": "API and excipient compatibility assessment",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "TC-311",
          "jobCode": "JOB-311",
          "department": "Pre-Formulation / R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete api and excipient compatibility assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Pre-Formulation / R&D specialists; Cross-functional review; Documented SOP",
          "planned": "542607",
          "assignedTo": "Pre-Formulation",
          "assigned": "542607",
          "actual": "542607",
          "cost": "542607",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.1",
          "slNo": "3.1.2",
          "task": "Pre-formulation characterization plan",
          "predecessor": "3.1.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-312",
          "jobCode": "JOB-312",
          "department": "Pre-Formulation / R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete pre-formulation characterization plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Pre-Formulation / R&D specialists; Cross-functional review; Documented SOP",
          "planned": "542744",
          "assignedTo": "Pre-Formulation",
          "assigned": "542744",
          "actual": "542744",
          "cost": "542744",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.1",
          "slNo": "3.1.3",
          "task": "Prototype formulation design",
          "predecessor": "3.1.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-313",
          "jobCode": "JOB-313",
          "department": "Pre-Formulation / R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete prototype formulation design by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Pre-Formulation / R&D specialists; Cross-functional review; Documented SOP",
          "planned": "542881",
          "assignedTo": "Pre-Formulation",
          "assigned": "542881",
          "actual": "542881",
          "cost": "542881",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.1",
          "slNo": "3.1.4",
          "task": "Excipient selection and justification",
          "predecessor": "3.1.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-314",
          "jobCode": "JOB-314",
          "department": "Pre-Formulation / R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete excipient selection and justification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Pre-Formulation / R&D specialists; Cross-functional review; Documented SOP",
          "planned": "543018",
          "assignedTo": "Pre-Formulation",
          "assigned": "543018",
          "actual": "543018",
          "cost": "543018",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.1",
          "slNo": "3.1.5",
          "task": "Dosage form and delivery system selection",
          "predecessor": "3.1.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-315",
          "jobCode": "JOB-315",
          "department": "Pre-Formulation / R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete dosage form and delivery system selection by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Pre-Formulation / R&D specialists; Cross-functional review; Documented SOP",
          "planned": "543155",
          "assignedTo": "Pre-Formulation",
          "assigned": "543155",
          "actual": "543155",
          "cost": "543155",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "3.2",
          "slNo": "3.2.1",
          "task": "Initial manufacturing process concept",
          "predecessor": "3.1.5 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-321",
          "jobCode": "JOB-321",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete initial manufacturing process concept by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "543977",
          "assignedTo": "Formulation R&D",
          "assigned": "543977",
          "actual": "543977",
          "cost": "543977",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.2",
          "slNo": "3.2.2",
          "task": "Preliminary analytical control strategy",
          "predecessor": "3.2.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-322",
          "jobCode": "JOB-322",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete preliminary analytical control strategy by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "544114",
          "assignedTo": "Analytical Development",
          "assigned": "544114",
          "actual": "544114",
          "cost": "544114",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.2",
          "slNo": "3.2.3",
          "task": "Prototype performance and dissolution assessment",
          "predecessor": "3.2.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-323",
          "jobCode": "JOB-323",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete prototype performance and dissolution assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "544251",
          "assignedTo": "Analytical Development",
          "assigned": "544251",
          "actual": "544251",
          "cost": "544251",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.2",
          "slNo": "3.2.4",
          "task": "Stability risk assessment and initial protocol",
          "predecessor": "3.2.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-324",
          "jobCode": "JOB-324",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete stability risk assessment and initial protocol by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "544388",
          "assignedTo": "QC Stability",
          "assigned": "544388",
          "actual": "544388",
          "cost": "544388",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.2",
          "slNo": "3.2.5",
          "task": "Packaging concept and compatibility assessment",
          "predecessor": "3.2.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-325",
          "jobCode": "JOB-325",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete packaging concept and compatibility assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "544525",
          "assignedTo": "Formulation R&D",
          "assigned": "544525",
          "actual": "544525",
          "cost": "544525",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.2",
          "slNo": "3.2.6",
          "task": "Preliminary scale-up feasibility assessment",
          "predecessor": "3.2.5 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-326",
          "jobCode": "JOB-326",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete preliminary scale-up feasibility assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "544662",
          "assignedTo": "Formulation R&D",
          "assigned": "544662",
          "actual": "544662",
          "cost": "544662",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "3.3",
          "slNo": "3.3.1",
          "task": "Formulation design review",
          "predecessor": "3.2.6 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-331",
          "jobCode": "JOB-331",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete formulation design review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "545347",
          "assignedTo": "Formulation R&D",
          "assigned": "545347",
          "actual": "545347",
          "cost": "545347",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.3",
          "slNo": "3.3.2",
          "task": "Prototype selection and rationale",
          "predecessor": "3.3.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-332",
          "jobCode": "JOB-332",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete prototype selection and rationale by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "545484",
          "assignedTo": "Formulation R&D",
          "assigned": "545484",
          "actual": "545484",
          "cost": "545484",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.3",
          "slNo": "3.3.3",
          "task": "Preliminary CQA and CPP linkage assessment",
          "predecessor": "3.3.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-333",
          "jobCode": "JOB-333",
          "department": "Quality Assurance",
          "effort": "0",
          "duration": "0",
          "description": "Complete preliminary cqa and cpp linkage assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Quality Assurance specialists; Cross-functional review; Documented SOP",
          "planned": "545621",
          "assignedTo": "Quality Assurance",
          "assigned": "545621",
          "actual": "545621",
          "cost": "545621",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.3",
          "slNo": "3.3.4",
          "task": "Development batch design",
          "predecessor": "3.3.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-334",
          "jobCode": "JOB-334",
          "department": "Manufacturing Operations",
          "effort": "0",
          "duration": "0",
          "description": "Complete development batch design by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Manufacturing Operations specialists; Cross-functional review; Documented SOP",
          "planned": "545758",
          "assignedTo": "Manufacturing Operations",
          "assigned": "545758",
          "actual": "545758",
          "cost": "545758",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "3.3",
          "slNo": "3.3.5",
          "task": "Reference product characterization",
          "predecessor": "3.3.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-335",
          "jobCode": "JOB-335",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete reference product characterization by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "545895",
          "assignedTo": "Formulation R&D",
          "assigned": "545895",
          "actual": "545895",
          "cost": "545895",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "3.4",
          "slNo": "3.4.1",
          "task": "Concept formulation risk review",
          "predecessor": "3.3.5 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-341",
          "jobCode": "JOB-341",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete concept formulation risk review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "546717",
          "assignedTo": "QC Stability",
          "assigned": "546717",
          "actual": "546717",
          "cost": "546717",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S4": {
    "sidebarMenus": [
      {
        "slNo": "4.1",
        "name": "Qualified API and excipient supply strategy",
        "description": "Compile and obtain cross-functional approval of the qualified api and excipient supply strategy deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 4,
        "isOpen": true
      },
      {
        "slNo": "4.2",
        "name": "Supplier nomination and quality agreements",
        "description": "Compile and obtain cross-functional approval of the supplier nomination and quality agreements deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 3,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "4.1",
          "slNo": "4.1.1",
          "task": "API supplier technical assessment",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "TC-411",
          "jobCode": "JOB-411",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete api supplier technical assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "556307",
          "assignedTo": "Formulation R&D",
          "assigned": "556307",
          "actual": "556307",
          "cost": "556307",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "4.1",
          "slNo": "4.1.2",
          "task": "Excipient and packaging vendor assessment",
          "predecessor": "4.1.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-412",
          "jobCode": "JOB-412",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete excipient and packaging vendor assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "556444",
          "assignedTo": "Formulation R&D",
          "assigned": "556444",
          "actual": "556444",
          "cost": "556444",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "4.1",
          "slNo": "4.1.3",
          "task": "Supplier quality agreement and audit planning",
          "predecessor": "4.1.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-413",
          "jobCode": "JOB-413",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete supplier quality agreement and audit planning by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "556581",
          "assignedTo": "Formulation R&D",
          "assigned": "556581",
          "actual": "556581",
          "cost": "556581",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "4.1",
          "slNo": "4.1.4",
          "task": "API specification and certificate review",
          "predecessor": "4.1.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-414",
          "jobCode": "JOB-414",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete api specification and certificate review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "556718",
          "assignedTo": "Formulation R&D",
          "assigned": "556718",
          "actual": "556718",
          "cost": "556718",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "4.2",
          "slNo": "4.2.1",
          "task": "Vendor qualification and sample procurement",
          "predecessor": "4.1.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-421",
          "jobCode": "JOB-421",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete vendor qualification and sample procurement by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "557677",
          "assignedTo": "Validation & Engineering",
          "assigned": "557677",
          "actual": "557677",
          "cost": "557677",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "4.2",
          "slNo": "4.2.2",
          "task": "Supply continuity and material risk assessment",
          "predecessor": "4.2.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-422",
          "jobCode": "JOB-422",
          "department": "Sourcing / Procurement",
          "effort": "0",
          "duration": "0",
          "description": "Complete supply continuity and material risk assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Sourcing / Procurement specialists; Cross-functional review; Documented SOP",
          "planned": "557814",
          "assignedTo": "Sourcing",
          "assigned": "557814",
          "actual": "557814",
          "cost": "557814",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "4.2",
          "slNo": "4.2.3",
          "task": "Supplier selection and nomination",
          "predecessor": "4.2.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-423",
          "jobCode": "JOB-423",
          "department": "Sourcing / Procurement",
          "effort": "0",
          "duration": "0",
          "description": "Complete supplier selection and nomination by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Sourcing / Procurement specialists; Cross-functional review; Documented SOP",
          "planned": "557951",
          "assignedTo": "Sourcing",
          "assigned": "557951",
          "actual": "557951",
          "cost": "557951",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S5": {
    "sidebarMenus": [
      {
        "slNo": "5.1",
        "name": "Optimized formulation and process definition",
        "description": "Compile and obtain cross-functional approval of the optimized formulation and process definition deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 4,
        "isOpen": true
      },
      {
        "slNo": "5.2",
        "name": "Analytical methods and control strategy",
        "description": "Compile and obtain cross-functional approval of the analytical methods and control strategy deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 4,
        "isOpen": false
      },
      {
        "slNo": "5.3",
        "name": "Stability and packaging compatibility package",
        "description": "Compile and obtain cross-functional approval of the stability and packaging compatibility package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 5,
        "isOpen": false
      },
      {
        "slNo": "5.4",
        "name": "Manufacturing process and scale-up package",
        "description": "Compile and obtain cross-functional approval of the manufacturing process and scale-up package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 6,
        "isOpen": false
      },
      {
        "slNo": "5.5",
        "name": "Development specifications and batch documentation",
        "description": "Compile and obtain cross-functional approval of the development specifications and batch documentation deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 4,
        "isOpen": false
      },
      {
        "slNo": "5.6",
        "name": "Formulation and process development report",
        "description": "Compile and obtain cross-functional approval of the formulation and process development report deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 3,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "5.1",
          "slNo": "5.1.1",
          "task": "Formulation optimization and DoE studies",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "TC-511",
          "jobCode": "JOB-511",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete formulation optimization and doe studies by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "570007",
          "assignedTo": "Formulation R&D",
          "assigned": "570007",
          "actual": "570007",
          "cost": "570007",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.1",
          "slNo": "5.1.2",
          "task": "API particle size and material attribute assessment",
          "predecessor": "5.1.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-512",
          "jobCode": "JOB-512",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete api particle size and material attribute assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "570144",
          "assignedTo": "Formulation R&D",
          "assigned": "570144",
          "actual": "570144",
          "cost": "570144",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.1",
          "slNo": "5.1.3",
          "task": "Excipient grade and functionality optimization",
          "predecessor": "5.1.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-513",
          "jobCode": "JOB-513",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete excipient grade and functionality optimization by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "570281",
          "assignedTo": "Formulation R&D",
          "assigned": "570281",
          "actual": "570281",
          "cost": "570281",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.1",
          "slNo": "5.1.4",
          "task": "Manufacturing process parameter development",
          "predecessor": "5.1.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-514",
          "jobCode": "JOB-514",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete manufacturing process parameter development by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "570418",
          "assignedTo": "Formulation R&D",
          "assigned": "570418",
          "actual": "570418",
          "cost": "570418",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "5.2",
          "slNo": "5.2.1",
          "task": "Critical Process Parameters (CPP) identification",
          "predecessor": "5.1.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-521",
          "jobCode": "JOB-521",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete critical process parameters (cpp) identification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "571377",
          "assignedTo": "Analytical Development",
          "assigned": "571377",
          "actual": "571377",
          "cost": "571377",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.2",
          "slNo": "5.2.2",
          "task": "Critical Material Attributes (CMA) assessment",
          "predecessor": "5.2.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-522",
          "jobCode": "JOB-522",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete critical material attributes (cma) assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "571514",
          "assignedTo": "Analytical Development",
          "assigned": "571514",
          "actual": "571514",
          "cost": "571514",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.2",
          "slNo": "5.2.3",
          "task": "Analytical method development for assay and impurities",
          "predecessor": "5.2.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-523",
          "jobCode": "JOB-523",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete analytical method development for assay and impurities by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "571651",
          "assignedTo": "Analytical Development",
          "assigned": "571651",
          "actual": "571651",
          "cost": "571651",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.2",
          "slNo": "5.2.4",
          "task": "Dissolution method development",
          "predecessor": "5.2.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-524",
          "jobCode": "JOB-524",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete dissolution method development by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "571788",
          "assignedTo": "Analytical Development",
          "assigned": "571788",
          "actual": "571788",
          "cost": "571788",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "5.3",
          "slNo": "5.3.1",
          "task": "Degradation pathway and impurity profiling",
          "predecessor": "5.2.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-531",
          "jobCode": "JOB-531",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete degradation pathway and impurity profiling by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "572747",
          "assignedTo": "Analytical Development",
          "assigned": "572747",
          "actual": "572747",
          "cost": "572747",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.3",
          "slNo": "5.3.2",
          "task": "Forced degradation study execution",
          "predecessor": "5.3.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-532",
          "jobCode": "JOB-532",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete forced degradation study execution by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "572884",
          "assignedTo": "QC Stability",
          "assigned": "572884",
          "actual": "572884",
          "cost": "572884",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.3",
          "slNo": "5.3.3",
          "task": "Container closure system selection",
          "predecessor": "5.3.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-533",
          "jobCode": "JOB-533",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete container closure system selection by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "573021",
          "assignedTo": "QC Stability",
          "assigned": "573021",
          "actual": "573021",
          "cost": "573021",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.3",
          "slNo": "5.3.4",
          "task": "Packaging compatibility and protection assessment",
          "predecessor": "5.3.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-534",
          "jobCode": "JOB-534",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete packaging compatibility and protection assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "573158",
          "assignedTo": "QC Stability",
          "assigned": "573158",
          "actual": "573158",
          "cost": "573158",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.3",
          "slNo": "5.3.5",
          "task": "Prototype batch manufacturing instructions",
          "predecessor": "5.3.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-535",
          "jobCode": "JOB-535",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete prototype batch manufacturing instructions by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "573295",
          "assignedTo": "QC Stability",
          "assigned": "573295",
          "actual": "573295",
          "cost": "573295",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "5.4",
          "slNo": "5.4.1",
          "task": "In-process control strategy development",
          "predecessor": "5.3.5 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-541",
          "jobCode": "JOB-541",
          "department": "MS&T / Process Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete in-process control strategy development by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "MS&T / Process Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "574117",
          "assignedTo": "MS&T",
          "assigned": "574117",
          "actual": "574117",
          "cost": "574117",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.4",
          "slNo": "5.4.2",
          "task": "Cleaning process development assessment",
          "predecessor": "5.4.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-542",
          "jobCode": "JOB-542",
          "department": "MS&T / Process Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete cleaning process development assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "MS&T / Process Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "574254",
          "assignedTo": "MS&T",
          "assigned": "574254",
          "actual": "574254",
          "cost": "574254",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.4",
          "slNo": "5.4.3",
          "task": "Microbial risk assessment where applicable",
          "predecessor": "5.4.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-543",
          "jobCode": "JOB-543",
          "department": "MS&T / Process Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete microbial risk assessment where applicable by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "MS&T / Process Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "574391",
          "assignedTo": "MS&T",
          "assigned": "574391",
          "actual": "574391",
          "cost": "574391",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.4",
          "slNo": "5.4.4",
          "task": "Formulation design space and operating ranges",
          "predecessor": "5.4.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-544",
          "jobCode": "JOB-544",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete formulation design space and operating ranges by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "574528",
          "assignedTo": "Formulation R&D",
          "assigned": "574528",
          "actual": "574528",
          "cost": "574528",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.4",
          "slNo": "5.4.5",
          "task": "Preliminary process capability assessment",
          "predecessor": "5.4.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-545",
          "jobCode": "JOB-545",
          "department": "MS&T / Process Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete preliminary process capability assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "MS&T / Process Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "574665",
          "assignedTo": "MS&T",
          "assigned": "574665",
          "actual": "574665",
          "cost": "574665",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.4",
          "slNo": "5.4.6",
          "task": "Accelerated stability study initiation",
          "predecessor": "5.4.5 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-546",
          "jobCode": "JOB-546",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete accelerated stability study initiation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "574802",
          "assignedTo": "QC Stability",
          "assigned": "574802",
          "actual": "574802",
          "cost": "574802",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "5.5",
          "slNo": "5.5.1",
          "task": "Long-term stability study initiation",
          "predecessor": "5.4.6 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-551",
          "jobCode": "JOB-551",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete long-term stability study initiation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "575487",
          "assignedTo": "QC Stability",
          "assigned": "575487",
          "actual": "575487",
          "cost": "575487",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.5",
          "slNo": "5.5.2",
          "task": "Bioavailability or bioequivalence strategy assessment",
          "predecessor": "5.5.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-552",
          "jobCode": "JOB-552",
          "department": "Clinical & Medical Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete bioavailability or bioequivalence strategy assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Clinical & Medical Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "575624",
          "assignedTo": "Clinical & Medical Affairs",
          "assigned": "575624",
          "actual": "575624",
          "cost": "575624",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.5",
          "slNo": "5.5.3",
          "task": "Scale-up and technology transfer risk review",
          "predecessor": "5.5.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-553",
          "jobCode": "JOB-553",
          "department": "MS&T / Process Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete scale-up and technology transfer risk review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "MS&T / Process Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "575761",
          "assignedTo": "MS&T",
          "assigned": "575761",
          "actual": "575761",
          "cost": "575761",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.5",
          "slNo": "5.5.4",
          "task": "Draft master batch record preparation",
          "predecessor": "5.5.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-554",
          "jobCode": "JOB-554",
          "department": "Manufacturing Operations",
          "effort": "0",
          "duration": "0",
          "description": "Complete draft master batch record preparation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Manufacturing Operations specialists; Cross-functional review; Documented SOP",
          "planned": "575898",
          "assignedTo": "Manufacturing Operations",
          "assigned": "575898",
          "actual": "575898",
          "cost": "575898",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "5.6",
          "slNo": "5.6.1",
          "task": "Manufacturing equipment and facility fit assessment",
          "predecessor": "5.5.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-561",
          "jobCode": "JOB-561",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete manufacturing equipment and facility fit assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "576857",
          "assignedTo": "Formulation R&D",
          "assigned": "576857",
          "actual": "576857",
          "cost": "576857",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.6",
          "slNo": "5.6.2",
          "task": "Process hazard and EHS assessment",
          "predecessor": "5.6.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-562",
          "jobCode": "JOB-562",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete process hazard and ehs assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "576994",
          "assignedTo": "Formulation R&D",
          "assigned": "576994",
          "actual": "576994",
          "cost": "576994",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "5.6",
          "slNo": "5.6.3",
          "task": "Formulation and process development report",
          "predecessor": "5.6.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-563",
          "jobCode": "JOB-563",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete formulation and process development report by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "577131",
          "assignedTo": "Formulation R&D",
          "assigned": "577131",
          "actual": "577131",
          "cost": "577131",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S6": {
    "sidebarMenus": [
      {
        "slNo": "6.1",
        "name": "Development batch and test results",
        "description": "Compile and obtain cross-functional approval of the development batch and test results deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 2,
        "isOpen": true
      },
      {
        "slNo": "6.2",
        "name": "Analytical and product performance verification",
        "description": "Compile and obtain cross-functional approval of the analytical and product performance verification deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 3,
        "isOpen": false
      },
      {
        "slNo": "6.3",
        "name": "Stability and packaging assessment",
        "description": "Compile and obtain cross-functional approval of the stability and packaging assessment deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 6,
        "isOpen": false
      },
      {
        "slNo": "6.4",
        "name": "Development verification report",
        "description": "Compile and obtain cross-functional approval of the development verification report deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 2,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "6.1",
          "slNo": "6.1.1",
          "task": "Pilot batch manufacturing and documentation",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "TC-611",
          "jobCode": "JOB-611",
          "department": "Manufacturing Operations",
          "effort": "0",
          "duration": "0",
          "description": "Complete pilot batch manufacturing and documentation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Manufacturing Operations specialists; Cross-functional review; Documented SOP",
          "planned": "583707",
          "assignedTo": "Manufacturing Operations",
          "assigned": "583707",
          "actual": "583707",
          "cost": "583707",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "6.1",
          "slNo": "6.1.2",
          "task": "Development batch sampling and testing",
          "predecessor": "6.1.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-612",
          "jobCode": "JOB-612",
          "department": "Manufacturing Operations",
          "effort": "0",
          "duration": "0",
          "description": "Complete development batch sampling and testing by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Manufacturing Operations specialists; Cross-functional review; Documented SOP",
          "planned": "583844",
          "assignedTo": "Manufacturing Operations",
          "assigned": "583844",
          "actual": "583844",
          "cost": "583844",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "6.2",
          "slNo": "6.2.1",
          "task": "Analytical method verification",
          "predecessor": "6.1.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-621",
          "jobCode": "JOB-621",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete analytical method verification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "585077",
          "assignedTo": "Analytical Development",
          "assigned": "585077",
          "actual": "585077",
          "cost": "585077",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "6.2",
          "slNo": "6.2.2",
          "task": "Assay, impurities and dissolution testing",
          "predecessor": "6.2.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-622",
          "jobCode": "JOB-622",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete assay, impurities and dissolution testing by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "585214",
          "assignedTo": "Analytical Development",
          "assigned": "585214",
          "actual": "585214",
          "cost": "585214",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "6.2",
          "slNo": "6.2.3",
          "task": "Physical and chemical characterization",
          "predecessor": "6.2.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-623",
          "jobCode": "JOB-623",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete physical and chemical characterization by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "585351",
          "assignedTo": "Analytical Development",
          "assigned": "585351",
          "actual": "585351",
          "cost": "585351",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "6.3",
          "slNo": "6.3.1",
          "task": "Microbiological testing where applicable",
          "predecessor": "6.2.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-631",
          "jobCode": "JOB-631",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete microbiological testing where applicable by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "586447",
          "assignedTo": "QC Stability",
          "assigned": "586447",
          "actual": "586447",
          "cost": "586447",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "6.3",
          "slNo": "6.3.2",
          "task": "Packaging line and pack presentation trials",
          "predecessor": "6.3.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-632",
          "jobCode": "JOB-632",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete packaging line and pack presentation trials by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "586584",
          "assignedTo": "QC Stability",
          "assigned": "586584",
          "actual": "586584",
          "cost": "586584",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "6.3",
          "slNo": "6.3.3",
          "task": "Stability protocol execution and trending",
          "predecessor": "6.3.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-633",
          "jobCode": "JOB-633",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete stability protocol execution and trending by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "586721",
          "assignedTo": "QC Stability",
          "assigned": "586721",
          "actual": "586721",
          "cost": "586721",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "6.3",
          "slNo": "6.3.4",
          "task": "Deviation and out-of-specification investigation",
          "predecessor": "6.3.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-634",
          "jobCode": "JOB-634",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete deviation and out-of-specification investigation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "586858",
          "assignedTo": "QC Stability",
          "assigned": "586858",
          "actual": "586858",
          "cost": "586858",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "6.3",
          "slNo": "6.3.5",
          "task": "Process parameter and yield evaluation",
          "predecessor": "6.3.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-635",
          "jobCode": "JOB-635",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete process parameter and yield evaluation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "586995",
          "assignedTo": "QC Stability",
          "assigned": "586995",
          "actual": "586995",
          "cost": "586995",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "6.3",
          "slNo": "6.3.6",
          "task": "Batch record review and reconciliation",
          "predecessor": "6.3.5 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-636",
          "jobCode": "JOB-636",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete batch record review and reconciliation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "587132",
          "assignedTo": "QC Stability",
          "assigned": "587132",
          "actual": "587132",
          "cost": "587132",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "6.4",
          "slNo": "6.4.1",
          "task": "Product specification refinement",
          "predecessor": "6.3.6 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-641",
          "jobCode": "JOB-641",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete product specification refinement by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "587817",
          "assignedTo": "Formulation R&D",
          "assigned": "587817",
          "actual": "587817",
          "cost": "587817",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "6.4",
          "slNo": "6.4.2",
          "task": "Formulation and process verification report",
          "predecessor": "6.4.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-642",
          "jobCode": "JOB-642",
          "department": "Formulation R&D",
          "effort": "0",
          "duration": "0",
          "description": "Complete formulation and process verification report by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Formulation R&D specialists; Cross-functional review; Documented SOP",
          "planned": "587954",
          "assignedTo": "Formulation R&D",
          "assigned": "587954",
          "actual": "587954",
          "cost": "587954",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S7": {
    "sidebarMenus": [
      {
        "slNo": "7.1",
        "name": "Facility and equipment qualification plan",
        "description": "Compile and obtain cross-functional approval of the facility and equipment qualification plan deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 4,
        "isOpen": true
      },
      {
        "slNo": "7.2",
        "name": "GMP manufacturing and laboratory readiness",
        "description": "Compile and obtain cross-functional approval of the gmp manufacturing and laboratory readiness deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 5,
        "isOpen": false
      },
      {
        "slNo": "7.3",
        "name": "Process validation and cleaning strategy",
        "description": "Compile and obtain cross-functional approval of the process validation and cleaning strategy deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 3,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "7.1",
          "slNo": "7.1.1",
          "task": "Facility and equipment gap assessment",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "TC-711",
          "jobCode": "JOB-711",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete facility and equipment gap assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "597407",
          "assignedTo": "Validation & Engineering",
          "assigned": "597407",
          "actual": "597407",
          "cost": "597407",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "7.1",
          "slNo": "7.1.2",
          "task": "Equipment qualification planning (DQ/IQ/OQ/PQ)",
          "predecessor": "7.1.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-712",
          "jobCode": "JOB-712",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete equipment qualification planning (dq/iq/oq/pq) by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "597544",
          "assignedTo": "Validation & Engineering",
          "assigned": "597544",
          "actual": "597544",
          "cost": "597544",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "7.1",
          "slNo": "7.1.3",
          "task": "Utilities and environmental control readiness",
          "predecessor": "7.1.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-713",
          "jobCode": "JOB-713",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete utilities and environmental control readiness by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "597681",
          "assignedTo": "Validation & Engineering",
          "assigned": "597681",
          "actual": "597681",
          "cost": "597681",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "7.1",
          "slNo": "7.1.4",
          "task": "Manufacturing process risk assessment",
          "predecessor": "7.1.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-714",
          "jobCode": "JOB-714",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete manufacturing process risk assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "597818",
          "assignedTo": "Validation & Engineering",
          "assigned": "597818",
          "actual": "597818",
          "cost": "597818",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "7.2",
          "slNo": "7.2.1",
          "task": "Cleaning validation strategy and protocol",
          "predecessor": "7.1.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-721",
          "jobCode": "JOB-721",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete cleaning validation strategy and protocol by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "598777",
          "assignedTo": "Validation & Engineering",
          "assigned": "598777",
          "actual": "598777",
          "cost": "598777",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "7.2",
          "slNo": "7.2.2",
          "task": "Computerized system and data integrity readiness",
          "predecessor": "7.2.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-722",
          "jobCode": "JOB-722",
          "department": "Manufacturing Operations",
          "effort": "0",
          "duration": "0",
          "description": "Complete computerized system and data integrity readiness by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Manufacturing Operations specialists; Cross-functional review; Documented SOP",
          "planned": "598914",
          "assignedTo": "Manufacturing Operations",
          "assigned": "598914",
          "actual": "598914",
          "cost": "598914",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "7.2",
          "slNo": "7.2.3",
          "task": "Material flow and contamination control review",
          "predecessor": "7.2.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-723",
          "jobCode": "JOB-723",
          "department": "Manufacturing Operations",
          "effort": "0",
          "duration": "0",
          "description": "Complete material flow and contamination control review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Manufacturing Operations specialists; Cross-functional review; Documented SOP",
          "planned": "599051",
          "assignedTo": "Manufacturing Operations",
          "assigned": "599051",
          "actual": "599051",
          "cost": "599051",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "7.2",
          "slNo": "7.2.4",
          "task": "GMP documentation and SOP preparation",
          "predecessor": "7.2.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-724",
          "jobCode": "JOB-724",
          "department": "Manufacturing Operations",
          "effort": "0",
          "duration": "0",
          "description": "Complete gmp documentation and sop preparation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Manufacturing Operations specialists; Cross-functional review; Documented SOP",
          "planned": "599188",
          "assignedTo": "Manufacturing Operations",
          "assigned": "599188",
          "actual": "599188",
          "cost": "599188",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "7.2",
          "slNo": "7.2.5",
          "task": "Analytical laboratory readiness assessment",
          "predecessor": "7.2.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-725",
          "jobCode": "JOB-725",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete analytical laboratory readiness assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "599325",
          "assignedTo": "Analytical Development",
          "assigned": "599325",
          "actual": "599325",
          "cost": "599325",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "7.3",
          "slNo": "7.3.1",
          "task": "Preventive maintenance and calibration planning",
          "predecessor": "7.2.5 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-731",
          "jobCode": "JOB-731",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete preventive maintenance and calibration planning by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "600147",
          "assignedTo": "Validation & Engineering",
          "assigned": "600147",
          "actual": "600147",
          "cost": "600147",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "7.3",
          "slNo": "7.3.2",
          "task": "Training and competency qualification",
          "predecessor": "7.3.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-732",
          "jobCode": "JOB-732",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete training and competency qualification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "600284",
          "assignedTo": "Validation & Engineering",
          "assigned": "600284",
          "actual": "600284",
          "cost": "600284",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "7.3",
          "slNo": "7.3.3",
          "task": "Process validation master plan",
          "predecessor": "7.3.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-733",
          "jobCode": "JOB-733",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete process validation master plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "600421",
          "assignedTo": "Validation & Engineering",
          "assigned": "600421",
          "actual": "600421",
          "cost": "600421",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S8": {
    "sidebarMenus": [
      {
        "slNo": "8.1",
        "name": "Validated analytical methods package",
        "description": "Compile and obtain cross-functional approval of the validated analytical methods package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 3,
        "isOpen": true
      },
      {
        "slNo": "8.2",
        "name": "Technology transfer and method transfer report",
        "description": "Compile and obtain cross-functional approval of the technology transfer and method transfer report deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 5,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "8.1",
          "slNo": "8.1.1",
          "task": "Analytical method validation protocol approval",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "TC-811",
          "jobCode": "JOB-811",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete analytical method validation protocol approval by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "611107",
          "assignedTo": "Analytical Development",
          "assigned": "611107",
          "actual": "611107",
          "cost": "611107",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "8.1",
          "slNo": "8.1.2",
          "task": "Assay and impurity method validation",
          "predecessor": "8.1.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-812",
          "jobCode": "JOB-812",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete assay and impurity method validation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "611244",
          "assignedTo": "Analytical Development",
          "assigned": "611244",
          "actual": "611244",
          "cost": "611244",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "8.1",
          "slNo": "8.1.3",
          "task": "Dissolution method validation",
          "predecessor": "8.1.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-813",
          "jobCode": "JOB-813",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete dissolution method validation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "611381",
          "assignedTo": "Analytical Development",
          "assigned": "611381",
          "actual": "611381",
          "cost": "611381",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "8.2",
          "slNo": "8.2.1",
          "task": "Microbiological method suitability or validation",
          "predecessor": "8.1.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-821",
          "jobCode": "JOB-821",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete microbiological method suitability or validation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "612477",
          "assignedTo": "Analytical Development",
          "assigned": "612477",
          "actual": "612477",
          "cost": "612477",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "8.2",
          "slNo": "8.2.2",
          "task": "Reference standards and critical reagents qualification",
          "predecessor": "8.2.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-822",
          "jobCode": "JOB-822",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete reference standards and critical reagents qualification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "612614",
          "assignedTo": "Analytical Development",
          "assigned": "612614",
          "actual": "612614",
          "cost": "612614",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "8.2",
          "slNo": "8.2.3",
          "task": "Technology transfer package preparation",
          "predecessor": "8.2.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-823",
          "jobCode": "JOB-823",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete technology transfer package preparation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "612751",
          "assignedTo": "Analytical Development",
          "assigned": "612751",
          "actual": "612751",
          "cost": "612751",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "8.2",
          "slNo": "8.2.4",
          "task": "Receiving site method transfer execution",
          "predecessor": "8.2.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-824",
          "jobCode": "JOB-824",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete receiving site method transfer execution by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "612888",
          "assignedTo": "Analytical Development",
          "assigned": "612888",
          "actual": "612888",
          "cost": "612888",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "8.2",
          "slNo": "8.2.5",
          "task": "Method transfer discrepancy resolution",
          "predecessor": "8.2.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-825",
          "jobCode": "JOB-825",
          "department": "Analytical Development",
          "effort": "0",
          "duration": "0",
          "description": "Complete method transfer discrepancy resolution by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Analytical Development specialists; Cross-functional review; Documented SOP",
          "planned": "613025",
          "assignedTo": "Analytical Development",
          "assigned": "613025",
          "actual": "613025",
          "cost": "613025",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S9": {
    "sidebarMenus": [
      {
        "slNo": "9.1",
        "name": "Process performance qualification package",
        "description": "Compile and obtain cross-functional approval of the process performance qualification package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 4,
        "isOpen": true
      },
      {
        "slNo": "9.2",
        "name": "Registration batch and stability data package",
        "description": "Compile and obtain cross-functional approval of the registration batch and stability data package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 4,
        "isOpen": false
      },
      {
        "slNo": "9.3",
        "name": "Validation summary and commercial process readiness",
        "description": "Compile and obtain cross-functional approval of the validation summary and commercial process readiness deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 3,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "9.1",
          "slNo": "9.1.1",
          "task": "Registration batch manufacturing plan",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "TC-911",
          "jobCode": "JOB-911",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete registration batch manufacturing plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "624807",
          "assignedTo": "Validation & Engineering",
          "assigned": "624807",
          "actual": "624807",
          "cost": "624807",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "9.1",
          "slNo": "9.1.2",
          "task": "Process performance qualification protocol",
          "predecessor": "9.1.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-912",
          "jobCode": "JOB-912",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete process performance qualification protocol by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "624944",
          "assignedTo": "Validation & Engineering",
          "assigned": "624944",
          "actual": "624944",
          "cost": "624944",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "9.1",
          "slNo": "9.1.3",
          "task": "Commercial-scale batch manufacturing",
          "predecessor": "9.1.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-913",
          "jobCode": "JOB-913",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete commercial-scale batch manufacturing by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "625081",
          "assignedTo": "Validation & Engineering",
          "assigned": "625081",
          "actual": "625081",
          "cost": "625081",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "9.1",
          "slNo": "9.1.4",
          "task": "Process validation sampling and testing",
          "predecessor": "9.1.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-914",
          "jobCode": "JOB-914",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete process validation sampling and testing by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "625218",
          "assignedTo": "Validation & Engineering",
          "assigned": "625218",
          "actual": "625218",
          "cost": "625218",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "9.2",
          "slNo": "9.2.1",
          "task": "Batch documentation and quality review",
          "predecessor": "9.1.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-921",
          "jobCode": "JOB-921",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete batch documentation and quality review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "626177",
          "assignedTo": "QC Stability",
          "assigned": "626177",
          "actual": "626177",
          "cost": "626177",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "9.2",
          "slNo": "9.2.2",
          "task": "Stability batches placement and monitoring",
          "predecessor": "9.2.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-922",
          "jobCode": "JOB-922",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete stability batches placement and monitoring by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "626314",
          "assignedTo": "QC Stability",
          "assigned": "626314",
          "actual": "626314",
          "cost": "626314",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "9.2",
          "slNo": "9.2.3",
          "task": "Packaging and serialization readiness",
          "predecessor": "9.2.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-923",
          "jobCode": "JOB-923",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete packaging and serialization readiness by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "626451",
          "assignedTo": "QC Stability",
          "assigned": "626451",
          "actual": "626451",
          "cost": "626451",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "9.2",
          "slNo": "9.2.4",
          "task": "Process validation deviation assessment",
          "predecessor": "9.2.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-924",
          "jobCode": "JOB-924",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete process validation deviation assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "626588",
          "assignedTo": "QC Stability",
          "assigned": "626588",
          "actual": "626588",
          "cost": "626588",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "9.3",
          "slNo": "9.3.1",
          "task": "Batch release testing and disposition",
          "predecessor": "9.2.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-931",
          "jobCode": "JOB-931",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete batch release testing and disposition by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "627547",
          "assignedTo": "Validation & Engineering",
          "assigned": "627547",
          "actual": "627547",
          "cost": "627547",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "9.3",
          "slNo": "9.3.2",
          "task": "Continued process verification plan",
          "predecessor": "9.3.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-932",
          "jobCode": "JOB-932",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete continued process verification plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "627684",
          "assignedTo": "Validation & Engineering",
          "assigned": "627684",
          "actual": "627684",
          "cost": "627684",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "9.3",
          "slNo": "9.3.3",
          "task": "Registration batch summary report",
          "predecessor": "9.3.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-933",
          "jobCode": "JOB-933",
          "department": "Validation & Engineering",
          "effort": "0",
          "duration": "0",
          "description": "Complete registration batch summary report by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Validation & Engineering specialists; Cross-functional review; Documented SOP",
          "planned": "627821",
          "assignedTo": "Validation & Engineering",
          "assigned": "627821",
          "actual": "627821",
          "cost": "627821",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S10": {
    "sidebarMenus": [
      {
        "slNo": "10.1",
        "name": "Regulatory submission dossier",
        "description": "Compile and obtain cross-functional approval of the regulatory submission dossier deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 5,
        "isOpen": true
      },
      {
        "slNo": "10.2",
        "name": "Regulatory approval and commitments tracker",
        "description": "Compile and obtain cross-functional approval of the regulatory approval and commitments tracker deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 4,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "10.1",
          "slNo": "10.1.1",
          "task": "Regulatory dossier content gap assessment",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "TC-1011",
          "jobCode": "JOB-1011",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete regulatory dossier content gap assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "638507",
          "assignedTo": "Regulatory Affairs",
          "assigned": "638507",
          "actual": "638507",
          "cost": "638507",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "10.1",
          "slNo": "10.1.2",
          "task": "CTD/eCTD quality module preparation",
          "predecessor": "10.1.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-1012",
          "jobCode": "JOB-1012",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete ctd/ectd quality module preparation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "638644",
          "assignedTo": "Regulatory Affairs",
          "assigned": "638644",
          "actual": "638644",
          "cost": "638644",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "10.1",
          "slNo": "10.1.3",
          "task": "Drug substance and drug product section compilation",
          "predecessor": "10.1.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1013",
          "jobCode": "JOB-1013",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete drug substance and drug product section compilation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "638781",
          "assignedTo": "Regulatory Affairs",
          "assigned": "638781",
          "actual": "638781",
          "cost": "638781",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "10.1",
          "slNo": "10.1.4",
          "task": "Nonclinical and clinical evidence compilation",
          "predecessor": "10.1.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1014",
          "jobCode": "JOB-1014",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete nonclinical and clinical evidence compilation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "638918",
          "assignedTo": "Regulatory Affairs",
          "assigned": "638918",
          "actual": "638918",
          "cost": "638918",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "10.1",
          "slNo": "10.1.5",
          "task": "Stability data and shelf-life justification",
          "predecessor": "10.1.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1015",
          "jobCode": "JOB-1015",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete stability data and shelf-life justification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "639055",
          "assignedTo": "Regulatory Affairs",
          "assigned": "639055",
          "actual": "639055",
          "cost": "639055",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "10.2",
          "slNo": "10.2.1",
          "task": "Labeling, prescribing information and artwork review",
          "predecessor": "10.1.5 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1021",
          "jobCode": "JOB-1021",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete labeling, prescribing information and artwork review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "639877",
          "assignedTo": "Regulatory Affairs",
          "assigned": "639877",
          "actual": "639877",
          "cost": "639877",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "10.2",
          "slNo": "10.2.2",
          "task": "Regulatory quality review and submission readiness",
          "predecessor": "10.2.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-1022",
          "jobCode": "JOB-1022",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete regulatory quality review and submission readiness by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "640014",
          "assignedTo": "Regulatory Affairs",
          "assigned": "640014",
          "actual": "640014",
          "cost": "640014",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "10.2",
          "slNo": "10.2.3",
          "task": "Submission publishing and electronic validation",
          "predecessor": "10.2.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1023",
          "jobCode": "JOB-1023",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete submission publishing and electronic validation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "640151",
          "assignedTo": "Regulatory Affairs",
          "assigned": "640151",
          "actual": "640151",
          "cost": "640151",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "10.2",
          "slNo": "10.2.4",
          "task": "Regulatory authority query response coordination",
          "predecessor": "10.2.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1024",
          "jobCode": "JOB-1024",
          "department": "Regulatory Affairs",
          "effort": "0",
          "duration": "0",
          "description": "Complete regulatory authority query response coordination by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Regulatory Affairs specialists; Cross-functional review; Documented SOP",
          "planned": "640288",
          "assignedTo": "Regulatory Affairs",
          "assigned": "640288",
          "actual": "640288",
          "cost": "640288",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  },
  "S11": {
    "sidebarMenus": [
      {
        "slNo": "11.1",
        "name": "Commercial launch readiness package",
        "description": "Compile and obtain cross-functional approval of the commercial launch readiness package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 5,
        "isOpen": true
      },
      {
        "slNo": "11.2",
        "name": "Product lifecycle and post-approval management plan",
        "description": "Compile and obtain cross-functional approval of the product lifecycle and post-approval management plan deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.",
        "count": 5,
        "isOpen": false
      }
    ],
    "modulesData": [
      [
        {
          "deliverableSlNo": "11.1",
          "slNo": "11.1.1",
          "task": "Commercial supply and launch readiness review",
          "predecessor": "—",
          "applicability": "All Products",
          "taskCode": "TC-1111",
          "jobCode": "JOB-1111",
          "department": "Product Strategy / Commercial",
          "effort": "0",
          "duration": "0",
          "description": "Complete commercial supply and launch readiness review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Product Strategy / Commercial specialists; Cross-functional review; Documented SOP",
          "planned": "652207",
          "assignedTo": "Product Strategy",
          "assigned": "652207",
          "actual": "652207",
          "cost": "652207",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "11.1",
          "slNo": "11.1.2",
          "task": "Final product release and distribution readiness",
          "predecessor": "11.1.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-1112",
          "jobCode": "JOB-1112",
          "department": "Quality Assurance",
          "effort": "0",
          "duration": "0",
          "description": "Complete final product release and distribution readiness by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Quality Assurance specialists; Cross-functional review; Documented SOP",
          "planned": "652344",
          "assignedTo": "Quality Assurance",
          "assigned": "652344",
          "actual": "652344",
          "cost": "652344",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "11.1",
          "slNo": "11.1.3",
          "task": "Market launch and supply coordination",
          "predecessor": "11.1.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1113",
          "jobCode": "JOB-1113",
          "department": "Product Strategy / Commercial",
          "effort": "0",
          "duration": "0",
          "description": "Complete market launch and supply coordination by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Product Strategy / Commercial specialists; Cross-functional review; Documented SOP",
          "planned": "652481",
          "assignedTo": "Product Strategy",
          "assigned": "652481",
          "actual": "652481",
          "cost": "652481",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "11.1",
          "slNo": "11.1.4",
          "task": "Post-approval commitment tracking",
          "predecessor": "11.1.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1114",
          "jobCode": "JOB-1114",
          "department": "Product Strategy / Commercial",
          "effort": "0",
          "duration": "0",
          "description": "Complete post-approval commitment tracking by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Product Strategy / Commercial specialists; Cross-functional review; Documented SOP",
          "planned": "652618",
          "assignedTo": "Product Strategy",
          "assigned": "652618",
          "actual": "652618",
          "cost": "652618",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "11.1",
          "slNo": "11.1.5",
          "task": "Product quality complaint and pharmacovigilance handoff",
          "predecessor": "11.1.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1115",
          "jobCode": "JOB-1115",
          "department": "Product Strategy / Commercial",
          "effort": "0",
          "duration": "0",
          "description": "Complete product quality complaint and pharmacovigilance handoff by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Product Strategy / Commercial specialists; Cross-functional review; Documented SOP",
          "planned": "652755",
          "assignedTo": "Product Strategy",
          "assigned": "652755",
          "actual": "652755",
          "cost": "652755",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ],
      [
        {
          "deliverableSlNo": "11.2",
          "slNo": "11.2.1",
          "task": "Change control and post-approval variation assessment",
          "predecessor": "11.1.5 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1121",
          "jobCode": "JOB-1121",
          "department": "Executive / Portfolio Committee",
          "effort": "0",
          "duration": "0",
          "description": "Complete change control and post-approval variation assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Executive / Portfolio Committee specialists; Cross-functional review; Documented SOP",
          "planned": "653577",
          "assignedTo": "Executive",
          "assigned": "653577",
          "actual": "653577",
          "cost": "653577",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "11.2",
          "slNo": "11.2.2",
          "task": "Ongoing stability program management",
          "predecessor": "11.2.1 (SS)",
          "applicability": "All Products",
          "taskCode": "TC-1122",
          "jobCode": "JOB-1122",
          "department": "QC Stability",
          "effort": "0",
          "duration": "0",
          "description": "Complete ongoing stability program management by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "QC Stability specialists; Cross-functional review; Documented SOP",
          "planned": "653714",
          "assignedTo": "QC Stability",
          "assigned": "653714",
          "actual": "653714",
          "cost": "653714",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "11.2",
          "slNo": "11.2.3",
          "task": "Continued process verification and trending",
          "predecessor": "11.2.2 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1123",
          "jobCode": "JOB-1123",
          "department": "Executive / Portfolio Committee",
          "effort": "0",
          "duration": "0",
          "description": "Complete continued process verification and trending by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Executive / Portfolio Committee specialists; Cross-functional review; Documented SOP",
          "planned": "653851",
          "assignedTo": "Executive",
          "assigned": "653851",
          "actual": "653851",
          "cost": "653851",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "11.2",
          "slNo": "11.2.4",
          "task": "Supplier performance and quality monitoring",
          "predecessor": "11.2.3 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1124",
          "jobCode": "JOB-1124",
          "department": "Sourcing / Procurement",
          "effort": "0",
          "duration": "0",
          "description": "Complete supplier performance and quality monitoring by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Sourcing / Procurement specialists; Cross-functional review; Documented SOP",
          "planned": "653988",
          "assignedTo": "Sourcing",
          "assigned": "653988",
          "actual": "653988",
          "cost": "653988",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        },
        {
          "deliverableSlNo": "11.2",
          "slNo": "11.2.5",
          "task": "Product lifecycle and improvement review",
          "predecessor": "11.2.4 (FS)",
          "applicability": "All Products",
          "taskCode": "TC-1125",
          "jobCode": "JOB-1125",
          "department": "Executive / Portfolio Committee",
          "effort": "0",
          "duration": "0",
          "description": "Complete product lifecycle and improvement review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.",
          "procedure": "Executive / Portfolio Committee specialists; Cross-functional review; Documented SOP",
          "planned": "654125",
          "assignedTo": "Executive",
          "assigned": "654125",
          "actual": "654125",
          "cost": "654125",
          "worked": "0.00",
          "remaining": "0.00",
          "scheduled": "-",
          "date": "-",
          "status": "Scheduled",
          "submitted": "-"
        }
      ]
    ]
  }
};

  constructor() {
    // takeUntilDestroyed automatically unsubscribes when the component is destroyed
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      this.loadStageData();
    });
  }

  ngOnInit(): void {
    // Initialized via constructor subscription
  }

  goBack(): void {
    this.location.back();
  }

  private loadStageData(): void {
    const stageKey = this.stageCode?.trim() || 'S1';

    const nameMap: Record<string, string> = {
      // Pharma Stage Names (from Excel)
      'Opportunity and Portfolio Assessment': 'S1',
      'Product Definition and Project Charter': 'S2',
      'Formulation and Product Concept Development': 'S3',
      'API, Excipient and Supplier Sourcing': 'S4',
      'Formulation and Process Development': 'S5',
      'Development Batches and Verification': 'S6',
      'Facility, Equipment and Process Readiness': 'S7',
      'Analytical Validation and Technology Transfer': 'S8',
      'Registration and Process Validation Batches': 'S9',
      'Regulatory Submission and Approval': 'S10',
      'Commercial Launch and Lifecycle Management': 'S11',

      'Stage 1 (S1): Opportunity and Portfolio Assessment': 'S1',
      'Stage 2 (S2): Product Definition and Project Charter': 'S2',
      'Stage 3 (S3): Formulation and Product Concept Development': 'S3',
      'Stage 4 (S4): API, Excipient and Supplier Sourcing': 'S4',
      'Stage 5 (S5): Formulation and Process Development': 'S5',
      'Stage 6 (S6): Development Batches and Verification': 'S6',
      'Stage 7 (S7): Facility, Equipment and Process Readiness': 'S7',
      'Stage 8 (S8): Analytical Validation and Technology Transfer': 'S8',
      'Stage 9 (S9): Registration and Process Validation Batches': 'S9',
      'Stage 10 (S10): Regulatory Submission and Approval': 'S10',
      'Stage 11 (S11): Commercial Launch and Lifecycle Management': 'S11',
      // Legacy Stage Aliases (for backward compatibility)
      'Opportunity Assessment': 'S1',
      'Program Definition': 'S2',
      'Concept Development': 'S3',
      'Supplier Sourcing and Nomination': 'S4',
      'Detailed Engineering': 'S5',
      'Prototype Build and Verification': 'S6',
      'Tooling and Plant Readiness': 'S7',
      'Supplier Part Approval': 'S8',
      'Pre-Series Builds': 'S9',
      'Launch and Ramp-up': 'S11',

      // Full Titles
      'Stage 1 (S1): Opportunity Assessment': 'S1',
      'Stage 2 (S2): Program Definition': 'S2',
      'Stage 3 (S3): Concept Development': 'S3',
      'Stage 4 (S4): Supplier Sourcing and Nomination': 'S4',
      'Stage 5 (S5): Detailed Engineering': 'S5',
      'Stage 6 (S6): Prototype Build and Verification': 'S6',
      'Stage 7 (S7): Tooling and Plant Readiness': 'S7',
      'Stage 8 (S8): Supplier Part Approval': 'S8',
      'Stage 9 (S9): Pre-Series Builds': 'S9',
      'Stage 11 (S11): Launch and Ramp-up': 'S11',

      // Backward Compatibility
      'Business Case': 'S1',
      'Project Initiation': 'S2',
      'Product / Project In Initiation': 'S2',
      'Development Procurement': 'S3',
      'POC Formulation': 'S4',
      'Scale-Up & EB Procurement': 'S5',
      'API Validation': 'S6',
      'FP Validation': 'S7',
      'TTD Submission': 'S8',
      'Exhibit Batches': 'S9',
      'Pivotal BE': 'S10',
      'Dossier Filing': 'S11',
      'S0': 'S1'
    };

    let config = this.stageWbsMap[stageKey]
      || this.stageWbsMap[stageKey.toUpperCase()]
      || this.stageWbsMap[nameMap[stageKey]]
      || this.stageWbsMap[nameMap[this.stageName]]
      || this.stageWbsMap[this.stageName]
      || this.getFallbackStageConfig(this.stageName, this.stageCode);

    // Deep copy data so edits only apply locally and ensure requirements/tasks are assigned
    this.sidebarMenus = config.sidebarMenus.map(m => ({ ...m }));
    this.modulesData = config.modulesData.map((mod, modIdx) =>
      mod.map((t, taskIdx) => {
        const copy: WbsTask = { ...t };
        if (!copy.requirements) {
          copy.requirements = this.getDefaultRequirements(modIdx, taskIdx);
        } else if (typeof copy.requirements === 'string' && copy.requirements.includes('/')) {
          copy.requirements = copy.requirements.split('/')[0];
        }
        if (!copy.tasks) {
          copy.tasks = this.getDefaultTasks(modIdx, taskIdx);
        } else if (typeof copy.tasks === 'string' && copy.tasks.includes('/')) {
          copy.tasks = copy.tasks.split('/')[0];
        }
        if (!copy.historyCount) {
          copy.historyCount = this.getHistoryCount(taskIdx);
        }
        if (!copy.updatedDate) {
          const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20', '2026-01-15', '2026-01-10'];
          copy.updatedDate = sampleDates[(modIdx * 3 + taskIdx) % sampleDates.length];
        }
        if (!copy.updatedBy) {
          copy.updatedBy = copy.assignedTo || 'Dr. Sarah Jenkins';
        }
        return copy;
      })
    );

    // Sync menu counts
    this.sidebarMenus.forEach((menu, i) => {
      menu.count = this.modulesData[i]?.length || 0;
    });

    this.selectedMenuIndex = 0;
    this.sidebarMenus.forEach((m, idx) => m.isOpen = idx === 0);
    this.tableData = this.modulesData[0] || [];
    this.totalItems = this.tableData.length;
    this.pageIndex = 0;
    this.updatePaginatedData();
  }

  private getFallbackStageConfig(name: string, code: string): StageWbsConfig {
    return {
      sidebarMenus: [
        { slNo: '1.1', name: `${name} Planning & Setup`, count: 0, isOpen: true }
      ],
      modulesData: [[]]
    };
  }

  private getDefaultRequirements(modIdx: number, taskIdx: number): string {
    const numbers = ['7', '8', '9', '1', '2', '3', '4', '5', '6', '10', '11', '12', '13'];
    const index = (modIdx * 3 + taskIdx * 2) % numbers.length;
    return numbers[index];
  }

  private getDefaultTasks(modIdx: number, taskIdx: number): string {
    const numbers = ['8', '1', '7', '9', '5', '12', '4', '6', '3', '10', '2', '11', '13'];
    const index = (modIdx * 3 + taskIdx * 2 + 1) % numbers.length;
    return numbers[index];
  }

  selectMenu(index: number): void {
    this.selectedMenuIndex = index;
    this.sidebarMenus.forEach((menu, i) => {
      menu.isOpen = (i === index) ? !menu.isOpen : false;
    });
    this.tableData = this.modulesData[index] || [];
    this.pageIndex = 0;
    this.totalItems = this.tableData.length;
    this.updatePaginatedData();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.tableData.slice(startIndex, startIndex + this.pageSize);
  }

  openAddDeliverableDialog(): void {
    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      data: {
        stage: this.stageName,
        sequence: '1.2',
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.deliverableName) {
        const nextSlNo = result.stage || `${this.stageCode}.${this.sidebarMenus.length + 1}`;
        this.sidebarMenus.push({
          slNo: nextSlNo,
          name: result.deliverableName,
          count: 0,
          isOpen: false
        });
        this.modulesData.push([]);
      }
    });
  }

  onDeliverableDrop(event: CdkDragDrop<SidebarMenu[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    const currentSelected = this.sidebarMenus[this.selectedMenuIndex];

    moveItemInArray(this.sidebarMenus, event.previousIndex, event.currentIndex);
    moveItemInArray(this.modulesData, event.previousIndex, event.currentIndex);

    if (currentSelected) {
      this.selectedMenuIndex = this.sidebarMenus.indexOf(currentSelected);
    }

    this.tableData = this.modulesData[this.selectedMenuIndex] || [];
    this.totalItems = this.tableData.length;
    this.updatePaginatedData();
  }

  editDeliverable(menu: SidebarMenu, index: number, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      data: {
        stage: this.stageName,
        sequence: menu.slNo,
        name: menu.name,
        deliverableName: menu.name,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.deliverableName) {
        menu.name = result.deliverableName;
        if (result.stage) {
          menu.slNo = result.stage;
          if (this.modulesData[index]) {
            this.modulesData[index].forEach(task => {
              task.deliverableSlNo = result.stage;
            });
          }
        }
      }
    });
  }

  deleteDeliverable(menu: SidebarMenu, index: number, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: menu
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.sidebarMenus.splice(index, 1);
        this.modulesData.splice(index, 1);

        if (this.selectedMenuIndex >= this.sidebarMenus.length) {
          this.selectedMenuIndex = Math.max(0, this.sidebarMenus.length - 1);
        }

        if (this.sidebarMenus.length > 0) {
          this.sidebarMenus.forEach((m, i) => {
            m.isOpen = (i === this.selectedMenuIndex);
          });
          this.tableData = this.modulesData[this.selectedMenuIndex] || [];
        } else {
          this.tableData = [];
        }

        this.pageIndex = 0;
        this.totalItems = this.tableData.length;
        this.updatePaginatedData();
      }
    });
  }

  openAddActivityDialog(): void {
    const deliverableNames = this.sidebarMenus.map(m => m.name);
    const currentDeliverable = this.sidebarMenus[this.selectedMenuIndex]?.name || deliverableNames[0] || '';

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        stage: this.stageName,
        deliverable: currentDeliverable,
        deliverables: deliverableNames,
        department: 'R&D',
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.activityName) {
        const nextId = this.tableData.length + 1;
        const parentSl = this.sidebarMenus[this.selectedMenuIndex]?.slNo || `1.${this.selectedMenuIndex + 1}`;
        const taskSlNo = `${parentSl}.${nextId}`;

        const newTask: WbsTask = {
          deliverableSlNo: parentSl,
          slNo: taskSlNo,
          task: result.activityName,
          activityCode: result.activityCode || `ACT-${this.selectedMenuIndex + 1}0${nextId}`,
          department: result.department || 'R&D',
          predecessor: result.predecessor || '—',
          predecessorsData: result.predecessors || result.predecessorsData,
          applicability: result.applicability || 'All Products',
          taskCode: `TC-${this.selectedMenuIndex + 1}0${nextId}`,
          jobCode: `JOB${nextId}`,
          effort: result.planEffort || '0',
          duration: result.planDuration || '0',
          description: result.description || '',
          procedure: 'Standard SOP',
          planned: '0.00',
          assignedTo: result.department || 'Unassigned',
          assigned: '0.00',
          actual: '0.00',
          cost: result.materialBudget || '0.00',
          worked: '0.00',
          remaining: '0.00',
          scheduled: '-',
          date: '-',
          status: 'Scheduled',
          submitted: '-',
          requirements: `${Math.floor(Math.random() * 13) + 1}`,
          tasks: `${Math.floor(Math.random() * 13) + 1}/14`
        };

        this.tableData.push(newTask);
        this.modulesData[this.selectedMenuIndex] = this.tableData;
        this.sidebarMenus[this.selectedMenuIndex].count = this.tableData.length;
        this.totalItems = this.tableData.length;
        this.updatePaginatedData();
      }
    });
  }

  openEditActivityDialog(row: WbsTask): void {
    const deliverableNames = this.sidebarMenus.map(m => m.name);
    const currentDeliverable = this.sidebarMenus[this.selectedMenuIndex]?.name || deliverableNames[0] || '';

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        stage: this.stageName,
        deliverable: currentDeliverable,
        deliverables: deliverableNames,
        activityName: row.task,
        activityCode: row.activityCode || row.taskCode,
        department: row.department || 'R&D',
        applicability: row.applicability,
        description: row.description,
        planDuration: row.duration,
        planEffort: row.effort,
        materialBudget: row.cost,
        predecessor: row.predecessor !== '—' ? row.predecessor : '',
        predecessorsData: row.predecessorsData,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.activityName) row.task = result.activityName;
        if (result.activityCode !== undefined) row.activityCode = result.activityCode;
        if (result.department !== undefined) row.department = result.department;
        if (result.applicability !== undefined) row.applicability = result.applicability;
        if (result.description !== undefined) row.description = result.description;
        if (result.planEffort !== undefined) row.effort = result.planEffort;
        if (result.planDuration !== undefined) row.duration = result.planDuration;
        if (result.materialBudget !== undefined) row.cost = result.materialBudget;
        if (result.predecessor !== undefined) row.predecessor = result.predecessor || '—';
        if (result.predecessors !== undefined) row.predecessorsData = result.predecessors;
        this.updatePaginatedData();
      }
    });
  }

  deleteTask(row: WbsTask): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: row
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const index = this.tableData.indexOf(row);
        if (index > -1) {
          this.tableData.splice(index, 1);
          this.modulesData[this.selectedMenuIndex] = this.tableData;
          this.sidebarMenus[this.selectedMenuIndex].count = this.tableData.length;
          this.totalItems = this.tableData.length;
          this.updatePaginatedData();
        }
      }
    });
  }

  openfilepop(): void {
    
  }

  scrollLeft(): void {
    this.scrollTable('left');
  }

  scrollRight(): void {
    this.scrollTable('right');
  }

  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }

  onTableScroll(): void {
    this.updateScrollButtons();
  }

  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }








  assignrequirement(row?: WbsTask): void {
    const dialogRef = this.dialog.open(AssignRequirementsComponent, {
      width: '700px',
      maxWidth: '95vw',
      height: 'auto',
      data: { mode: 'add', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        row.requirements = result.count !== undefined ? String(result.count) : row.requirements;
        if (result.requirements) {
          (row as any).requirementsData = result.requirements;
        }
        this.updatePaginatedData();
      }
    });
  }


  assigntasks(row?: WbsTask): void {
    const dialogRef = this.dialog.open(AssignTasksComponent, {
      width: '850px',
      maxWidth: '95vw',
      height: 'auto',
      data: { mode: 'add', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        row.tasks = result.count !== undefined ? String(result.count) : row.tasks;
        if (result.tasks) {
          row.tasksData = result.tasks;
        }
        this.updatePaginatedData();
      }
    });
  }

  openPredecessor(row?: WbsTask): void {
    const dialogRef = this.dialog.open(StagesPredecessorComponent, {
      width: '950px',
      maxWidth: '100vw',
      height: 'auto',
      data: { mode: 'edit', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        if (result.predecessors) {
          row.predecessorsData = result.predecessors;
        }
        if (result.predecessor !== undefined) {
          row.predecessor = String(result.predecessor);
        }
        this.updatePaginatedData();
      }
    });
  }

  openHistory(row: WbsTask, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.router.navigate(['/stages/wbs/history'], {
      queryParams: {
        slNo: row.slNo,
        task: row.task,
        activityCode: row.activityCode || row.taskCode || '',
        tasks: row.tasks || '',
        requirements: row.requirements || '',
        predecessor: row.predecessor || '',
        duration: row.duration || '',
        effort: row.effort || '',
        cost: row.cost || '',
        applicability: row.applicability || 'All Products',
        description: row.description || '',
        stageCode: this.stageCode,
        stageName: this.stageName,
        gateCode: this.gateCode,
        deliverableSlNo: row.deliverableSlNo,
        historyCount: historyCount
      },
      queryParamsHandling: 'merge'
    });
  }

  openDescription(row: WbsTask): void {
    this.dialog.open(DescriptionDialogComponent, {
      width: '620px',
      maxWidth: '90vw',
      data: {
        title: row.task,
        code: row.slNo,
        type: 'Activity',
        description: row.description
      }
    });
  }

  openDeliverableDescription(menu: SidebarMenu, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.dialog.open(DescriptionDialogComponent, {
      width: '620px',
      maxWidth: '90vw',
      data: {
        title: menu.name,
        code: menu.slNo,
        type: 'Deliverable',
        description: menu.description || 'Deliverable description not available.'
      }
    });
  }

}
