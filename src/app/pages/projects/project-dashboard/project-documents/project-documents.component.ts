import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AddDocumentComponent } from './add-document/add-document.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';
import { ViewDocsComponent } from './view-docs/view-docs.component';
import { INDUSTRIAL_STAGES_MASTER, INDUSTRIAL_STAGES_WBS_MAP } from '../../../stages/industrial-stages.data';

export interface TaskDocumentItem {
  id: string | number;
  stageName: string;
  deliverableName: string;
  activityName: string;
  taskName: string;
  documentsCount: number;
  documents?: { id: number; title: string; uploadedDate?: string }[];
}

export interface GateDocumentItem {
  id: string | number;
  gateCode: string;
  gateName: string;
  documentTitle: string;
  uploadedDate?: string;
  uploadedBy?: string;
}

export interface ActivityNode {
  id: string | number;
  name: string;
  jobCode?: string;
  tasks: TaskDocumentItem[];
}

export interface DeliverableNode {
  id: string | number;
  name: string;
  expanded?: boolean;
  activities: ActivityNode[];
}

export interface StageNode {
  id: string | number;
  type: 'stage';
  stageCode: string;
  stageName: string;
  gateCode?: string;
  expanded?: boolean;
  deliverables: DeliverableNode[];
}

export interface GateNode {
  id: string | number;
  type: 'gate';
  gateCode: string;
  gateName: string;
  documents: GateDocumentItem[];
}

export type TreeNode = StageNode | GateNode;

