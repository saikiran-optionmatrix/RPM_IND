import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Adjust these to your actual paths
import { AddCriteriaComponent } from './add-criteria/add-criteria.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
// import { DeleteConfirmationComponent } from '../../../../common/shared/delete-confirmation/delete-confirmation.component';

export interface GateCriteria {
  id: number;
  status: boolean;
  question: string;
  description: string;
  answer: string | null;
  priority: boolean | string;
  mandatory: boolean;
  TotalUsed?: boolean;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-gate-criteria',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    DragDropModule
  ],
  templateUrl: './gate-criteria.component.html',
  styleUrls: ['./gate-criteria.component.scss']
})
export class GateCriteriaComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly canDelete = true;
  readonly canUpdate = true;

  currentGateContext: string = '';
  currentGateCode: string = 'Gate 1';
  currentGateName: string = 'Business Case Approval';

  private readonly gate5Criteria: GateCriteria[] = [
    {
      id: 1,
      status: true,
      question: 'Operational Qualification (OQ) & 3-Shift OEE Ramp-Up Acceptance',
      description: 'Three consecutive multi-shift production runs completed meeting sustained OEE >= 85%, cycle-time target, and Cpk >= 1.67 quality limits.',
      answer: null,
      priority: 'High',
      mandatory: true
    },
    {
      id: 2,
      status: true,
      question: 'As-Built Technical Transfer Dossier (TTD) & EPLAN/PLC Archive',
      description: 'Finalized mechanical CAD assemblies, EPLAN schematics, verified PLC/HMI ladder source code, and spare parts BOM signed off by Engineering.',
      answer: null,
      priority: 'High',
      mandatory: true
    },
    {
      id: 3,
      status: true,
      question: 'CMMS Preventive Maintenance Plan & Critical Spares Crib Stocked',
      description: 'Lubrication schedules, sensor calibration intervals, and min/max critical servo/bearing spare kits loaded into plant CMMS.',
      answer: null,
      priority: 'High',
      mandatory: true
    },
    {
      id: 4,
      status: true,
      question: 'Operator, Technician & Lockout/Tagout (LOTO) Training Certified',
      description: 'SOP manuals published and hands-on safety, operation, and troubleshooting certification completed for all production shift crews.',
      answer: null,
      priority: 'High',
      mandatory: true
    },
    {
      id: 5,
      status: true,
      question: 'Executive Handover Authorization & Capital Project Closeout',
      description: 'Formal steering committee sign-off transferring asset ownership from Capital Engineering to Plant Manufacturing Operations.',
      answer: null,
      priority: 'High',
      mandatory: true
    }
  ];

  readonly gateDefinitions: Record<string, { gateCode: string; gateName: string; criteria: GateCriteria[] }> = {
    feasibility: {
      gateCode: 'Gate 1',
      gateName: 'Business Case Approval',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Plant Capacity & Operational Need Assessment',
          description: 'Throughput gap analysis, takt-time demand forecast, and line bottleneck study verified and endorsed by Manufacturing Operations.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'User Requirements Specification (URS) Baseline Sign-off',
          description: 'Rated capacity, equipment footprint envelope, cycle-time target, accuracy tolerances, and utility interface specs documented in baseline URS.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Patent Landscape & Freedom-to-Operate (FTO) Review',
          description: 'Proprietary tooling, custom fixture patents, controller software licensing, and IP clearance evaluated by legal and engineering.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'Preliminary Business Case & CapEx / ROI Financial Model',
          description: 'Capital expenditure budget, tooling depreciation, unit conversion cost impact, NPV, and payback period validated by finance.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'OEM & Tier-1 Vendor Qualification Feasibility',
          description: 'At least two qualified OEM equipment and drive/controller vendors shortlisted with initial budgetary quotes and lead-time feasibility.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 6,
          status: true,
          question: 'Safety, CE / ISO 13849 & Statutory Compliance Roadmap',
          description: 'Applicable machinery safety directives (CE, UL 508A, BIS, ISO 12100) and environmental permit pathways mapped for plant sites.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 7,
          status: true,
          question: 'Executive Committee Gate 1 Program Charter Release',
          description: 'Capital steering committee formal charter sign-off authorizing progression into concept engineering and vendor RFQ evaluation.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        }
      ]
    },
    formulation: {
      gateCode: 'Gate 2',
      gateName: 'Concept Selection & Design Freeze',
      criteria: [
        {
          id: 1,
          status: true,
          question: '3D CAD Assembly & Structural FEA Simulation Approved',
          description: 'Full parametric machinery layout, collision clearance verification, modal vibration analysis, and structural deflection checks approved.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Critical-to-Quality (CTQ) Tolerances & Metrology Plan',
          description: 'GD&T datum scheme, CMM inspection points, and automated sensor accuracy requirements locked in compliance with ISO standards.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'PLC / SCADA Control Philosophy & Safety Interlock Architecture',
          description: 'Control network topology, HMI wireframe screens, E-stop / light-curtain safety PLd calculations, and MES telemetry mapping frozen.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'DFMA Review & Cross-Functional Schedule Commitment',
          description: 'Design for Manufacturing & Assembly audit completed; baseline project schedule and CapEx milestone commitments signed off.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'Ergonomics, Chip / Scrap Removal & Maintenance Access Review',
          description: 'Operator loading height, quick-change SMED tooling accessibility, and enclosed swarf/mist extraction confirmed.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        },
        {
          id: 6,
          status: true,
          question: 'Machine Guarding & Hazardous Energy (LOTO) Isolation Spec',
          description: 'ISO 13849 dual-channel pneumatic dump valves, lockable disconnect switches, and mechanical guarding specs frozen.',
          answer: null,
          priority: 'High',
          mandatory: true
        }
      ]
    },
    development: {
      gateCode: 'Gate 3',
      gateName: 'Procurement & Build Readiness',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Long-Lead Component & OEM Purchase Orders Released',
          description: 'Confirmed delivery schedules for servo drives, linear guides, precision castings, PLC racks, and robotic workcells.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Prototype Fixture Tooling & First-Article Fabrication Verified',
          description: 'First-article machined workholding fixtures pass CMM dimensional verification and clamp repeatability trials.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Vendor Quality Agreements & Panel Shop Audit Signed Off',
          description: 'UL 508A / IEC 60204-1 control panel build standards, BOM traceability, and Factory Acceptance Test (FAT) protocols approved.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'Measurement System Analysis (Gage R&R < 10%) Qualified',
          description: 'Inspection gauges, inline laser micrometers, and CMM routines qualified for part-to-part repeatability and bias.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'Protective Transit Packaging & Rigging Plan Approved',
          description: 'Humidity barrier crating, shock sensors, crane lift lugs, and factory floor rigging route plan verified.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        },
        {
          id: 6,
          status: true,
          question: 'Site Foundation, 480V Utility & Floor Readiness Verified',
          description: 'Vibration-isolated concrete pad curing, overhead compressed air drops, and chilled water manifolds ready at plant bay.',
          answer: null,
          priority: 'High',
          mandatory: true
        }
      ]
    },
    testing: {
      gateCode: 'Gate 4',
      gateName: 'Commissioning & Performance Acceptance',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Factory Acceptance Test (FAT) & Punchlist Clearance',
          description: 'OEM floor dry/wet run-off witnessed with all Priority-1 functional and safety punchlist items resolved before shipment.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Installation & Operational Qualification (IQ / OQ) Executed',
          description: 'Laser leveling, utility load check, PLC I/O loop verification, and emergency-stop stopping-time tests passed on site.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Process Capability (Cpk >= 1.67) & Cycle-Time Study Passed',
          description: '50-piece capability trial meets dimensional tolerances, surface finish, and rated hourly throughput under automatic cycle.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'EHS Final Machine Safety & Acoustic Emission Sign-off',
          description: 'Light curtain response, interlock trapping zones, guard switches, and < 80 dBA sound-pressure limits certified by EHS.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'MES / SCADA Telemetry & Alarm Historian Validated',
          description: 'Real-time OEE counter, downtime reason codes, and serialization/barcode scan handshakes verified with plant IT.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        },
        {
          id: 6,
          status: true,
          question: 'Site Acceptance Test (SAT) Release for Pilot Ramp-Up',
          description: 'Cross-functional Engineering and Production QA sign-off releasing equipment for multi-shift Operational Qualification.',
          answer: null,
          priority: 'High',
          mandatory: true
        }
      ]
    },
    validation: {
      gateCode: 'Gate 5',
      gateName: 'Operational Handover Approval',
      criteria: this.gate5Criteria
    },
    scaling: {
      gateCode: 'Gate 5',
      gateName: 'Operational Handover Approval',
      criteria: this.gate5Criteria
    }
  };

  criteriaList: GateCriteria[] = [];

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.currentGateContext = params.get('id') || 'feasibility';
      const def = this.gateDefinitions[this.currentGateContext] || this.gateDefinitions['feasibility'];
      this.currentGateCode = def.gateCode;
      this.currentGateName = def.gateName;
      this.criteriaList = def.criteria.map(c => ({ ...c }));
      this.populateMetadata();
    });
  }

  readonly historySequence: number[] = [4, 2, 5, 2, 4, 7, 8, 3, 5, 2, 6, 4, 8, 2, 5, 7, 3, 6, 4, 2];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  ngOnInit(): void {
    this.populateMetadata();
  }

  private populateMetadata(): void {
    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25'];
    const sampleUsers = ['Ananya Rao', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu', 'Amit Patel', 'Vikram Singh'];
    this.criteriaList.forEach((c, idx) => {
      if (!c.historyCount) {
        c.historyCount = this.getHistoryCount(idx);
      }
      if (!c.updatedDate) {
        c.updatedDate = sampleDates[idx % sampleDates.length];
      }
      if (!c.updatedBy) {
        c.updatedBy = sampleUsers[idx % sampleUsers.length];
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDrop(event: CdkDragDrop<GateCriteria[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.criteriaList, event.previousIndex, event.currentIndex);
    }
  }

  onAddCriteria(): void {
    const dialogRef = this.dialog.open(AddCriteriaComponent, {
      width: '900px',
      maxWidth: '75vw',
      height: 'auto',
      data: { mode: 'add', context: this.currentGateContext }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const newCriteria: GateCriteria = {
          id: this.criteriaList.length + 1,
          status: true,
          question: result.subject || result.question || '',
          description: result.description || '',
          priority: result.priority || 'High',
          mandatory: result.mandatory || false,
          answer: null,
          historyCount: 1
        };
        this.criteriaList.unshift(newCriteria);
      }
    });
  }

  onEditCriteria(item: GateCriteria): void {
    if (!this.canUpdate) return;

    const dialogRef = this.dialog.open(AddCriteriaComponent, {
      width: '1000px',
      maxWidth: '95vw',
      height: 'auto',
      data: {
        mode: 'edit',
        subject: item.question,
        description: item.description,
        priority: item.priority,
        mandatory: item.mandatory
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        item.question = result.subject || result.question || item.question;
        item.description = result.description !== undefined ? result.description : item.description;
        item.priority = result.priority || item.priority;
        item.mandatory = result.mandatory !== undefined ? result.mandatory : item.mandatory;
      }
    });
  }

  onDeleteCriteria(item: GateCriteria): void {
    if (!this.canDelete || item.TotalUsed) return;

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.criteriaList = this.criteriaList.filter(c => c.id !== item.id);
      }
    });
  }

  // onStatusChange(item: GateCriteria): void {
  //   if (!this.canUpdate) return;

  //   const dialogRef = this.dialog.open(StatusConfirmationDialogComponent, {
  //     width: 'auto',
  //     data: {
  //       title: 'Change Status',
  //       content: 'Are you sure you want to change the status?'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(confirmed => {
  //     if (confirmed) {
  //       item.status = !item.status;
  //     }
  //   });
  // }

  onDownloadGuidelines(item: GateCriteria): void {
    console.log('Downloading guidelines for:', item.question);
    // Add physical download logic here
  }

  openHistory(item: GateCriteria, index?: number): void {
    const historyCount = item.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.router.navigate(['/gates/criteria/history'], {
      queryParams: {
        subject: item.question,
        description: item.description,
        priority: item.priority,
        mandatory: item.mandatory,
        context: this.currentGateContext,
        historyCount: historyCount
      }
    });
  }
}
