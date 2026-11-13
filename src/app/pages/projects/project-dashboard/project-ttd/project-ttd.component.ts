import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';
import { RemarksPopComponent } from '../../../../common/shared/remarks-pop/remarks-pop.component';

export interface TtdCheckPoint {
  id: number;
  sNo: string;
  checkPoint: string;
  isGroupHeader?: boolean;
  isGroupPart?: boolean;
  groupSpan?: number;
  status: 'Yes' | 'No' | 'N/A' | null;
  remarks: string;
  documentsCount: number;
  documents?: { id: number; title: string; uploadedDate?: string }[];
}

@Component({
  selector: 'app-project-ttd',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './project-ttd.component.html',
  styleUrl: './project-ttd.component.scss'
})
export class ProjectTtdComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // Header and Top Information Table fields
  productName: string = 'Industrial Equipment Line Expansion';
  projectCode: string = '2026/IND/001';
  strength: string = '120 Units/Hr | 480V 3-Phase';
  market: string = 'Detroit Assembly Hub (NA) & Stuttgart Plant (EU)';
  ttdNumber: string = 'TTD/2026/IND/042';
  versionNumber: string = 'v2.1';

  // Save feedback state
  ttdNumberSaved: boolean = false;
  versionNumberSaved: boolean = false;

  // Check Points Data for Industrial Technical Transfer Dossier (TTD)
  checkPointsList: TtdCheckPoint[] = [
    {
      id: 1,
      sNo: '1.',
      checkPoint: 'Title Page & Equipment Serial Registry',
      status: 'Yes',
      remarks: 'Title page verified with exact equipment line ID, asset code, and plant location.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'TTD_Title_Page_Approved.pdf', uploadedDate: '2026-02-10' },
        { id: 2, title: 'Equipment_Asset_Registry_Index.pdf', uploadedDate: '2026-02-12' }
      ]
    },
    {
      id: 2,
      sNo: '2.',
      checkPoint: 'Cross-Functional Approval Page',
      status: 'Yes',
      remarks: 'Signed off by Head of Engineering, Controls Lead, and Plant Operations Director.',
      documentsCount: 3,
      documents: [
        { id: 1, title: 'Executed_Signoff_Page.pdf', uploadedDate: '2026-02-14' },
        { id: 2, title: 'Plant_QA_Approval_Certificate.pdf', uploadedDate: '2026-02-15' },
        { id: 3, title: 'Steering_Committee_Minutes.pdf', uploadedDate: '2026-02-16' }
      ]
    },
    {
      id: 3,
      sNo: '3.',
      checkPoint: 'Table of Contents & Dossier Map',
      status: 'Yes',
      remarks: 'Comprehensive TOC linking all engineering drawings, BOMs, and SAT/OQ sections.',
      documentsCount: 1,
      documents: [
        { id: 1, title: 'Table_of_Contents_v2.1.pdf', uploadedDate: '2026-02-18' }
      ]
    },
    {
      id: 4,
      sNo: '4.',
      checkPoint: 'Scope, Line Throughput & Layout Scheme',
      status: 'Yes',
      remarks: 'Equipment footprint, material flow, and rated line takt time defined.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Line_Layout_Floorplan_Rev3.pdf', uploadedDate: '2026-02-20' },
        { id: 2, title: 'Material_Flow_Schematic.pdf', uploadedDate: '2026-02-21' }
      ]
    },
    {
      id: 5,
      sNo: '5.',
      checkPoint: 'Engineering Teams & OEM Stakeholders Roster',
      status: 'Yes',
      remarks: 'Contact matrix covering OEM service engineers, PLC integrators, and plant maintenance.',
      documentsCount: 1,
      documents: [
        { id: 1, title: 'Cross_Functional_Responsibility_Matrix.pdf', uploadedDate: '2026-02-22' }
      ]
    },
    {
      id: 6,
      sNo: '6.',
      checkPoint: 'User Requirements Specification (URS) Baseline',
      status: 'Yes',
      remarks: 'Approved URS covering cycle time, OEE >= 85%, and dimensional tolerance limits.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'URS_Baseline_Approved.pdf', uploadedDate: '2026-02-24' },
        { id: 2, title: 'URS_Traceability_Matrix.xlsx', uploadedDate: '2026-02-25' }
      ]
    },
    {
      id: 7,
      sNo: '7.',
      checkPoint: 'Bill of Materials (BOM) & Critical Component Spec',
      status: 'Yes',
      remarks: 'Full indented BOM, metallurgy grades, and EN 10204 3.1 mill certificates compiled.',
      documentsCount: 3,
      documents: [
        { id: 1, title: 'Indented_BOM_Master_Rev4.xlsx', uploadedDate: '2026-02-26' },
        { id: 2, title: 'Alloy_Steel_Mill_Test_Certs.pdf', uploadedDate: '2026-02-27' },
        { id: 3, title: 'Approved_Vendor_AVL_List.pdf', uploadedDate: '2026-02-28' }
      ]
    },
    {
      id: 8,
      sNo: '8.',
      checkPoint: '3D CAD As-Built Assemblies & GD&T Drawings',
      status: 'Yes',
      remarks: 'Released STEP models, tolerance stack-up reports, and as-built shop drawings archived.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'AsBuilt_CAD_Assembly_Drawings.pdf', uploadedDate: '2026-03-02' },
        { id: 2, title: 'GDT_Tolerance_StackUp_Analysis.pdf', uploadedDate: '2026-03-03' }
      ]
    },
    {
      id: 9,
      sNo: '9.',
      checkPoint: 'Electrical Schematics, PLC Logic & SCADA Backup',
      status: 'Yes',
      remarks: 'Panel wiring schematics, I/O tag map, and golden-master PLC/HMI software package verified.',
      documentsCount: 3,
      documents: [
        { id: 1, title: 'Electrical_Panel_Schematics_EPLAN.pdf', uploadedDate: '2026-03-05' },
        { id: 2, title: 'PLC_SCADA_Golden_Backup_Log.pdf', uploadedDate: '2026-03-06' },
        { id: 3, title: 'OPC_UA_Telemetry_Tag_Dictionary.xlsx', uploadedDate: '2026-03-07' }
      ]
    },
    {
      id: 10,
      sNo: '10.',
      checkPoint: 'Utility Requirements (Power, Air, Chilled Water, HVAC)',
      status: 'Yes',
      remarks: 'Peak kVA, compressed air CFM, cooling flow rates, and exhaust duct specs verified.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Plant_Utility_TieIn_Schedule.pdf', uploadedDate: '2026-03-09' },
        { id: 2, title: 'Substation_Feeder_Load_Study.pdf', uploadedDate: '2026-03-10' }
      ]
    },
    {
      id: 11,
      sNo: '11.',
      checkPoint: 'Design FMEA & HAZOP Machine Safety Dossier',
      status: 'Yes',
      remarks: 'All RPN > 100 risk modes mitigated; ISO 13849 PLd safety interlock validation closed.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Design_FMEA_HAZOP_Report.pdf', uploadedDate: '2026-03-12' },
        { id: 2, title: 'ISO_13849_Safety_Circuit_Signoff.pdf', uploadedDate: '2026-03-13' }
      ]
    },
    {
      id: 12,
      sNo: '12.',
      checkPoint: 'Factory Acceptance Test (FAT) Report & Witness Log',
      status: 'Yes',
      remarks: 'OEM FAT dry-run and dimensional capability trials signed off with zero critical punch items.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'OEM_FAT_Executed_Protocol.pdf', uploadedDate: '2026-03-15' },
        { id: 2, title: 'FAT_Punchlist_Closure_Report.pdf', uploadedDate: '2026-03-16' }
      ]
    },
    {
      id: 13,
      sNo: '13.',
      checkPoint: 'a) Metrology & Instrument Calibration Schedule',
      isGroupHeader: true,
      groupSpan: 3,
      status: 'Yes',
      remarks: 'NIST/NABL traceable calibration certificates logged for all pressure, load, and laser sensors.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Sensor_Calibration_Certificates.pdf', uploadedDate: '2026-03-18' },
        { id: 2, title: 'CMM_Metrology_Gage_RR.pdf', uploadedDate: '2026-03-19' }
      ]
    },
    {
      id: 14,
      sNo: '13.',
      checkPoint: 'b) Mechanical Endurance & Thermal Load Protocol',
      isGroupPart: true,
      status: 'Yes',
      remarks: '72-hour continuous spindle, bearing vibration, and hydraulic thermal endurance checks passed.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Vibration_Thermal_Endurance_Log.pdf', uploadedDate: '2026-03-21' },
        { id: 2, title: 'ISO_10816_Vibration_Baseline.pdf', uploadedDate: '2026-03-22' }
      ]
    },
    {
      id: 15,
      sNo: '13.',
      checkPoint: 'c) Multi-Shift OEE Ramp-Up Stress Protocol',
      isGroupPart: true,
      status: 'No',
      remarks: 'Final 3-shift OQ production ramp-up endurance report scheduled post-SAT completion.',
      documentsCount: 1,
      documents: [
        { id: 1, title: 'OQ_Three_Shift_Endurance_Plan.pdf', uploadedDate: '2026-03-24' }
      ]
    },
    {
      id: 16,
      sNo: '14.',
      checkPoint: 'Installation Qualification (IQ) & Rigging Report',
      status: 'No',
      remarks: 'Precision laser alignment and anchor torque verification pending final bay tie-in.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Foundation_Laser_Alignment_Protocol.pdf', uploadedDate: '2026-03-26' },
        { id: 2, title: 'Heavy_Rigging_Lift_Plan.pdf', uploadedDate: '2026-03-27' }
      ]
    },
    {
      id: 17,
      sNo: '15.',
      checkPoint: 'Site Acceptance Test (SAT) Performance Package',
      status: 'No',
      remarks: 'SAT Cpk >= 1.33 capability trials prepared for execution under Plant Operations witness.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'SAT_Test_Script_Rev2.pdf', uploadedDate: '2026-03-29' },
        { id: 2, title: 'Cpk_Statistical_Sampling_Plan.pdf', uploadedDate: '2026-03-30' }
      ]
    },
    {
      id: 18,
      sNo: '16.',
      checkPoint: 'EHS Machine Guarding, Noise & LOTO Validation',
      status: 'Yes',
      remarks: 'Acoustic enclosure (< 78 dBA), light curtains, and Lockout/Tagout energy isolation verified.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'EHS_LOTO_Isolation_Procedure.pdf', uploadedDate: '2026-04-02' },
        { id: 2, title: 'Plant_Noise_Ergonomics_Audit.pdf', uploadedDate: '2026-04-03' }
      ]
    },
    {
      id: 19,
      sNo: '17.',
      checkPoint: 'Critical Spare Parts List & Min-Max Inventory',
      status: 'Yes',
      remarks: 'Tier-1 wear spares, seals, servo drives, and spindle cartridges cataloged in plant stores.',
      documentsCount: 1,
      documents: [
        { id: 1, title: 'Critical_Spares_Stocking_Schedule.xlsx', uploadedDate: '2026-04-05' }
      ]
    },
    {
      id: 20,
      sNo: '18.',
      checkPoint: 'Preventive Maintenance (PM) & CMMS Schedules',
      status: 'No',
      remarks: 'Daily, weekly, and annual lubrication/PM task trees uploaded to plant CMMS sandbox.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'CMMS_PM_Schedule_Upload.xlsx', uploadedDate: '2026-04-08' },
        { id: 2, title: 'OEM_Maintenance_Manual_Vol1.pdf', uploadedDate: '2026-04-09' }
      ]
    },
    {
      id: 21,
      sNo: '19.',
      checkPoint: 'Operator SOPs & Maintenance Training Records',
      status: 'No',
      remarks: 'Classroom and hands-on operator/technician certification sessions scheduled pre-OQ.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Operator_Standard_Work_SOP.pdf', uploadedDate: '2026-04-12' },
        { id: 2, title: 'Technician_Certification_Attendance.pdf', uploadedDate: '2026-04-13' }
      ]
    },
    {
      id: 22,
      sNo: '20.',
      checkPoint: 'Third-Party CE / UL / OSHA Compliance Certificates',
      status: 'Yes',
      remarks: 'Conformity declarations, pressure vessel certifications, and EMC test certificates archived.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'CE_Declaration_of_Conformity.pdf', uploadedDate: '2026-04-15' },
        { id: 2, title: 'NFPA79_Electrical_Audit_Cert.pdf', uploadedDate: '2026-04-16' }
      ]
    },
    {
      id: 23,
      sNo: '21.',
      checkPoint: 'Engineering Change Notices (ECN) & Punch-List Log',
      status: 'N/A',
      remarks: 'No open Class-A deviations remaining prior to final Gate 5 handover board.',
      documentsCount: 1,
      documents: [
        { id: 1, title: 'ECN_Punchlist_Tracker.xlsx', uploadedDate: '2026-04-18' }
      ]
    },
    {
      id: 24,
      sNo: '22.',
      checkPoint: 'Final Plant Handover Certificate & Warranty Terms',
      status: 'No',
      remarks: '24-month OEM parts & service warranty SLA prepared for Gate 5 handover signature.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'OEM_Warranty_SLA_Agreement.pdf', uploadedDate: '2026-04-20' },
        { id: 2, title: 'Plant_Operations_Handover_Form.pdf', uploadedDate: '2026-04-21' }
      ]
    },
    {
      id: 25,
      sNo: '23.',
      checkPoint: 'TTD Document Control & Revision Change History',
      status: 'Yes',
      remarks: 'Revision audit trail verified from v1.0 Concept Baseline to v2.1 Commissioning Dossier.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'TTD_Change_History_Log.pdf', uploadedDate: '2026-04-22' },
        { id: 2, title: 'Version_2_1_Redline_Comparison.pdf', uploadedDate: '2026-04-24' }
      ]
    }
  ];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.productName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['strength']) {
        this.strength = params['strength'];
      }
      if (params['market']) {
        this.market = params['market'];
      }
      if (params['ttdNumber']) {
        this.ttdNumber = params['ttdNumber'];
      }
      if (params['versionNumber']) {
        this.versionNumber = params['versionNumber'];
      }
    });
  }

  // Set Status: Mutually exclusive between Yes, No, N/A
  setStatus(item: TtdCheckPoint, status: 'Yes' | 'No' | 'N/A'): void {
    if (item.status === status) {
      item.status = null;
    } else {
      item.status = status;
    }
  }

  // Save TTD Number
  saveTtdNumber(): void {
    this.ttdNumberSaved = true;
    setTimeout(() => {
      this.ttdNumberSaved = false;
    }, 2000);
  }

  // Save Version Number
  saveVersionNumber(): void {
    this.versionNumberSaved = true;
    setTimeout(() => {
      this.versionNumberSaved = false;
    }, 2000);
  }

  // Click on Documents number opens DocumentsPopComponent
  openDocuments(item: TtdCheckPoint): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title: `Documents — ${item.checkPoint}`,
        documents: item.documents || [
          { id: 1, title: `${item.checkPoint.replace(/[^a-zA-Z0-9]/g, '_')}_ENG_Signed.pdf`, uploadedDate: '2026-03-15' },
          { id: 2, title: `${item.checkPoint.replace(/[^a-zA-Z0-9]/g, '_')}_Execution_Record.pdf`, uploadedDate: '2026-03-20' }
        ]
      }
    });
  }

  // Click on Remarks opens RemarksPopComponent
  openRemarks(item: TtdCheckPoint): void {
    const dialogRef = this.dialog.open(RemarksPopComponent, {
      width: '500px',
      data: {
        title: `Remarks — ${item.checkPoint}`,
        placeholder: 'Enter remarks...',
        notes: item.remarks || ''
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result !== undefined && result !== null) {
        if (typeof result === 'string') {
          item.remarks = result;
        } else if (result && typeof result.notes === 'string') {
          item.remarks = result.notes;
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode, name: this.productName }
    });
  }
}