const INDUSTRIAL_GATE_DOCUMENTS_MAP: Record<string, GateNode> = {
  'Gate 1': {
    id: 'G1',
    type: 'gate',
    gateCode: 'Gate 1',
    gateName: 'Business Case Approval',
    documents: [
      { id: 'GD1-1', gateCode: 'Gate 1', gateName: 'Business Case Approval', documentTitle: 'User Requirements Specification (URS) Baseline Dossier', uploadedDate: '2026-02-05', uploadedBy: 'Ananya Rao' },
      { id: 'GD1-2', gateCode: 'Gate 1', gateName: 'Business Case Approval', documentTitle: 'Plant Throughput & Bottleneck Capacity Audit Report', uploadedDate: '2026-02-08', uploadedBy: 'Rajesh Kumar' },
      { id: 'GD1-3', gateCode: 'Gate 1', gateName: 'Business Case Approval', documentTitle: 'Preliminary CapEx / OpEx & ROI Financial Model', uploadedDate: '2026-02-12', uploadedBy: 'Priya Reddy' },
      { id: 'GD1-4', gateCode: 'Gate 1', gateName: 'Business Case Approval', documentTitle: 'CE / ISO Machine Safety Statutory Pathway Assessment', uploadedDate: '2026-02-14', uploadedBy: 'Amit Patel' },
      { id: 'GD1-5', gateCode: 'Gate 1', gateName: 'Business Case Approval', documentTitle: 'Steering Committee Gate 1 Charter Sign-Off Minutes', uploadedDate: '2026-02-15', uploadedBy: 'Executive Board' }
    ]
  },
  'Gate 2': {
    id: 'G2',
    type: 'gate',
    gateCode: 'Gate 2',
    gateName: 'Concept Selection & Design Freeze',
    documents: [
      { id: 'GD2-1', gateCode: 'Gate 2', gateName: 'Concept Selection & Design Freeze', documentTitle: '3D CAD As-Built Concept Assembly & P&ID Package', uploadedDate: '2026-05-02', uploadedBy: 'Anita Desai' },
      { id: 'GD2-2', gateCode: 'Gate 2', gateName: 'Concept Selection & Design Freeze', documentTitle: 'Design FMEA & HAZOP Machine Safety Risk Matrix', uploadedDate: '2026-05-04', uploadedBy: 'Deepa Nair' },
      { id: 'GD2-3', gateCode: 'Gate 2', gateName: 'Concept Selection & Design Freeze', documentTitle: 'PLC / HMI / SCADA Architecture & Safety Interlock Spec', uploadedDate: '2026-05-07', uploadedBy: 'Priya Reddy' },
      { id: 'GD2-4', gateCode: 'Gate 2', gateName: 'Concept Selection & Design Freeze', documentTitle: 'OEM Vendor Qualification & Turnkey Bid Award', uploadedDate: '2026-05-09', uploadedBy: 'Suresh Naidu' },
      { id: 'GD2-5', gateCode: 'Gate 2', gateName: 'Concept Selection & Design Freeze', documentTitle: 'Gate 2 Design Freeze & CapEx Execution Authorization', uploadedDate: '2026-05-10', uploadedBy: 'Engineering Review Board' }
    ]
  },
  'Gate 3': {
    id: 'G3',
    type: 'gate',
    gateCode: 'Gate 3',
    gateName: 'Procurement & Build Readiness',
    documents: [
      { id: 'GD3-1', gateCode: 'Gate 3', gateName: 'Procurement & Build Readiness', documentTitle: 'Prototype Tooling & Subassembly Endurance Trial Report', uploadedDate: '2026-10-08', uploadedBy: 'Suresh Naidu' },
      { id: 'GD3-2', gateCode: 'Gate 3', gateName: 'Procurement & Build Readiness', documentTitle: 'Factory Acceptance Test (FAT) Witness Protocol & Sign-Off', uploadedDate: '2026-10-12', uploadedBy: 'Amit Patel' },
      { id: 'GD3-3', gateCode: 'Gate 3', gateName: 'Procurement & Build Readiness', documentTitle: 'NIST / NABL Metrology & Instrument Calibration Package', uploadedDate: '2026-10-15', uploadedBy: 'Deepa Nair' },
      { id: 'GD3-4', gateCode: 'Gate 3', gateName: 'Procurement & Build Readiness', documentTitle: 'Bay 2 Foundation, Utility Tie-Ins & Rigging Plan', uploadedDate: '2026-10-18', uploadedBy: 'Arun Joseph' },
      { id: 'GD3-5', gateCode: 'Gate 3', gateName: 'Procurement & Build Readiness', documentTitle: 'Gate 3 Shipment Clearance & Site Installation Authorization', uploadedDate: '2026-10-20', uploadedBy: 'Program Steering Committee' }
    ]
  },
  'Gate 4': {
    id: 'G4',
    type: 'gate',
    gateCode: 'Gate 4',
    gateName: 'Commissioning & Performance Acceptance',
    documents: [
      { id: 'GD4-1', gateCode: 'Gate 4', gateName: 'Commissioning & Performance Acceptance', documentTitle: 'Installation Qualification (IQ) & Laser Alignment Report', uploadedDate: '2027-04-12', uploadedBy: 'Arun Joseph' },
      { id: 'GD4-2', gateCode: 'Gate 4', gateName: 'Commissioning & Performance Acceptance', documentTitle: 'Site Acceptance Test (SAT) Cycle-Time & Cpk Run-Off Log', uploadedDate: '2027-04-16', uploadedBy: 'Amit Patel' },
      { id: 'GD4-3', gateCode: 'Gate 4', gateName: 'Commissioning & Performance Acceptance', documentTitle: '72-Hour Continuous OEE >= 85% Endurance Report', uploadedDate: '2027-04-20', uploadedBy: 'Rajesh Kumar' },
      { id: 'GD4-4', gateCode: 'Gate 4', gateName: 'Commissioning & Performance Acceptance', documentTitle: 'EHS Machine Guarding, Noise (< 78 dBA) & LOTO Clearance', uploadedDate: '2027-04-22', uploadedBy: 'Lakshmi Devi' },
      { id: 'GD4-5', gateCode: 'Gate 4', gateName: 'Commissioning & Performance Acceptance', documentTitle: 'Gate 4 Commissioning Acceptance Certificate', uploadedDate: '2027-04-25', uploadedBy: 'Plant Operations Director' }
    ]
  },
  'Gate 5': {
    id: 'G5',
    type: 'gate',
    gateCode: 'Gate 5',
    gateName: 'Operational Handover Approval',
    documents: [
      { id: 'GD5-1', gateCode: 'Gate 5', gateName: 'Operational Handover Approval', documentTitle: 'Operational Qualification (OQ) 3-Shift Validation Summary', uploadedDate: '2027-08-18', uploadedBy: 'Deepa Nair' },
      { id: 'GD5-2', gateCode: 'Gate 5', gateName: 'Operational Handover Approval', documentTitle: 'As-Built CAD, EPLAN & PLC Golden-Master Backup Dossier', uploadedDate: '2027-08-22', uploadedBy: 'Priya Reddy' },
      { id: 'GD5-3', gateCode: 'Gate 5', gateName: 'Operational Handover Approval', documentTitle: 'Critical Spare Parts Min/Max & CMMS PM Schedule Upload', uploadedDate: '2027-08-25', uploadedBy: 'Suresh Naidu' },
      { id: 'GD5-4', gateCode: 'Gate 5', gateName: 'Operational Handover Approval', documentTitle: 'Operator & Maintenance Technician LOTO Certification Log', uploadedDate: '2027-08-28', uploadedBy: 'Lakshmi Devi' },
      { id: 'GD5-5', gateCode: 'Gate 5', gateName: 'Operational Handover Approval', documentTitle: 'Final Plant Operations Handover & Capital Closeout Sign-Off', uploadedDate: '2027-08-31', uploadedBy: 'Global Executive Board' }
    ]
  }
};

