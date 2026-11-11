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
  currentGateName: string = 'Opportunity and portfolio approval';

  readonly gateDefinitions: Record<string, { gateCode: string; gateName: string; criteria: GateCriteria[] }> = {
    feasibility: {
      gateCode: 'Gate 1',
      gateName: 'Opportunity and portfolio approval',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Therapeutic Area & Unmet Medical Need Assessment',
          description: 'Epidemiological prevalence data, standard-of-care analysis, and addressable patient population verified and endorsed by medical affairs.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Target Product Profile (TPP) Baseline Sign-off',
          description: 'Dosage form, strength, release mechanism, indication, route of administration, and packaging format documented in baseline TPP.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Patent Landscape & Freedom-to-Operate (FTO) Review',
          description: 'Orange Book/Patent register review, molecule exclusivity horizon, formulation patent expiry, and paragraph IV litigation risk evaluated by legal.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'Preliminary Business Case & Peak-Sales Financial Model',
          description: 'Development budget, target unit cost of goods (COGS), gross-to-net pricing assumptions, and return on investment approved by finance.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'API Sourcing Feasibility & DMF Availability',
          description: 'At least two qualified API synthetic routes identified with Drug Master File (DMF) availability and initial pricing feasibility.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 6,
          status: true,
          question: 'Regulatory Filing Pathway & Exclusivity Strategy',
          description: 'Target submission route (ANDA / 505(b)(2) / MAA) defined across target jurisdictions (US, EU, ROW) with bioequivalence expectations.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 7,
          status: true,
          question: 'Portfolio Steering Committee Concept Authorization',
          description: 'Executive R&D committee formal charter sign-off approving progression into product definition and funding allocation.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        }
      ]
    },
    formulation: {
      gateCode: 'Gate 2',
      gateName: 'Product definition and project charter approval',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Reference Listed Drug (RLD) Characterization Complete',
          description: 'Innovator sample characterization, dissolution profiling across physiological pH range, excipient deconstruction, and polymorphic form identified.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Quality Target Product Profile (QTPP) Finalization',
          description: 'Critical Quality Attributes (CQAs) mapped to patient safety and efficacy in compliance with ICH Q8 Quality by Design guidance.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Regulatory Strategy & Agency Scientific Advice Plan',
          description: 'Pre-submission briefing package, pharmacopoeial monograph compliance check, and potential guidance divergence risks documented.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'Cross-Functional Project Charter & Schedule Commitment',
          description: 'Integrated master development timeline, milestone commitments across R&D, RA, QA, and Manufacturing, and Capex sign-off.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'Analytical Strategy & Impurity Profile Specifications',
          description: 'ICH Q3A/B impurity qualification limits, nitrosamine risk evaluation, and stability-indicating method strategy established.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        },
        {
          id: 6,
          status: true,
          question: 'Primary Packaging Concept & Barrier Requirements',
          description: 'Blister foil / HDPE bottle moisture, light, and oxygen barrier specifications determined based on drug substance stability sensitivity.',
          answer: null,
          priority: 'High',
          mandatory: true
        }
      ]
    },
    development: {
      gateCode: 'Gate 3',
      gateName: 'Formulation concept and sourcing strategy approval',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Pre-Formulation & Drug-Excipient Compatibility Sign-off',
          description: 'Differential scanning calorimetry (DSC), isothermal stress testing, and binary blend stability confirm zero adverse physical/chemical interactions.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Lead Prototype Formulation Selected via DoE',
          description: 'Statistically designed formulation screening batches demonstrate acceptable flowability, compressibility, and in-vitro dissolution similarity.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'API & Critical Excipient Commercial Sourcing Agreements',
          description: 'Primary and secondary API vendors contracted with Quality Agreements, GMP audit sign-off, and pilot batch delivery confirmed.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'Analytical Stability-Indicating Methods Qualified',
          description: 'HPLC assay and related substance analytical methods qualified for prototype screening and accelerated degradation evaluation.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'Container Closure System Feasibility Validated',
          description: 'Container closure integrity and child-resistant/senior-friendly packaging compliance confirmed by vendor qualification data.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        },
        {
          id: 6,
          status: true,
          question: 'Technology Transfer Readiness Assessment to Pilot Plant',
          description: 'Manufacturing process train compatibility review completed between lab formulation equipment and pilot-scale GMP facility.',
          answer: null,
          priority: 'High',
          mandatory: true
        }
      ]
    },
    testing: {
      gateCode: 'Gate 4',
      gateName: 'Formulation and process development approval',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Formulation & Process Parameter Optimization Freeze',
          description: 'Design of Experiments (DoE) completes mapping of Critical Process Parameters (CPPs) to CQAs, defining preliminary design space.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Laboratory Stress & 3-Month Accelerated Stability Clearance',
          description: 'Prototype batches stored at 40°C/75% RH for 3 months demonstrate no out-of-specification degradation or dissolution drift.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Analytical Method Validation Protocol per ICH Q2(R1)',
          description: 'Formal validation protocol approved covering specificity, linearity, range, accuracy, precision, LOD/LOQ, and robustness.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'Scale-Up Batch Execution & Process Train Verification',
          description: 'Pilot scale batch executed successfully on production-representative equipment with blend uniformity RSD < 3.0%.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'Nitrosamine & Elemental Impurities Risk Assessment Sign-off',
          description: 'ICH Q3D and FDA/EMA nitrosamine risk assessments concluded with zero detected or quantified risks below toxicological limits.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        },
        {
          id: 6,
          status: true,
          question: 'Bioequivalence Pilot Study Batch Release Protocol',
          description: 'Clinical trial batch manufacturing formula, master production record, and release specification approved by QA.',
          answer: null,
          priority: 'High',
          mandatory: true
        }
      ]
    },
    scaling: {
      gateCode: 'Gate 5',
      gateName: 'Facility and manufacturing readiness approval',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Commercial Manufacturing Facility GMP Qualification',
          description: 'Cleanroom HVAC qualification (ISO Class 8/Grade C/D), differential pressure cascades, and utility validations (PW/WFI) verified.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Commercial Equipment IQ/OQ/PQ & Calibrations Complete',
          description: 'High-shear granulator, fluid bed dryer, tablet press, and blister packaging line fully qualified and release-certified.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Cleaning Validation & Maximum Allowable Carryover (MAC) Limits',
          description: 'Analytical swab and rinse cleaning test methods validated; cleaning verification protocol approved for drug contact surfaces.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'Commercial Batch Records (MBR/BPR) & Standard Operating Procedures',
          description: 'Master batch manufacturing and packaging records signed off by MS&T, Production Operations, and Quality Assurance.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'Raw Material Commercial Inventory Release for Registration Batches',
          description: 'API and all compendial excipients received, sampled, QC tested, and released under active quarantine/inventory management.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        }
      ]
    },
    stability: {
      gateCode: 'Gate 6',
      gateName: 'Validation and regulatory submission readiness',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Process Performance Qualification (PPQ) 3 Batches Execution',
          description: 'Three consecutive commercial-scale batches manufactured meeting all predefined intra-batch and inter-batch acceptance criteria.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Registration Batch ICH Stability Data (6-Month Accelerated & Long-Term)',
          description: 'Mandatory minimum 6 months stability data at 40°C/75% RH and 25°C/60% RH complies with all finished product specifications.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Pivotal In-Vivo Bioequivalence (BE) Study Clinical Report',
          description: '90% confidence intervals for Cmax and AUC ratios fall within 80.00% - 125.00% bioequivalence acceptance limits.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'eCTD Regulatory Dossier Compilation & Publishing',
          description: 'Modules 1 through 5 compiled in eCTD format with zero critical technical validation errors; ready for gateway dispatch.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'Pre-Approval Inspection (PAI) Readiness Audit Clearance',
          description: 'Mock GMP regulatory inspection completed across development laboratory and commercial manufacturing site with zero open CAPAs.',
          answer: null,
          priority: 'Medium',
          mandatory: false
        }
      ]
    },
    registration: {
      gateCode: 'Gate 7',
      gateName: 'Commercial launch authorization',
      criteria: [
        {
          id: 1,
          status: true,
          question: 'Marketing Authorization Approval & Product License Granted',
          description: 'Official approval letters, approved package insert/SmPC, and marketing authorization received from regulatory authorities.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 2,
          status: true,
          question: 'Pre-Approval Inspection (PAI) Clearance & Site License',
          description: 'Health authority GMP inspection successfully passed with official Establishment Inspection Report (EIR) or GMP certificate issued.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 3,
          status: true,
          question: 'Commercial Supply Chain & Distribution Pipeline Stocked',
          description: 'Launch quantities manufactured, packaged in market-specific commercial cartons, and positioned at regional distribution centers.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 4,
          status: true,
          question: 'Pharmacovigilance (PV) & Post-Marketing Risk Management Ready',
          description: 'Adverse drug reaction (ADR) reporting systems, safety database, and Risk Evaluation and Mitigation Strategy (REMS) operational.',
          answer: null,
          priority: 'High',
          mandatory: true
        },
        {
          id: 5,
          status: true,
          question: 'Commercial Operations Launch Authorization & Handover',
          description: 'Executive committee sign-off transferring responsibility from R&D project team to commercial supply and brand management.',
          answer: null,
          priority: 'High',
          mandatory: true
        }
      ]
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
    const sampleUsers = ['Dr. Sarah Jenkins', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu', 'Amit Patel', 'Dr. Rebecca Chen'];
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
