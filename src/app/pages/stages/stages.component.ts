import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { AddStageComponent } from './add-stage/add-stage.component';
import { StageDivisionsComponent } from './stage-divisions/stage-divisions.component';
import { DeleteConfirmationComponent } from '../../common/shared/delete-confirmation/delete-confirmation.component';
import { DescriptionDialogComponent } from '../../common/shared/description-dialog/description-dialog.component';

export interface Stage {
  phase: string;
  description: string;
  tasks: number;
  status: 'Active' | 'Pending' | 'Inactive';
  stageCode: string;
  stageName: string;
  division?: string;
  divisions?: string[];
  stageSerial?: number;
  sequence?: string;
  gateCode: string;
  stageDescription: string;
  planEffort: number;
  planDuration: number;
  materialBudget?: string;
  TotalUsed?: boolean;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-stages',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
    DragDropModule
  ],
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss']
})
export class StagesComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  // Permission Flags
  readonly canUpdate: boolean = true;
  readonly canDelete: boolean = true;

  // Pagination State
  totalSize: number = 0;
  pageIndex: number = 0;
  pageSize: number = 15;

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  // Master Data Array
  masterData: Stage[] = [
    {
        "sequence": "1.0",
        "phase": "Opportunity and Portfolio Assessment",
        "description": "Coordinate the pharmaceutical product development work for opportunity and portfolio assessment. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "tasks": 8,
        "status": "Active",
        "stageCode": "S1",
        "stageName": "Opportunity and Portfolio Assessment",
        "division": "Oral Solids - OS",
        "divisions": [
            "Oral Solids - OS"
        ],
        "gateCode": "Gate 1",
        "stageDescription": "Coordinate the pharmaceutical product development work for opportunity and portfolio assessment. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "planEffort": 80,
        "planDuration": 10,
        "materialBudget": "$15,000"
    },
    {
        "sequence": "2.0",
        "phase": "Product Definition and Project Charter",
        "description": "Coordinate the pharmaceutical product development work for product definition and project charter. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "tasks": 17,
        "status": "Active",
        "stageCode": "S2",
        "stageName": "Product Definition and Project Charter",
        "division": "Oral Solids - OS, Injectables - IJ",
        "divisions": [
            "Oral Solids - OS",
            "Injectables - IJ"
        ],
        "gateCode": "Gate 2",
        "stageDescription": "Coordinate the pharmaceutical product development work for product definition and project charter. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "planEffort": 60,
        "planDuration": 10,
        "materialBudget": "$25,000"
    },
    {
        "sequence": "3.0",
        "phase": "Formulation and Product Concept Development",
        "description": "Coordinate the pharmaceutical product development work for formulation and product concept development. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "tasks": 17,
        "status": "Active",
        "stageCode": "S3",
        "stageName": "Formulation and Product Concept Development",
        "division": "Oral Solids - OS",
        "divisions": [
            "Oral Solids - OS"
        ],
        "gateCode": "Gate 3",
        "stageDescription": "Coordinate the pharmaceutical product development work for formulation and product concept development. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "planEffort": 120,
        "planDuration": 60,
        "materialBudget": "$80,000"
    },
    {
        "sequence": "4.0",
        "phase": "API, Excipient and Supplier Sourcing",
        "description": "Coordinate the pharmaceutical product development work for api, excipient and supplier sourcing. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "tasks": 7,
        "status": "Active",
        "stageCode": "S4",
        "stageName": "API, Excipient and Supplier Sourcing",
        "division": "Oral Solids - OS, Complex Injectables - CI",
        "divisions": [
            "Oral Solids - OS",
            "Complex Injectables - CI"
        ],
        "gateCode": "Gate 4",
        "stageDescription": "Coordinate the pharmaceutical product development work for api, excipient and supplier sourcing. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "planEffort": 160,
        "planDuration": 190,
        "materialBudget": "$120,000"
    },
    {
        "sequence": "5.0",
        "phase": "Formulation and Process Development",
        "description": "Coordinate the pharmaceutical product development work for formulation and process development. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "tasks": 26,
        "status": "Active",
        "stageCode": "S5",
        "stageName": "Formulation and Process Development",
        "division": "Oral Solids - OS",
        "divisions": [
            "Oral Solids - OS"
        ],
        "gateCode": "-",
        "stageDescription": "Coordinate the pharmaceutical product development work for formulation and process development. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "planEffort": 100,
        "planDuration": 60,
        "materialBudget": "$95,000"
    },
    {
        "sequence": "6.0",
        "phase": "Development Batches and Verification",
        "description": "Coordinate the pharmaceutical product development work for development batches and verification. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "tasks": 13,
        "status": "Active",
        "stageCode": "S6",
        "stageName": "Development Batches and Verification",
        "division": "Oral Solids - OS, Biotech - BT",
        "divisions": [
            "Oral Solids - OS",
            "Biotech - BT"
        ],
        "gateCode": "-",
        "stageDescription": "Coordinate the pharmaceutical product development work for development batches and verification. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "planEffort": 180,
        "planDuration": 60,
        "materialBudget": "$110,000"
    },
    {
        "sequence": "7.0",
        "phase": "Facility, Equipment and Process Readiness",
        "description": "Coordinate the pharmaceutical product development work for facility, equipment and process readiness. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "tasks": 12,
        "status": "Active",
        "stageCode": "S7",
        "stageName": "Facility, Equipment and Process Readiness",
        "division": "Oral Solids - OS",
        "divisions": [
            "Oral Solids - OS"
        ],
        "gateCode": "Gate 5",
        "stageDescription": "Coordinate the pharmaceutical product development work for facility, equipment and process readiness. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "planEffort": 90,
        "planDuration": 30,
        "materialBudget": "$45,000"
    },
    {
        "sequence": "8.0",
        "phase": "Analytical Validation and Technology Transfer",
        "description": "Coordinate the pharmaceutical product development work for analytical validation and technology transfer. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "tasks": 8,
        "status": "Active",
        "stageCode": "S8",
        "stageName": "Analytical Validation and Technology Transfer",
        "division": "Oral Solids - OS, Injectables - IJ, Biotech - BT",
        "divisions": [
            "Oral Solids - OS",
            "Injectables - IJ",
            "Biotech - BT"
        ],
        "gateCode": "-",
        "stageDescription": "Coordinate the pharmaceutical product development work for analytical validation and technology transfer. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "planEffort": 140,
        "planDuration": 60,
        "materialBudget": "$60,000"
    },
    {
        "sequence": "9.0",
        "phase": "Registration and Process Validation Batches",
        "description": "Coordinate the pharmaceutical product development work for registration and process validation batches. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "tasks": 11,
        "status": "Active",
        "stageCode": "S9",
        "stageName": "Registration and Process Validation Batches",
        "division": "Oral Solids - OS",
        "divisions": [
            "Oral Solids - OS"
        ],
        "gateCode": "Gate 6",
        "stageDescription": "Coordinate the pharmaceutical product development work for registration and process validation batches. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "planEffort": 100,
        "planDuration": 10,
        "materialBudget": "$30,000"
    },
    {
        "sequence": "10.0",
        "phase": "Regulatory Submission and Approval",
        "description": "Coordinate the pharmaceutical product development work for regulatory submission and approval. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "tasks": 9,
        "status": "Active",
        "stageCode": "S10",
        "stageName": "Regulatory Submission and Approval",
        "division": "Oral Solids - OS, Complex Injectables - CI",
        "divisions": [
            "Oral Solids - OS",
            "Complex Injectables - CI"
        ],
        "gateCode": "-",
        "stageDescription": "Coordinate the pharmaceutical product development work for regulatory submission and approval. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "planEffort": 200,
        "planDuration": 190,
        "materialBudget": "$180,000"
    },
    {
        "sequence": "11.0",
        "phase": "Commercial Launch and Lifecycle Management",
        "description": "Coordinate the pharmaceutical product development work for commercial launch and lifecycle management. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "tasks": 10,
        "status": "Active",
        "stageCode": "S11",
        "stageName": "Commercial Launch and Lifecycle Management",
        "division": "Oral Solids - OS",
        "divisions": [
            "Oral Solids - OS"
        ],
        "gateCode": "Gate 7",
        "stageDescription": "Coordinate the pharmaceutical product development work for commercial launch and lifecycle management. Manage cross-functional deliverables, activities, dependencies, resources, quality risks and reviews. Complete the required evidence and obtain stage-exit approval before progressing to the next governance checkpoint.",
        "planEffort": 150,
        "planDuration": 92,
        "materialBudget": "$140,000"
    }
];

  pagedData: Stage[] = [];

  ngOnInit(): void {
    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20', '2026-01-15', '2026-01-10', '2026-01-05', '2025-12-28'];
    const sampleUsers = ['Dr. Sarah Jenkins', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu', 'Amit Patel'];
    this.masterData.forEach((item, index) => {
      if (!item.historyCount) {
        item.historyCount = this.getHistoryCount(index);
      }
      if (!item.updatedDate) {
        item.updatedDate = sampleDates[index % sampleDates.length];
      }
      if (!item.updatedBy) {
        item.updatedBy = sampleUsers[index % sampleUsers.length];
      }
    });
    this.totalSize = this.masterData.length;
    this.updatePageData();
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePageData();
  }

  private updatePageData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.pagedData = this.masterData.slice(startIndex, startIndex + this.pageSize);
  }

  /**
   * Reorders rows using Angular CDK DragDrop and syncs the master array safely.
   */
  onDrop(event: CdkDragDrop<Stage[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    // Mutate the local paged view
    moveItemInArray(this.pagedData, event.previousIndex, event.currentIndex);

    // Sync back to the main master data array accurately
    const startIndex = this.pageIndex * this.pageSize;
    this.masterData.splice(startIndex, this.pageSize, ...this.pagedData);
    this.updatePageData();
  }

  // onStatusChange(item: Stage): void {
  //   const dialogRef = this.dialog.open(StatusConfirmationDialogComponent, {
  //     width: 'auto',
  //     data: {
  //       title: 'Change Status',
  //       content: `Are you sure you want to change the status of ${item.stageName}?`
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     if (confirmed) {
  //       item.status = item.status === 'Active' ? 'Pending' : 'Active';
  //     }
  //   });
  // }

  onAddStage(): void {
    const nextSerial = this.masterData.length + 1;
    const dialogRef = this.dialog.open(AddStageComponent, {
      width: '920px',
      maxWidth: '900px',
      autoFocus: false,
      data: {
        mode: 'add',
        stageSerial: nextSerial,
        stageCode: `S${nextSerial}`
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const nextId = result.stageSerial ? Number(result.stageSerial) : (this.masterData.length + 1);
        const newStage: Stage = {
          phase: result.stageName || '',
          description: result.stageDescription || '',
          tasks: 0,
          status: 'Active',
          stageCode: result.stageCode || `S${nextId}`,
          stageName: result.stageName || '',
          division: result.division || 'Oral Solids - OS',
          divisions: result.divisions || (result.division ? [result.division] : ['Oral Solids - OS']),
          stageSerial: nextId,
          sequence: `${nextId}.0`,
          gateCode: result.gateCode || '',
          stageDescription: result.stageDescription || '',
          planEffort: Number(result.planEffort) || 0,
          planDuration: Number(result.planDuration) || 0,
          materialBudget: result.materialBudget ? (String(result.materialBudget).startsWith('$') ? String(result.materialBudget) : `$${result.materialBudget}`) : '$0',
          historyCount: 1
        };

        this.masterData.unshift(newStage);
        this.totalSize = this.masterData.length;
        this.updatePageData();
      }
    });
  }

  getDivisionCount(item: Stage): number {
    if (item.divisions && item.divisions.length) {
      return item.divisions.length;
    }
    return item.division ? item.division.split(',').filter(Boolean).length : 0;
  }

  onDivisionClick(item: Stage): void {
    const currentSelected = item.divisions && item.divisions.length
      ? [...item.divisions]
      : (item.division ? item.division.split(',').map((d: string) => d.trim()).filter(Boolean) : []);

    const dialogRef = this.dialog.open(StageDivisionsComponent, {
      width: '520px',
      autoFocus: false,
      data: {
        stage: item,
        selectedDivisions: currentSelected
      }
    });

    dialogRef.afterClosed().subscribe((result: string[] | undefined) => {
      if (result) {
        item.divisions = result;
        item.division = result.join(', ');
      }
    });
  }

  onEditStage(item: Stage): void {
    if (!this.canUpdate) return;

    const dialogRef = this.dialog.open(AddStageComponent, {
      width: '920px',
      maxWidth: '900px',
      autoFocus: false,
      data: {
        mode: 'edit',
        stageSerial: item.stageSerial || parseInt(item.stageCode.replace(/\D/g, ''), 10) || null,
        // stageCode: item.stageCode,
        ...item
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        item.stageName = result.stageName || item.stageName;
        item.phase = result.stageName || item.phase;
        if (result.division !== undefined) {
          item.division = result.division;
          item.divisions = result.divisions || (result.division ? result.division.split(',').map((s: string) => s.trim()) : []);
        }
        if (result.stageSerial) {
          item.stageSerial = Number(result.stageSerial);
          item.stageCode = `S${result.stageSerial}`;
        }
        item.gateCode = result.gateCode || item.gateCode;
        item.stageDescription = result.stageDescription ?? item.stageDescription;
        item.description = result.stageDescription ?? item.description;
        item.planEffort = Number(result.planEffort) ?? item.planEffort;
        item.planDuration = Number(result.planDuration) ?? item.planDuration;
        if (result.materialBudget !== undefined) {
          item.materialBudget = String(result.materialBudget).startsWith('$') ? String(result.materialBudget) : `$${result.materialBudget}`;
        }
      }
    });
  }

  onDeleteStage(item: Stage): void {
    if (!this.canDelete || item.TotalUsed) return;

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.masterData = this.masterData.filter(stage => stage.stageCode !== item.stageCode);
        this.totalSize = this.masterData.length;

        // Handle pagination edge case where the user deletes the last item on the last page
        const maxPageIndex = Math.max(0, Math.ceil(this.totalSize / this.pageSize) - 1);
        if (this.pageIndex > maxPageIndex) {
          this.pageIndex = maxPageIndex;
        }

        this.updatePageData();
      }
    });
  }

  openHistory(item: Stage, index?: number): void {
    const historyCount = item.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    const seq = item.sequence || ((this.pageIndex * this.pageSize + (index ?? 0) + 1) + '.0');
    this.router.navigate(['/stages/history'], {
      queryParams: {
        stageName: item.stageName,
        division: item.division || (item.divisions ? item.divisions.join(', ') : ''),
        stageCode: item.stageCode,
        sequence: seq,
        gateCode: item.gateCode,
        planEffort: item.planEffort,
        planDuration: item.planDuration,
        materialBudget: item.materialBudget,
        stageDescription: item.stageDescription || item.description,
        historyCount: historyCount
      }
    });
  }

  openDescription(item: Stage): void {
    this.dialog.open(DescriptionDialogComponent, {
      width: '620px',
      maxWidth: '90vw',
      data: {
        title: item.stageName,
        code: item.stageCode,
        type: 'Stage',
        description: item.stageDescription || item.description
      }
    });
  }

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
}