@Component({
  selector: 'app-project-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './project-documents.component.html',
  styleUrl: './project-documents.component.scss'
})
export class ProjectDocumentsComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = 'Industrial Equipment Line Expansion';
  projectCode: string = '2026/IND/001';

  // Filter dropdown: All, Stages, Gates
  selectedFilter: 'All' | 'Stages' | 'Gates' = 'All';

  // Tree Nodes
  allTreeNodes: TreeNode[] = [];
  filteredTreeNodes: TreeNode[] = [];

  // Currently selected item: can be 'stage', 'deliverable', 'activity', or 'gate'
  selectedItemType: 'stage' | 'deliverable' | 'activity' | 'gate' = 'stage';
  selectedStage: StageNode | null = null;
  selectedDeliverable: DeliverableNode | null = null;
  selectedActivity: ActivityNode | null = null;
  selectedGate: GateNode | null = null;

  // Active table datasets
  currentActivityTasks: TaskDocumentItem[] = [];
  filteredActivityTasks: TaskDocumentItem[] = [];

  currentGateDocuments: GateDocumentItem[] = [];
  filteredGateDocuments: GateDocumentItem[] = [];

  // Search keyword for table rows
  tableSearchKeyword: string = '';

  // Pagination matching AssetsComponent
  pageIndex: number = 0;
  pageSize: number = 10;

  get paginatedActivityTasks(): TaskDocumentItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredActivityTasks.slice(startIndex, startIndex + this.pageSize);
  }

  get paginatedGateDocuments(): GateDocumentItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredGateDocuments.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
    });

    this.initMasterTreeData();
    this.applyTreeFilter();

    // Default select Stage 1 so all its tasks appear in the grid
    this.setDefaultSelection();
  }

  private initMasterTreeData(): void {
    const nodes: TreeNode[] = [];

    INDUSTRIAL_STAGES_MASTER.forEach((stage, sIdx) => {
      const wbs = INDUSTRIAL_STAGES_WBS_MAP[stage.stageCode];
      const deliverables: DeliverableNode[] = (wbs?.sidebarMenus || []).map((menu, dIdx) => {
        const wbsTasks = wbs?.modulesData?.[dIdx] || [];
        const activities: ActivityNode[] = wbsTasks.map((act, aIdx) => {
          const baseName = act.task;
          const sanitized = baseName.replace(/[^a-zA-Z0-9]+/g, '_');
          return {
            id: `A${sIdx + 1}-${dIdx + 1}-${aIdx + 1}`,
            name: baseName,
            jobCode: act.jobCode,
            tasks: [
              {
                id: `T${sIdx + 1}-${dIdx + 1}-${aIdx + 1}-1`,
                stageName: stage.stageName,
                deliverableName: menu.name,
                activityName: baseName,
                taskName: `${baseName} — Technical Specification & Protocol`,
                documentsCount: 2 + ((sIdx + dIdx + aIdx) % 3),
                documents: [
                  { id: 1, title: `${sanitized}_Specification.pdf`, uploadedDate: '2026-02-10' },
                  { id: 2, title: `${sanitized}_Approval_Record.pdf`, uploadedDate: '2026-02-14' }
                ]
              },
              {
                id: `T${sIdx + 1}-${dIdx + 1}-${aIdx + 1}-2`,
                stageName: stage.stageName,
                deliverableName: menu.name,
                activityName: baseName,
                taskName: `${baseName} — Verification & Sign-Off Evidence`,
                documentsCount: 1 + ((sIdx + aIdx) % 3),
                documents: [
                  { id: 1, title: `${sanitized}_Verification_Log.pdf`, uploadedDate: '2026-02-18' }
                ]
              }
            ]
          };
        });

        return {
          id: `D${sIdx + 1}-${dIdx + 1}`,
          name: menu.name,
          expanded: sIdx === 0 && dIdx === 0,
          activities
        };
      });

      const stageNode: StageNode = {
        id: stage.stageCode,
        type: 'stage',
        stageCode: stage.stageCode,
        stageName: stage.stageName,
        gateCode: stage.gateCode !== '-' ? stage.gateCode : undefined,
        expanded: sIdx === 0,
        deliverables
      };
      nodes.push(stageNode);

      const gateNode = INDUSTRIAL_GATE_DOCUMENTS_MAP[stage.gateCode];
      if (gateNode) {
        nodes.push(gateNode);
      }
    });

    this.allTreeNodes = nodes;
  }

  onFilterChange(): void {
    this.applyTreeFilter();
  }

  private applyTreeFilter(): void {
    if (this.selectedFilter === 'All') {
      this.filteredTreeNodes = [...this.allTreeNodes];
    } else if (this.selectedFilter === 'Stages') {
      this.filteredTreeNodes = this.allTreeNodes.filter(node => node.type === 'stage');
    } else if (this.selectedFilter === 'Gates') {
      this.filteredTreeNodes = this.allTreeNodes.filter(node => node.type === 'gate');
    }

    // Ensure valid current selection after filtering
    if (this.selectedFilter === 'Gates' && this.selectedItemType !== 'gate') {
      const firstGate = this.filteredTreeNodes.find(n => n.type === 'gate') as GateNode;
      if (firstGate) {
        this.selectGate(firstGate);
      }
    } else if (this.selectedFilter === 'Stages' && this.selectedItemType === 'gate') {
      const firstStage = this.filteredTreeNodes.find(n => n.type === 'stage') as StageNode;
      if (firstStage) {
        this.selectStage(firstStage, false);
      }
    }
  }

  private setDefaultSelection(): void {
    const stage1 = this.allTreeNodes[0] as StageNode;
    if (stage1) {
      stage1.expanded = true;
      if (stage1.deliverables.length > 0) {
        stage1.deliverables[0].expanded = true;
      }
      this.selectStage(stage1, false);
    }
  }

  // Click on Stage button: selects Stage and loads ALL its tasks across all deliverables & activities
  selectStage(stage: StageNode, toggle: boolean = true): void {
    if (toggle) {
      stage.expanded = !stage.expanded;
    } else {
      stage.expanded = true;
    }
    this.selectedItemType = 'stage';
    this.selectedStage = stage;
    this.selectedDeliverable = null;
    this.selectedActivity = null;
    this.selectedGate = null;

    // Aggregate all tasks across all deliverables and activities in this stage
    const allStageTasks: TaskDocumentItem[] = [];
    stage.deliverables?.forEach(deliv => {
      deliv.activities?.forEach(act => {
        if (act.tasks) {
          allStageTasks.push(...act.tasks);
        }
      });
    });
    this.currentActivityTasks = allStageTasks;
    this.pageIndex = 0;
    this.filterTableData();
  }

  // Toggle stage expand/collapse specifically from the chevron arrow
  toggleStageArrow(event: Event, stage: StageNode): void {
    event.stopPropagation();
    stage.expanded = !stage.expanded;
  }

  // Click on Deliverable button: selects Deliverable and loads ALL its tasks across all activities
  selectDeliverable(deliv: DeliverableNode, stage: StageNode, toggle: boolean = true): void {
    if (toggle) {
      deliv.expanded = !deliv.expanded;
    } else {
      deliv.expanded = true;
    }
    this.selectedItemType = 'deliverable';
    this.selectedStage = stage;
    this.selectedDeliverable = deliv;
    this.selectedActivity = null;
    this.selectedGate = null;

    // Aggregate all tasks across all activities in this deliverable
    const allDelivTasks: TaskDocumentItem[] = [];
    deliv.activities?.forEach(act => {
      if (act.tasks) {
        allDelivTasks.push(...act.tasks);
      }
    });
    this.currentActivityTasks = allDelivTasks;
    this.pageIndex = 0;
    this.filterTableData();
  }

  // Toggle deliverable expand/collapse specifically from the chevron arrow
  toggleDeliverableArrow(event: Event, deliv: DeliverableNode): void {
    event.stopPropagation();
    deliv.expanded = !deliv.expanded;
  }

  // Click on Activity button: selects Activity and displays its tasks
  selectActivity(act: ActivityNode, deliv: DeliverableNode, stage: StageNode): void {
    this.selectedItemType = 'activity';
    this.selectedStage = stage;
    this.selectedDeliverable = deliv;
    this.selectedActivity = act;
    this.selectedGate = null;
    this.currentActivityTasks = act.tasks || [];
    this.pageIndex = 0;
    this.filterTableData();
  }

  // Click on Gate button: selects Gate and displays its documents
  selectGate(gate: GateNode): void {
    this.selectedItemType = 'gate';
    this.selectedGate = gate;
    this.selectedStage = null;
    this.selectedDeliverable = null;
    this.selectedActivity = null;
    this.currentGateDocuments = gate.documents || [];
    this.pageIndex = 0;
    this.filterTableData();
  }

  // Filter table rows by search keyword
  filterTableData(): void {
    const kw = this.tableSearchKeyword.toLowerCase().trim();
    if (this.selectedItemType === 'gate') {
      if (!kw) {
        this.filteredGateDocuments = [...this.currentGateDocuments];
      } else {
        this.filteredGateDocuments = this.currentGateDocuments.filter(doc =>
          doc.gateName.toLowerCase().includes(kw) ||
          doc.gateCode.toLowerCase().includes(kw) ||
          doc.documentTitle.toLowerCase().includes(kw)
        );
      }
    } else {
      if (!kw) {
        this.filteredActivityTasks = [...this.currentActivityTasks];
      } else {
        this.filteredActivityTasks = this.currentActivityTasks.filter(item =>
          item.stageName.toLowerCase().includes(kw) ||
          item.deliverableName.toLowerCase().includes(kw) ||
          item.activityName.toLowerCase().includes(kw) ||
          item.taskName.toLowerCase().includes(kw) ||
          String(item.documentsCount).includes(kw)
        );
      }
    }
  }

  clearSearch(): void {
    this.tableSearchKeyword = '';
    this.filterTableData();
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // Click on task documents count (opens ViewDocsComponent)
  openTaskDocuments(task?: TaskDocumentItem): void {
    this.dialog.open(ViewDocsComponent, {
      width: '750px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }

  // Click on View icon in gate documents table (directly opens sample PDF)
  viewGateDocument(doc?: GateDocumentItem): void {
    window.open('/sample.pdf', '_blank');
  }

  // Upload Document dialog
  uploaddoc(): void {
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      height: 'auto',
      width: '850px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        if (this.selectedItemType === 'gate' && this.selectedGate) {
          const newGateDoc: GateDocumentItem = {
            id: 'GD-NEW-' + Date.now(),
            gateCode: this.selectedGate.gateCode,
            gateName: this.selectedGate.gateName,
            documentTitle: data.documentTitle || 'New Gate Document',
            uploadedDate: new Date().toISOString().split('T')[0],
            uploadedBy: 'Ananya Rao'
          };
          this.currentGateDocuments.unshift(newGateDoc);
          this.filterTableData();
        } else {
          const newTask: TaskDocumentItem = {
            id: 'T-NEW-' + Date.now(),
            stageName: this.selectedStage?.stageName || 'Stage',
            deliverableName: this.selectedDeliverable?.name || 'Deliverable',
            activityName: this.selectedActivity?.name || 'General Activity',
            taskName: data.documentTitle || 'New Document Upload Task',
            documentsCount: 1,
            documents: [
              { id: 1, title: data.documentTitle || 'New_Upload.pdf', uploadedDate: new Date().toISOString().split('T')[0] }
            ]
          };
          this.currentActivityTasks.unshift(newTask);
          this.filterTableData();
        }
      }
    });
  }

  scrollRight(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollLeft(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || '2026/IND/001', name: this.projectName || 'Industrial Equipment Line Expansion' }
    });
  }
}
