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
  productName: string = 'Abiraterone Acetate Film Coated Tablets';
  projectCode: string = '2026/RD/001';
  strength: string = '250 mg / 500 mg';
  market: string = 'US (USFDA) & Europe (EMA)';
  ttdNumber: string = 'TTD/2026/OSD/042';
  versionNumber: string = 'v2.1';

  // Save feedback state
  ttdNumberSaved: boolean = false;
  versionNumberSaved: boolean = false;

  // Check Points Data matching Image 1 and Image 2
  checkPointsList: TtdCheckPoint[] = [
    {
      id: 1,
      sNo: '1.',
      checkPoint: 'Title Page',
      status: 'Yes',
      remarks: 'Title page verified with exact product name, dosage form, and facility codes.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'TTD_Title_Page_Approved.pdf', uploadedDate: '2026-02-10' },
        { id: 2, title: 'Product_Dossier_Index.pdf', uploadedDate: '2026-02-12' }
      ]
    },
    {
      id: 2,
      sNo: '2.',
      checkPoint: 'Approval Page',
      status: 'Yes',
      remarks: 'Signed off by Head of R&D, Tech Transfer Lead, and Plant QA Head.',
      documentsCount: 3,
      documents: [
        { id: 1, title: 'Executed_Signoff_Page.pdf', uploadedDate: '2026-02-14' },
        { id: 2, title: 'QA_Approval_Certificate.pdf', uploadedDate: '2026-02-15' },
        { id: 3, title: 'Steering_Committee_Minutes.pdf', uploadedDate: '2026-02-16' }
      ]
    },
    {
      id: 3,
      sNo: '3.',
      checkPoint: 'Table of contents',
      status: 'Yes',
      remarks: 'Comprehensive TOC linking all 28 sub-sections with cross-references.',
      documentsCount: 1,
      documents: [
        { id: 1, title: 'Table_of_Contents_v2.1.pdf', uploadedDate: '2026-02-18' }
      ]
    },
    {
      id: 4,
      sNo: '4.',
      checkPoint: 'Scope and Scheme',
      status: 'Yes',
      remarks: 'Manufacturing equipment capacities and commercial flow diagram defined.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Commercial_Process_Scheme.pdf', uploadedDate: '2026-02-20' },
        { id: 2, title: 'Scope_Demarcation_Protocol.pdf', uploadedDate: '2026-02-22' }
      ]
    },
    {
      id: 5,
      sNo: '5.',
      checkPoint: 'Test license',
      status: 'Yes',
      remarks: 'Form 29 valid manufacturing test license copy attached.',
      documentsCount: 4,
      documents: [
        { id: 1, title: 'Form_29_Test_License.pdf', uploadedDate: '2026-02-25' },
        { id: 2, title: 'State_FDA_Approval_Letter.pdf', uploadedDate: '2026-02-26' },
        { id: 3, title: 'Factory_Endorsement_Copy.pdf', uploadedDate: '2026-02-28' },
        { id: 4, title: 'License_Validity_Verification.pdf', uploadedDate: '2026-03-01' }
      ]
    },
    {
      id: 6,
      sNo: '6.',
      checkPoint: 'Procurement package',
      status: 'Yes',
      remarks: 'Vendor qualification audit certificates for API & critical excipients.',
      documentsCount: 3,
      documents: [
        { id: 1, title: 'API_Vendor_Audit_Package.pdf', uploadedDate: '2026-03-02' },
        { id: 2, title: 'Excipient_Supplier_COA_Dossier.pdf', uploadedDate: '2026-03-04' },
        { id: 3, title: 'Secondary_Packaging_Supplier_Audit.pdf', uploadedDate: '2026-03-05' }
      ]
    },
    {
      id: 7,
      sNo: '7.',
      checkPoint: 'Drug Substance Specifications and Standard Test Procedure',
      status: 'Yes',
      remarks: 'API release specs, impurity limits, and HPLC assay method validation.',
      documentsCount: 5,
      documents: [
        { id: 1, title: 'API_Release_Specifications.pdf', uploadedDate: '2026-03-06' },
        { id: 2, title: 'STP_Drug_Substance_Assay.pdf', uploadedDate: '2026-03-08' },
        { id: 3, title: 'Related_Substances_Validation_Report.pdf', uploadedDate: '2026-03-10' },
        { id: 4, title: 'Residual_Solvents_STP.pdf', uploadedDate: '2026-03-12' },
        { id: 5, title: 'Particle_Size_Distribution_STP.pdf', uploadedDate: '2026-03-14' }
      ]
    },
    {
      id: 8,
      sNo: '8.',
      checkPoint: 'Raw material Specifications and Standard Test Procedure',
      status: 'Yes',
      remarks: 'Pharmacopoeial compliance tests for Lactose, Microcrystalline Cellulose, etc.',
      documentsCount: 4,
      documents: [
        { id: 1, title: 'Excipients_Specifications_Compendium.pdf', uploadedDate: '2026-03-15' },
        { id: 2, title: 'STP_Excipients_Release_Testing.pdf', uploadedDate: '2026-03-16' },
        { id: 3, title: 'Magnesium_Stearate_Monograph.pdf', uploadedDate: '2026-03-18' },
        { id: 4, title: 'Coating_Polymer_Opadry_Specs.pdf', uploadedDate: '2026-03-20' }
      ]
    },
    {
      id: 9,
      sNo: '9.',
      checkPoint: 'Packaging material Specifications and Standard Test Procedure',
      status: 'Yes',
      remarks: 'Alu-Alu blister foil, PVC-PVDC, cartons, and package insert specs.',
      documentsCount: 3,
      documents: [
        { id: 1, title: 'Alu_Alu_Foil_Specs_STP.pdf', uploadedDate: '2026-03-22' },
        { id: 2, title: 'Carton_Packaging_Artwork_Specs.pdf', uploadedDate: '2026-03-24' },
        { id: 3, title: 'Leaflet_Approved_Content_Proof.pdf', uploadedDate: '2026-03-25' }
      ]
    },
    {
      id: 10,
      sNo: '10.',
      checkPoint: 'Finished product Specifications and Standard Test Procedures: In-process; Release and Shelf-life',
      status: 'Yes',
      remarks: 'Blend uniformity, hardness, friability, dissolution, assay, and degradation.',
      documentsCount: 6,
      documents: [
        { id: 1, title: 'Finished_Product_Specifications.pdf', uploadedDate: '2026-03-26' },
        { id: 2, title: 'In_Process_Test_Specifications_IPQA.pdf', uploadedDate: '2026-03-28' },
        { id: 3, title: 'STP_Finished_Tablet_Assay.pdf', uploadedDate: '2026-03-30' },
        { id: 4, title: 'STP_Dissolution_Method_Validation.pdf', uploadedDate: '2026-04-02' },
        { id: 5, title: 'Content_Uniformity_STP.pdf', uploadedDate: '2026-04-04' },
        { id: 6, title: 'Shelf_Life_Specification_Limits.pdf', uploadedDate: '2026-04-05' }
      ]
    },
    {
      id: 11,
      sNo: '11.',
      checkPoint: 'Master Formula Record',
      status: 'Yes',
      remarks: 'MFR detailing step-by-step dispensing, granulation, blending, and compression.',
      documentsCount: 4,
      documents: [
        { id: 1, title: 'MFR_Dispensing_Granulation.pdf', uploadedDate: '2026-04-06' },
        { id: 2, title: 'MFR_Compression_Parameters.pdf', uploadedDate: '2026-04-08' },
        { id: 3, title: 'MFR_Film_Coating_Operations.pdf', uploadedDate: '2026-04-10' },
        { id: 4, title: 'MFR_QA_Authorized_Master.pdf', uploadedDate: '2026-04-12' }
      ]
    },
    {
      id: 12,
      sNo: '12.',
      checkPoint: 'Master Packaging Record',
      status: 'Yes',
      remarks: 'MPR detailing blister packing speeds, temperature parameters, and carton boxing.',
      documentsCount: 3,
      documents: [
        { id: 1, title: 'MPR_Blister_Forming_Sealing.pdf', uploadedDate: '2026-04-14' },
        { id: 2, title: 'MPR_Secondary_Cartoning_Line.pdf', uploadedDate: '2026-04-16' },
        { id: 3, title: 'Shipper_Box_Case_Packing_SOP.pdf', uploadedDate: '2026-04-18' }
      ]
    },

    // S.No 13: Stability Plan Group (5 rows spanned under S.No 13 matching Image 1)
    {
      id: 13,
      sNo: '13.',
      checkPoint: 'Stability Plan.',
      isGroupHeader: true,
      groupSpan: 5,
      status: 'Yes',
      remarks: 'ICH Q1A protocol: 25°C/60% RH, 30°C/65% RH, 40°C/75% RH testing schedule.',
      documentsCount: 4,
      documents: [
        { id: 1, title: 'ICH_Stability_Protocol_Master.pdf', uploadedDate: '2026-04-20' },
        { id: 2, title: 'Stability_Chamber_Validation_Log.pdf', uploadedDate: '2026-04-22' },
        { id: 3, title: 'Accelerated_Testing_Interval_Map.pdf', uploadedDate: '2026-04-24' },
        { id: 4, title: 'Long_Term_Zone_IVb_Schedule.pdf', uploadedDate: '2026-04-25' }
      ]
    },
    {
      id: 14,
      sNo: '',
      checkPoint: 'Photo stability Plan',
      isGroupPart: true,
      status: 'Yes',
      remarks: 'ICH Q1B Option 2 light exposure testing protocol and quartz chamber logs.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Photo_Stability_Study_Protocol.pdf', uploadedDate: '2026-04-26' },
        { id: 2, title: 'Lux_Hours_UV_Exposure_Log.pdf', uploadedDate: '2026-04-28' }
      ]
    },
    {
      id: 15,
      sNo: '',
      checkPoint: 'Routine stability study plan',
      isGroupPart: true,
      status: 'Yes',
      remarks: 'Annual commercial batch ongoing stability commitment protocol.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Routine_Stability_Commitment.pdf', uploadedDate: '2026-04-29' },
        { id: 2, title: 'Commercial_Testing_Frequency_Matrix.pdf', uploadedDate: '2026-04-30' }
      ]
    },
    {
      id: 16,
      sNo: '',
      checkPoint: 'In-Use stability plan',
      isGroupPart: true,
      status: 'N/A',
      remarks: 'Not applicable for unit-dose blister packed solid oral tablets.',
      documentsCount: 1,
      documents: [
        { id: 1, title: 'In_Use_Stability_Exemption_Note.pdf', uploadedDate: '2026-05-02' }
      ]
    },
    {
      id: 17,
      sNo: '',
      checkPoint: 'XRD-Stability study plan',
      isGroupPart: true,
      status: 'Yes',
      remarks: 'X-Ray Powder Diffraction study confirming crystal form retention over shelf life.',
      documentsCount: 3,
      documents: [
        { id: 1, title: 'XRD_Polymorphic_Study_Protocol.pdf', uploadedDate: '2026-05-04' },
        { id: 2, title: 'Diffraction_Pattern_Overlay_Report.pdf', uploadedDate: '2026-05-06' },
        { id: 3, title: 'Solid_State_Stability_Evaluation.pdf', uploadedDate: '2026-05-08' }
      ]
    },

    {
      id: 18,
      sNo: '14.',
      checkPoint: 'Deactivation Study Protocol (If applicable)',
      status: 'N/A',
      remarks: 'Non-cytotoxic generic tablet molecule; chemical deactivation not required.',
      documentsCount: 1,
      documents: [
        { id: 1, title: 'Deactivation_Requirement_Assessment.pdf', uploadedDate: '2026-05-10' }
      ]
    },
    {
      id: 19,
      sNo: '15.',
      checkPoint: 'Trade Dress Proposal Form [TDPF] (If applicable)',
      status: 'Yes',
      remarks: 'Tablet shape, debossing, color, and packaging artwork regulatory signoff.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Trade_Dress_Proposal_Signed.pdf', uploadedDate: '2026-05-12' },
        { id: 2, title: 'Color_Shade_Card_Approval.pdf', uploadedDate: '2026-05-14' }
      ]
    },
    {
      id: 20,
      sNo: '16.',
      checkPoint: 'Photo stability plan',
      status: 'Yes',
      remarks: 'Finished product blister packaging photostability confirmation report.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Packaged_Product_Photostability.pdf', uploadedDate: '2026-05-15' },
        { id: 2, title: 'Optical_Density_Analysis.pdf', uploadedDate: '2026-05-16' }
      ]
    },
    {
      id: 21,
      sNo: '17.',
      checkPoint: 'Temperature Excursion',
      status: 'Yes',
      remarks: 'Temperature excursion study report covering short-term cold/hot shipping ranges.',
      documentsCount: 3,
      documents: [
        { id: 1, title: 'Temperature_Excursion_Protocol.pdf', uploadedDate: '2026-05-18' },
        { id: 2, title: 'Shipping_Simulation_Data_Log.pdf', uploadedDate: '2026-05-20' },
        { id: 3, title: 'Quality_Impact_Excursion_Report.pdf', uploadedDate: '2026-05-22' }
      ]
    },
    {
      id: 22,
      sNo: '18.',
      checkPoint: 'Thermal Cycling Stability plan',
      status: 'Yes',
      remarks: 'Thermal stress cycling (4°C to 40°C alternate cycles) completed without phase separation.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Thermal_Cycling_Protocol_Results.pdf', uploadedDate: '2026-05-24' },
        { id: 2, title: 'Stress_Testing_Data_Sheets.pdf', uploadedDate: '2026-05-26' }
      ]
    },
    {
      id: 23,
      sNo: '19.',
      checkPoint: 'Miscellaneous Study protocol',
      status: 'Yes',
      remarks: 'Friability after 1000 drops, moisture permeability and hardness extremes.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Mechanical_Stress_Friability_Study.pdf', uploadedDate: '2026-05-28' },
        { id: 2, title: 'Moisture_Sorption_Isotherm.pdf', uploadedDate: '2026-05-30' }
      ]
    },
    {
      id: 24,
      sNo: '20.',
      checkPoint: 'Reconstitution and Admixture study protocol',
      status: 'N/A',
      remarks: 'Solid oral tablet formulation; reconstitution study not applicable.',
      documentsCount: 1,
      documents: [
        { id: 1, title: 'Dosage_Form_Evaluation_Justification.pdf', uploadedDate: '2026-06-02' }
      ]
    },
    {
      id: 25,
      sNo: '21.',
      checkPoint: 'Dissolution Protocol (if applicable)',
      status: 'Yes',
      remarks: 'Biorelevant dissolution (FaSSIF, FeSSIF, pH 1.2, 4.5, 6.8) profiling study.',
      documentsCount: 4,
      documents: [
        { id: 1, title: 'Multi_Media_Dissolution_Protocol.pdf', uploadedDate: '2026-06-05' },
        { id: 2, title: 'Biorelevant_Media_Profile_Report.pdf', uploadedDate: '2026-06-08' },
        { id: 3, title: 'F2_Calculation_RLD_Similarity.xlsx', uploadedDate: '2026-06-10' },
        { id: 4, title: 'Apparatus_Qualification_Records.pdf', uploadedDate: '2026-06-12' }
      ]
    },
    {
      id: 26,
      sNo: '22.',
      checkPoint: 'Filter validation study protocol and Report',
      status: 'N/A',
      remarks: 'Dry granulation solid tablet formulation; liquid filtration not used.',
      documentsCount: 1,
      documents: [
        { id: 1, title: 'Process_Validation_Applicability_Review.pdf', uploadedDate: '2026-06-15' }
      ]
    },
    {
      id: 27,
      sNo: '23.',
      checkPoint: 'CPP & CQA',
      status: 'Yes',
      remarks: 'Comprehensive QbD mapping of Critical Process Parameters and Quality Attributes.',
      documentsCount: 5,
      documents: [
        { id: 1, title: 'QbD_Risk_Assessment_Matrix.pdf', uploadedDate: '2026-06-18' },
        { id: 2, title: 'CPP_Granulation_Impeller_Speed.pdf', uploadedDate: '2026-06-20' },
        { id: 3, title: 'CQA_Tablet_Disintegration_Range.pdf', uploadedDate: '2026-06-22' },
        { id: 4, title: 'Compression_Force_Optimization_DoE.pdf', uploadedDate: '2026-06-25' },
        { id: 5, title: 'Process_Control_Strategy_Summary.pdf', uploadedDate: '2026-06-28' }
      ]
    },
    {
      id: 28,
      sNo: '24.',
      checkPoint: 'Tool Drawings',
      status: 'Yes',
      remarks: 'Approved punch and die tooling engineering mechanical blueprints.',
      documentsCount: 3,
      documents: [
        { id: 1, title: 'Punch_Die_Tooling_Blueprints.pdf', uploadedDate: '2026-07-02' },
        { id: 2, title: 'Embossing_Specification_CAD.pdf', uploadedDate: '2026-07-05' },
        { id: 3, title: 'Tooling_Vendor_FAT_Certificate.pdf', uploadedDate: '2026-07-08' }
      ]
    },
    {
      id: 29,
      sNo: '25.',
      checkPoint: 'Packaging material development report (if applicable)',
      status: 'Yes',
      remarks: 'Blister pocket depth, sealing integrity, and leak test qualification report.',
      documentsCount: 3,
      documents: [
        { id: 1, title: 'Packaging_Development_Report.pdf', uploadedDate: '2026-07-10' },
        { id: 2, title: 'Sealing_Integrity_Dye_Penetration.pdf', uploadedDate: '2026-07-12' },
        { id: 3, title: 'Primary_Packaging_Compatibility.pdf', uploadedDate: '2026-07-15' }
      ]
    },
    {
      id: 30,
      sNo: '26.',
      checkPoint: 'Material Safety Data Sheet',
      status: 'Yes',
      remarks: '16-section OSHA/GHS Material Safety Data Sheets for API, excipients, and intermediate blend.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'MSDS_Active_Pharmaceutical_Ingredient.pdf', uploadedDate: '2026-07-18' },
        { id: 2, title: 'MSDS_Finished_Drug_Product.pdf', uploadedDate: '2026-07-20' }
      ]
    },
    {
      id: 31,
      sNo: '27.',
      checkPoint: 'Consumables',
      status: 'Yes',
      remarks: 'Comprehensive list of approved plant cleanroom consumables, liners, and gaskets.',
      documentsCount: 2,
      documents: [
        { id: 1, title: 'Manufacturing_Consumables_List.pdf', uploadedDate: '2026-07-22' },
        { id: 2, title: 'Food_Grade_Silicone_Gasket_COA.pdf', uploadedDate: '2026-07-25' }
      ]
    },
    {
      id: 32,
      sNo: '28.',
      checkPoint: 'Change History',
      status: 'Yes',
      remarks: 'Document change history log tracking revisions from draft v1.0 through final v2.1.',
      documentsCount: 4,
      documents: [
        { id: 1, title: 'TTD_Change_History_Log.pdf', uploadedDate: '2026-07-28' },
        { id: 2, title: 'Change_Control_CCR_2026_089.pdf', uploadedDate: '2026-07-30' },
        { id: 3, title: 'Version_1_0_Superseded_Archive.pdf', uploadedDate: '2026-08-01' },
        { id: 4, title: 'Version_2_0_Redline_Comparison.pdf', uploadedDate: '2026-08-05' }
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
          { id: 1, title: `${item.checkPoint.replace(/[^a-zA-Z0-9]/g, '_')}_DQA_Signed.pdf`, uploadedDate: '2026-03-15' },
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
