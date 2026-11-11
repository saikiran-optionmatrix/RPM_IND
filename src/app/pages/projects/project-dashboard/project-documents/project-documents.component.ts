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

  projectName: string = 'Generic Tablet Development';
  projectCode: string = '2026/GEN/001';

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

    // Default select Stage 1 (Business Case) so all its tasks appear in the grid
    this.setDefaultSelection();
  }

  private initMasterTreeData(): void {
    // 1. Stage 1: Business Case
    const stage1: StageNode = {
      id: 'S1',
      type: 'stage',
      stageCode: 'S1',
      stageName: 'Business Case',
      gateCode: 'Gate 1',
      expanded: true,
      deliverables: [
        {
          id: 'D1-1',
          name: 'Business Case Preparation & Commercial Feasibility',
          expanded: true,
          activities: [
            {
              id: 'A1-1',
              name: 'Market Sizing & Commercial Modeling',
              jobCode: 'ACT1',
              tasks: [
                {
                  id: 'T1-1',
                  stageName: 'Business Case',
                  deliverableName: 'Business Case Preparation & Commercial Feasibility',
                  activityName: 'Market Sizing & Commercial Modeling',
                  taskName: 'Market opportunity assessment & epidemiological review',
                  documentsCount: 4,
                  documents: [
                    { id: 1, title: 'Epidemiology_Report_2026.pdf', uploadedDate: '2026-01-08' },
                    { id: 2, title: 'Commercial_Model_v2.xlsx', uploadedDate: '2026-01-09' },
                    { id: 3, title: 'IMS_Data_Market_Overview.pdf', uploadedDate: '2026-01-10' },
                    { id: 4, title: 'Market_Share_Simulation.pdf', uploadedDate: '2026-01-11' }
                  ]
                },
                {
                  id: 'T1-2',
                  stageName: 'Business Case',
                  deliverableName: 'Business Case Preparation & Commercial Feasibility',
                  activityName: 'Market Sizing & Commercial Modeling',
                  taskName: 'Competitive landscape and patent exclusivity mapping',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'Competitor_Pipeline_Analysis.pdf', uploadedDate: '2026-01-12' },
                    { id: 2, title: 'Orange_Book_Patents_Mapping.pdf', uploadedDate: '2026-01-13' },
                    { id: 3, title: 'Paragraph_IV_Litigation_Review.pdf', uploadedDate: '2026-01-14' }
                  ]
                },
                {
                  id: 'T1-3',
                  stageName: 'Business Case',
                  deliverableName: 'Business Case Preparation & Commercial Feasibility',
                  activityName: 'Market Sizing & Commercial Modeling',
                  taskName: 'Pricing strategy and gross-to-net projection',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'Pricing_Strategy_Draft.pdf', uploadedDate: '2026-01-14' },
                    { id: 2, title: 'GTN_Assumptions_Model.xlsx', uploadedDate: '2026-01-15' }
                  ]
                }
              ]
            },
            {
              id: 'A1-2',
              name: 'Financial Evaluation & NPV Calculation',
              jobCode: 'ACT2',
              tasks: [
                {
                  id: 'T1-4',
                  stageName: 'Business Case',
                  deliverableName: 'Business Case Preparation & Commercial Feasibility',
                  activityName: 'Financial Evaluation & NPV Calculation',
                  taskName: 'NPV & IRR discounted cash flow forecast',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'DCF_Valuation_Model.xlsx', uploadedDate: '2026-01-12' },
                    { id: 2, title: 'Sensitivity_Analysis_Summary.pdf', uploadedDate: '2026-01-13' },
                    { id: 3, title: 'Executive_Finance_Signoff.pdf', uploadedDate: '2026-01-14' }
                  ]
                },
                {
                  id: 'T1-5',
                  stageName: 'Business Case',
                  deliverableName: 'Business Case Preparation & Commercial Feasibility',
                  activityName: 'Financial Evaluation & NPV Calculation',
                  taskName: 'Capex, Opex and tooling budget validation',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'Capex_Requisition_Approval.pdf', uploadedDate: '2026-01-14' },
                    { id: 2, title: 'Tooling_Cost_Breakdown.pdf', uploadedDate: '2026-01-15' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'D1-2',
          name: 'Technical & Regulatory Feasibility Charter',
          expanded: false,
          activities: [
            {
              id: 'A1-3',
              name: 'Project Charter & Risk Register Compilation',
              jobCode: 'ACT3',
              tasks: [
                {
                  id: 'T1-6',
                  stageName: 'Business Case',
                  deliverableName: 'Technical & Regulatory Feasibility Charter',
                  activityName: 'Project Charter & Risk Register Compilation',
                  taskName: 'Formal Project Charter & Scope Baseline',
                  documentsCount: 5,
                  documents: [
                    { id: 1, title: 'Signed_Project_Charter.pdf', uploadedDate: '2026-01-15' },
                    { id: 2, title: 'Risk_Register_Initial.xlsx', uploadedDate: '2026-01-15' },
                    { id: 3, title: 'Stakeholder_Matrix.pdf', uploadedDate: '2026-01-15' },
                    { id: 4, title: 'Governance_Structure.pdf', uploadedDate: '2026-01-15' },
                    { id: 5, title: 'Milestone_Schedule.pdf', uploadedDate: '2026-01-15' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 2. Gate 1: Business Case
    const gate1: GateNode = {
      id: 'G1',
      type: 'gate',
      gateCode: 'Gate 1',
      gateName: 'Business Case',
      documents: [
        { id: 'GD1-1', gateCode: 'Gate 1', gateName: 'Business Case', documentTitle: 'Formal Freedom-to-Operate (FTO) Legal Opinion', uploadedDate: '2026-01-15', uploadedBy: 'Legal Counsel' },
        { id: 'GD1-2', gateCode: 'Gate 1', gateName: 'Business Case', documentTitle: 'API Source & Primary Vendor Qualification Report', uploadedDate: '2026-01-15', uploadedBy: 'Procurement PMO' },
        { id: 'GD1-3', gateCode: 'Gate 1', gateName: 'Business Case', documentTitle: 'Reference Listed Drug (RLD) Characterization Protocol', uploadedDate: '2026-01-14', uploadedBy: 'Formulation Lead' },
        { id: 'GD1-4', gateCode: 'Gate 1', gateName: 'Business Case', documentTitle: 'Target Product Profile (TPP) Baseline Document', uploadedDate: '2026-01-13', uploadedBy: 'Medical Affairs' },
        { id: 'GD1-5', gateCode: 'Gate 1', gateName: 'Business Case', documentTitle: 'Cost of Goods Sold (COGS) Feasibility Summary', uploadedDate: '2026-01-12', uploadedBy: 'Finance Controller' },
        { id: 'GD1-6', gateCode: 'Gate 1', gateName: 'Business Case', documentTitle: 'Gate 1 Steering Committee Approval Resolution', uploadedDate: '2026-01-15', uploadedBy: 'Steering Committee' }
      ]
    };

    // 3. Stage 2: Product / Project In Initiation
    const stage2: StageNode = {
      id: 'S2',
      type: 'stage',
      stageCode: 'S2',
      stageName: 'Product / Project In Initiation',
      gateCode: '-',
      expanded: false,
      deliverables: [
        {
          id: 'D2-1',
          name: 'Project Costing Sheet Preparation & Selection',
          expanded: false,
          activities: [
            {
              id: 'A2-1',
              name: 'Analytical Costing & External CRO Costing',
              jobCode: 'ACT4',
              tasks: [
                {
                  id: 'T2-1',
                  stageName: 'Product / Project In Initiation',
                  deliverableName: 'Project Costing Sheet Preparation & Selection',
                  activityName: 'Analytical Costing & External CRO Costing',
                  taskName: 'Analytical testing & chromatographic CRO proposal evaluation',
                  documentsCount: 4,
                  documents: [
                    { id: 1, title: 'CRO_Proposal_Eurofins.pdf', uploadedDate: '2026-01-18' },
                    { id: 2, title: 'CRO_Cost_Comparison_Matrix.xlsx', uploadedDate: '2026-01-19' },
                    { id: 3, title: 'Analytical_Instrumentation_Audit.pdf', uploadedDate: '2026-01-20' },
                    { id: 4, title: 'Scope_of_Work_Analytical.pdf', uploadedDate: '2026-01-20' }
                  ]
                },
                {
                  id: 'T2-2',
                  stageName: 'Product / Project In Initiation',
                  deliverableName: 'Project Costing Sheet Preparation & Selection',
                  activityName: 'Analytical Costing & External CRO Costing',
                  taskName: 'Method transfer and verification quote review',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'Method_Transfer_Quote.pdf', uploadedDate: '2026-01-20' },
                    { id: 2, title: 'Technical_Agreement_Draft.pdf', uploadedDate: '2026-01-21' }
                  ]
                }
              ]
            },
            {
              id: 'A2-2',
              name: 'RM, PM, API & RLD Costing Breakdown',
              jobCode: 'ACT5',
              tasks: [
                {
                  id: 'T2-3',
                  stageName: 'Product / Project In Initiation',
                  deliverableName: 'Project Costing Sheet Preparation & Selection',
                  activityName: 'RM, PM, API & RLD Costing Breakdown',
                  taskName: 'RLD sample batch receipt & customs clearance documentation',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'RLD_Customs_Declaration.pdf', uploadedDate: '2026-01-21' },
                    { id: 2, title: 'Invoice_RLD_Lot_Batch.pdf', uploadedDate: '2026-01-22' },
                    { id: 3, title: 'Inspection_Checklist_RLD.pdf', uploadedDate: '2026-01-22' }
                  ]
                },
                {
                  id: 'T2-4',
                  stageName: 'Product / Project In Initiation',
                  deliverableName: 'Project Costing Sheet Preparation & Selection',
                  activityName: 'RM, PM, API & RLD Costing Breakdown',
                  taskName: 'Bill of Materials (BOM) excipient quote consolidation',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'Consolidated_Excipient_Quotes.xlsx', uploadedDate: '2026-01-23' },
                    { id: 2, title: 'Vendor_Price_Commitment.pdf', uploadedDate: '2026-01-24' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'D2-2',
          name: 'Provincial Product Initiation Form (PPIF)',
          expanded: false,
          activities: [
            {
              id: 'A2-3',
              name: 'PPIF Draft & Cross-Functional Sign-Off',
              jobCode: 'ACT6',
              tasks: [
                {
                  id: 'T2-5',
                  stageName: 'Product / Project In Initiation',
                  deliverableName: 'Provincial Product Initiation Form (PPIF)',
                  activityName: 'PPIF Draft & Cross-Functional Sign-Off',
                  taskName: 'PPIF final draft compilation & QA approval',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'PPIF_Final_Signed_Copy.pdf', uploadedDate: '2026-01-25' },
                    { id: 2, title: 'Regulatory_Formulation_Alignment.pdf', uploadedDate: '2026-01-25' },
                    { id: 3, title: 'Quality_Risk_Assessment.pdf', uploadedDate: '2026-01-25' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 4. Stage 3: Procurement of API, RM & Packaging materials
    const stage3: StageNode = {
      id: 'S3',
      type: 'stage',
      stageCode: 'S3',
      stageName: 'Procurement of API, RM & Packaging materials - For Developmental studies.',
      gateCode: '-',
      expanded: false,
      deliverables: [
        {
          id: 'D3-1',
          name: 'Developmental Material Procurement & Release',
          expanded: false,
          activities: [
            {
              id: 'A3-1',
              name: 'API Vendor Evaluation & Tech Pack Sourcing',
              jobCode: 'ACT7',
              tasks: [
                {
                  id: 'T3-1',
                  stageName: 'Procurement of API, RM & Packaging materials',
                  deliverableName: 'Developmental Material Procurement & Release',
                  activityName: 'API Vendor Evaluation & Tech Pack Sourcing',
                  taskName: 'API Open part DMF review and qualification audit',
                  documentsCount: 4,
                  documents: [
                    { id: 1, title: 'API_Open_Part_DMF.pdf', uploadedDate: '2026-02-01' },
                    { id: 2, title: 'API_Vendor_Audit_Report.pdf', uploadedDate: '2026-02-03' },
                    { id: 3, title: 'CEP_Certificate_Suitability.pdf', uploadedDate: '2026-02-05' },
                    { id: 4, title: 'Letter_of_Access_LOA.pdf', uploadedDate: '2026-02-06' }
                  ]
                },
                {
                  id: 'T3-2',
                  stageName: 'Procurement of API, RM & Packaging materials',
                  deliverableName: 'Developmental Material Procurement & Release',
                  activityName: 'API Vendor Evaluation & Tech Pack Sourcing',
                  taskName: 'Raw material COA verification and quarantine release',
                  documentsCount: 2,
                  documents: [
                    { id: 1, title: 'COA_Developmental_API.pdf', uploadedDate: '2026-02-10' },
                    { id: 2, title: 'Analytical_QC_Release_Slip.pdf', uploadedDate: '2026-02-12' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 5. Stage 4: Formulation Development Phase 1: POC completion
    const stage4: StageNode = {
      id: 'S4',
      type: 'stage',
      stageCode: 'S4',
      stageName: 'Formulation Development Phase 1: POC completion',
      gateCode: 'Gate 2',
      expanded: false,
      deliverables: [
        {
          id: 'D4-1',
          name: 'Proof of Concept (POC) Formulation Trials',
          expanded: false,
          activities: [
            {
              id: 'A4-1',
              name: 'Excipient Compatibility & Pre-formulation Studies',
              jobCode: 'ACT8',
              tasks: [
                {
                  id: 'T4-1',
                  stageName: 'Formulation Development Phase 1: POC completion',
                  deliverableName: 'Proof of Concept (POC) Formulation Trials',
                  activityName: 'Excipient Compatibility & Pre-formulation Studies',
                  taskName: 'Binary mixture stress testing & HPLC compatibility',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'Excipient_Compatibility_Protocol.pdf', uploadedDate: '2026-03-01' },
                    { id: 2, title: 'DSC_TGA_Thermal_Curves.pdf', uploadedDate: '2026-03-10' },
                    { id: 3, title: 'Compatibility_Study_Report.pdf', uploadedDate: '2026-03-20' }
                  ]
                },
                {
                  id: 'T4-2',
                  stageName: 'Formulation Development Phase 1: POC completion',
                  deliverableName: 'Proof of Concept (POC) Formulation Trials',
                  activityName: 'Excipient Compatibility & Pre-formulation Studies',
                  taskName: 'Prototype formulation trial batches execution (F1 - F4)',
                  documentsCount: 5,
                  documents: [
                    { id: 1, title: 'Trial_Batch_F1_BMR.pdf', uploadedDate: '2026-04-05' },
                    { id: 2, title: 'Trial_Batch_F2_BMR.pdf', uploadedDate: '2026-04-12' },
                    { id: 3, title: 'Trial_Batch_F3_BMR.pdf', uploadedDate: '2026-04-19' },
                    { id: 4, title: 'Comparative_Dissolution_Profiles.xlsx', uploadedDate: '2026-04-25' },
                    { id: 5, title: 'POC_Summary_Signoff.pdf', uploadedDate: '2026-05-02' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 6. Gate 2: Feasibility
    const gate2: GateNode = {
      id: 'G2',
      type: 'gate',
      gateCode: 'Gate 2',
      gateName: 'Feasibility',
      documents: [
        { id: 'GD2-1', gateCode: 'Gate 2', gateName: 'Feasibility', documentTitle: 'Prototype Batches Manufacturing Protocol & Data', uploadedDate: '2026-05-10', uploadedBy: 'Formulation Scientist' },
        { id: 'GD2-2', gateCode: 'Gate 2', gateName: 'Feasibility', documentTitle: 'Comparative Dissolution Profile Report (f2 ≥ 50)', uploadedDate: '2026-05-12', uploadedBy: 'Analytical Lead' },
        { id: 'GD2-3', gateCode: 'Gate 2', gateName: 'Feasibility', documentTitle: 'Critical Quality Attributes (CQAs) Target Ranges Dossier', uploadedDate: '2026-05-15', uploadedBy: 'Quality Assurance' },
        { id: 'GD2-4', gateCode: 'Gate 2', gateName: 'Feasibility', documentTitle: 'Excipient Compatibility Final Study Report', uploadedDate: '2026-05-18', uploadedBy: 'Formulation Scientist' },
        { id: 'GD2-5', gateCode: 'Gate 2', gateName: 'Feasibility', documentTitle: 'Preliminary Impurity Profile Evaluation Report', uploadedDate: '2026-05-20', uploadedBy: 'Analytical Lead' },
        { id: 'GD2-6', gateCode: 'Gate 2', gateName: 'Feasibility', documentTitle: 'Gate 2 Steering Committee Feasibility Endorsement', uploadedDate: '2026-05-22', uploadedBy: 'Project Steering Committee' }
      ]
    };

    // 7. Stage 5: Procurement of API, Raw materials & Packaging materials - For Ebs
    const stage5: StageNode = {
      id: 'S5',
      type: 'stage',
      stageCode: 'S5',
      stageName: 'Procurement of API, Raw materials & Packaging materials - For Ebs',
      gateCode: '-',
      expanded: false,
      deliverables: [
        {
          id: 'D5-1',
          name: 'Exhibit Batch Material Sourcing & QC Release',
          expanded: false,
          activities: [
            {
              id: 'A5-1',
              name: 'Exhibit Batch Commercial BOM Procurement',
              jobCode: 'ACT9',
              tasks: [
                {
                  id: 'T5-1',
                  stageName: 'Procurement of API, Raw materials - For Ebs',
                  deliverableName: 'Exhibit Batch Material Sourcing & QC Release',
                  activityName: 'Exhibit Batch Commercial BOM Procurement',
                  taskName: 'Commercial grade API batch reservation & COA receipt',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'Commercial_API_Reservation.pdf', uploadedDate: '2026-05-25' },
                    { id: 2, title: 'EB_Primary_Packaging_Foil_Specs.pdf', uploadedDate: '2026-05-28' },
                    { id: 3, title: 'Commercial_Material_Incoming_Inspection.pdf', uploadedDate: '2026-06-02' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 8. Stage 6: Formulation Development Phase 2: Pilot Bio
    const stage6: StageNode = {
      id: 'S6',
      type: 'stage',
      stageCode: 'S6',
      stageName: 'Formulation Development Phase 2: Pilot Bio',
      gateCode: 'Gate 3',
      expanded: false,
      deliverables: [
        {
          id: 'D6-1',
          name: 'Pilot Bioequivalence Batch Execution',
          expanded: false,
          activities: [
            {
              id: 'A6-1',
              name: 'Pilot BE Batch Manufacturing & Stability Charging',
              jobCode: 'ACT10',
              tasks: [
                {
                  id: 'T6-1',
                  stageName: 'Formulation Development Phase 2: Pilot Bio',
                  deliverableName: 'Pilot Bioequivalence Batch Execution',
                  activityName: 'Pilot BE Batch Manufacturing & Stability Charging',
                  taskName: 'Pilot BE Batch Manufacturing Record (BMR)',
                  documentsCount: 4,
                  documents: [
                    { id: 1, title: 'Pilot_BMR_Execution_Record.pdf', uploadedDate: '2026-06-15' },
                    { id: 2, title: 'In_Process_Quality_Controls.pdf', uploadedDate: '2026-06-18' },
                    { id: 3, title: 'Pilot_Dissolution_Testing_Report.pdf', uploadedDate: '2026-06-22' },
                    { id: 4, title: 'Stability_Station_Charging_Log.pdf', uploadedDate: '2026-06-25' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 9. Gate 3: Lab Stability
    const gate3: GateNode = {
      id: 'G3',
      type: 'gate',
      gateCode: 'Gate 3',
      gateName: 'Lab Stability',
      documents: [
        { id: 'GD3-1', gateCode: 'Gate 3', gateName: 'Lab Stability', documentTitle: 'Analytical Methods Validation Protocol (ICH Q2)', uploadedDate: '2026-07-01', uploadedBy: 'Analytical Validation Lead' },
        { id: 'GD3-2', gateCode: 'Gate 3', gateName: 'Lab Stability', documentTitle: 'Forced Degradation & Stability-Indicating Study Dossier', uploadedDate: '2026-07-05', uploadedBy: 'Senior Research Scientist' },
        { id: 'GD3-3', gateCode: 'Gate 3', gateName: 'Lab Stability', documentTitle: 'Accelerated Stability Data Report (3M 40°C/75% RH)', uploadedDate: '2026-07-15', uploadedBy: 'Stability Section Head' },
        { id: 'GD3-4', gateCode: 'Gate 3', gateName: 'Lab Stability', documentTitle: 'Long-Term Stability Study Protocol & Interim Data', uploadedDate: '2026-07-20', uploadedBy: 'Stability Section Head' },
        { id: 'GD3-5', gateCode: 'Gate 3', gateName: 'Lab Stability', documentTitle: 'Exhibit Batch Manufacturing Record (BMR) Master Draft', uploadedDate: '2026-07-25', uploadedBy: 'Manufacturing Head' },
        { id: 'GD3-6', gateCode: 'Gate 3', gateName: 'Lab Stability', documentTitle: 'Gate 3 Gatekeeper Stability Clearance Authorization', uploadedDate: '2026-07-28', uploadedBy: 'Gatekeeper Panel' }
      ]
    };

    // 10. Stage 7: API Method Validation / verification
    const stage7: StageNode = {
      id: 'S7',
      type: 'stage',
      stageCode: 'S7',
      stageName: 'API Method Validation / verification',
      gateCode: '-',
      expanded: false,
      deliverables: [
        {
          id: 'D7-1',
          name: 'API Analytical Method Validation & Transfer',
          expanded: false,
          activities: [
            {
              id: 'A7-1',
              name: 'HPLC Assay & Related Substances Validation',
              jobCode: 'ACT11',
              tasks: [
                {
                  id: 'T7-1',
                  stageName: 'API Method Validation / verification',
                  deliverableName: 'API Analytical Method Validation & Transfer',
                  activityName: 'HPLC Assay & Related Substances Validation',
                  taskName: 'API Method validation protocol & analytical raw data',
                  documentsCount: 3,
                  documents: [
                    { id: 1, title: 'API_Validation_Protocol_Assay.pdf', uploadedDate: '2026-08-01' },
                    { id: 2, title: 'Linearity_Precision_Raw_Data.xlsx', uploadedDate: '2026-08-10' },
                    { id: 3, title: 'Validation_Final_Summary_Report.pdf', uploadedDate: '2026-08-18' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 11. Stage 8: FP method validation, FP specifications & STP
    const stage8: StageNode = {
      id: 'S8',
      type: 'stage',
      stageCode: 'S8',
      stageName: 'FP method validation, FP specifications & STP',
      gateCode: '-',
      expanded: false,
      deliverables: [
        {
          id: 'D8-1',
          name: 'Finished Product Standard Test Procedures (STP)',
          expanded: false,
          activities: [
            {
              id: 'A8-1',
              name: 'STP Release & Dissolution Method Transfer',
              jobCode: 'ACT12',
              tasks: [
                {
                  id: 'T8-1',
                  stageName: 'FP method validation, FP specifications & STP',
                  deliverableName: 'Finished Product Standard Test Procedures (STP)',
                  activityName: 'STP Release & Dissolution Method Transfer',
                  taskName: 'Finished Product Finished Specifications & STP Release',
                  documentsCount: 4,
                  documents: [
                    { id: 1, title: 'FP_Release_Specifications.pdf', uploadedDate: '2026-08-25' },
                    { id: 2, title: 'STP_Dissolution_Method.pdf', uploadedDate: '2026-08-28' },
                    { id: 3, title: 'STP_Assay_Uniformity.pdf', uploadedDate: '2026-09-02' },
                    { id: 4, title: 'Analytical_Method_Transfer_Protocol.pdf', uploadedDate: '2026-09-05' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 12. Stage 9: TTD Submission
    const stage9: StageNode = {
      id: 'S9',
      type: 'stage',
      stageCode: 'S9',
      stageName: 'TTD Submission',
      gateCode: '-',
      expanded: false,
      deliverables: [
        {
          id: 'D9-1',
          name: 'Technology Transfer Documentation Package',
          expanded: false,
          activities: [
            {
              id: 'A9-1',
              name: 'Commercial Site Gap Assessment & TTD Compilation',
              jobCode: 'ACT13',
              tasks: [
                {
                  id: 'T9-1',
                  stageName: 'TTD Submission',
                  deliverableName: 'Technology Transfer Documentation Package',
                  activityName: 'Commercial Site Gap Assessment & TTD Compilation',
                  taskName: 'Technology Transfer Dossier (TTD) formal dossier submission',
                  documentsCount: 5,
                  documents: [
                    { id: 1, title: 'Technology_Transfer_Protocol.pdf', uploadedDate: '2026-09-08' },
                    { id: 2, title: 'Critical_Process_Parameters_CPP.pdf', uploadedDate: '2026-09-10' },
                    { id: 3, title: 'Critical_Quality_Attributes_CQA.pdf', uploadedDate: '2026-09-11' },
                    { id: 4, title: 'Manufacturing_Facility_Fit_Review.pdf', uploadedDate: '2026-09-12' },
                    { id: 5, title: 'Plant_Readiness_Signoff.pdf', uploadedDate: '2026-09-14' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 13. Stage 10: Exhibit Batches
    const stage10: StageNode = {
      id: 'S10',
      type: 'stage',
      stageCode: 'S10',
      stageName: 'Exhibit / Submission Batches execution',
      gateCode: 'Gate 4',
      expanded: false,
      deliverables: [
        {
          id: 'D10-1',
          name: 'Exhibit / Submission Batches Execution (3 Batches)',
          expanded: false,
          activities: [
            {
              id: 'A10-1',
              name: 'Executed Batch Manufacturing Records & Stability',
              jobCode: 'ACT14',
              tasks: [
                {
                  id: 'T10-1',
                  stageName: 'Exhibit / Submission Batches execution',
                  deliverableName: 'Exhibit / Submission Batches Execution (3 Batches)',
                  activityName: 'Executed Batch Manufacturing Records & Stability',
                  taskName: 'Batch 1, 2 and 3 executed BMR packages',
                  documentsCount: 6,
                  documents: [
                    { id: 1, title: 'Executed_BMR_Batch_001.pdf', uploadedDate: '2026-10-02' },
                    { id: 2, title: 'Executed_BMR_Batch_002.pdf', uploadedDate: '2026-10-10' },
                    { id: 3, title: 'Executed_BMR_Batch_003.pdf', uploadedDate: '2026-10-18' },
                    { id: 4, title: 'Batch_Release_Certificates_COA.pdf', uploadedDate: '2026-10-25' },
                    { id: 5, title: 'Process_Validation_Report.pdf', uploadedDate: '2026-11-01' },
                    { id: 6, title: 'Exhibit_Stability_Station_Log.pdf', uploadedDate: '2026-11-05' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 14. Gate 4: EB Stability
    const gate4: GateNode = {
      id: 'G4',
      type: 'gate',
      gateCode: 'Gate 4',
      gateName: 'EB Stability',
      documents: [
        { id: 'GD4-1', gateCode: 'Gate 4', gateName: 'EB Stability', documentTitle: 'Exhibit/Registration Batch Scale Manufacturing Dossier', uploadedDate: '2026-11-10', uploadedBy: 'Plant GM' },
        { id: 'GD4-2', gateCode: 'Gate 4', gateName: 'EB Stability', documentTitle: 'Exhibit Batch Release Specifications Compliance Certificate', uploadedDate: '2026-11-12', uploadedBy: 'Head QA' },
        { id: 'GD4-3', gateCode: 'Gate 4', gateName: 'EB Stability', documentTitle: 'Pilot Bioequivalence (BE) Study Comparison Trend Report', uploadedDate: '2026-11-15', uploadedBy: 'Clinical Lead' },
        { id: 'GD4-4', gateCode: 'Gate 4', gateName: 'EB Stability', documentTitle: '6-Month Exhibit Batch Stability Data Package', uploadedDate: '2026-11-20', uploadedBy: 'Stability Section Head' },
        { id: 'GD4-5', gateCode: 'Gate 4', gateName: 'EB Stability', documentTitle: 'CMC Quality Data Package Consistency Audit', uploadedDate: '2026-11-25', uploadedBy: 'Regulatory Affairs' },
        { id: 'GD4-6', gateCode: 'Gate 4', gateName: 'EB Stability', documentTitle: 'Gate 4 EB Stability Approval Recommendation', uploadedDate: '2026-11-30', uploadedBy: 'Steering Committee' }
      ]
    };

    // 15. Stage 11: Pivotal BE studies
    const stage11: StageNode = {
      id: 'S11',
      type: 'stage',
      stageCode: 'S11',
      stageName: 'Pivotal BE studies',
      gateCode: '-',
      expanded: false,
      deliverables: [
        {
          id: 'D11-1',
          name: 'Pivotal Bioequivalence Clinical Study & CSR',
          expanded: false,
          activities: [
            {
              id: 'A11-1',
              name: 'Clinical Study Protocol & Bioanalytical Validation',
              jobCode: 'ACT15',
              tasks: [
                {
                  id: 'T11-1',
                  stageName: 'Pivotal BE studies',
                  deliverableName: 'Pivotal Bioequivalence Clinical Study & CSR',
                  activityName: 'Clinical Study Protocol & Bioanalytical Validation',
                  taskName: 'Clinical Study Report (CSR) and statistical BE assessment',
                  documentsCount: 5,
                  documents: [
                    { id: 1, title: 'IRB_Approved_Clinical_Protocol.pdf', uploadedDate: '2026-12-05' },
                    { id: 2, title: 'Bioanalytical_Method_Validation_Report.pdf', uploadedDate: '2026-12-15' },
                    { id: 3, title: 'Pharmacokinetic_Data_Set_PK.xlsx', uploadedDate: '2027-01-10' },
                    { id: 4, title: 'Bioequivalence_Statistical_Analysis.pdf', uploadedDate: '2027-01-20' },
                    { id: 5, title: 'Final_Clinical_Study_Report_CSR.pdf', uploadedDate: '2027-01-25' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 16. Stage 12: Dossier preparation and filing
    const stage12: StageNode = {
      id: 'S12',
      type: 'stage',
      stageCode: 'S12',
      stageName: 'Dossier preparation and filing',
      gateCode: 'Gate 5',
      expanded: false,
      deliverables: [
        {
          id: 'D12-1',
          name: 'eCTD Regulatory Submission Dossier Preparation',
          expanded: false,
          activities: [
            {
              id: 'A12-1',
              name: 'Product Development Report (PDR) & Module 3 Compilation',
              jobCode: 'ACT16',
              tasks: [
                {
                  id: 'T12-1',
                  stageName: 'Dossier preparation and filing',
                  deliverableName: 'eCTD Regulatory Submission Dossier Preparation',
                  activityName: 'Product Development Report (PDR) & Module 3 Compilation',
                  taskName: 'PDR compilation and Module 3 CMC sections finalization',
                  documentsCount: 6,
                  documents: [
                    { id: 1, title: 'Product_Development_Report_PDR.pdf', uploadedDate: '2027-02-05' },
                    { id: 2, title: 'Module_3_2_P_Drug_Product.pdf', uploadedDate: '2027-02-12' },
                    { id: 3, title: 'Module_3_2_S_Drug_Substance.pdf', uploadedDate: '2027-02-18' },
                    { id: 4, title: 'Module_2_Quality_Overall_Summary.pdf', uploadedDate: '2027-02-25' },
                    { id: 5, title: 'Module_1_Administrative_Forms.pdf', uploadedDate: '2027-03-01' },
                    { id: 6, title: 'eCTD_Validation_Report_No_Errors.pdf', uploadedDate: '2027-03-05' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    // 17. Gate 5: Regulatory Approval
    const gate5: GateNode = {
      id: 'G5',
      type: 'gate',
      gateCode: 'Gate 5',
      gateName: 'Regulatory Approval',
      documents: [
        { id: 'GD5-1', gateCode: 'Gate 5', gateName: 'Regulatory Approval', documentTitle: 'eCTD Module 1 - Administrative Documentation & Cover Letter', uploadedDate: '2027-03-10', uploadedBy: 'Director Regulatory Affairs' },
        { id: 'GD5-2', gateCode: 'Gate 5', gateName: 'Regulatory Approval', documentTitle: 'eCTD Module 2 - Common Technical Document Summaries', uploadedDate: '2027-03-12', uploadedBy: 'Medical Regulatory Writing' },
        { id: 'GD5-3', gateCode: 'Gate 5', gateName: 'Regulatory Approval', documentTitle: 'eCTD Module 3 - Quality / CMC Technical Dossier Package', uploadedDate: '2027-03-15', uploadedBy: 'CMC Section Head' },
        { id: 'GD5-4', gateCode: 'Gate 5', gateName: 'Regulatory Approval', documentTitle: 'FDA Electronic Gateway Submission Acknowledgment Notice', uploadedDate: '2027-03-20', uploadedBy: 'eCTD Publishing Lead' },
        { id: 'GD5-5', gateCode: 'Gate 5', gateName: 'Regulatory Approval', documentTitle: 'Final Regulatory Submission Dossier Gate 5 Sign-off', uploadedDate: '2027-03-25', uploadedBy: 'Global Executive Board' }
      ]
    };

    // Construct master array in sequence matching StagesComponent
    this.allTreeNodes = [
      stage1,
      gate1,
      stage2,
      stage3,
      stage4,
      gate2,
      stage5,
      stage6,
      gate3,
      stage7,
      stage8,
      stage9,
      stage10,
      gate4,
      stage11,
      stage12,
      gate5
    ];
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
            uploadedBy: 'Admin_User'
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
      queryParams: { code: this.projectCode || '2026/GEN/001', name: this.projectName || 'Generic Tablet Development' }
    });
  }
}
