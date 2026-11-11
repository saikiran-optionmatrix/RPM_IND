import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  commercialAttractivenessOptions,
  dosageForms,
  locations,
  projectLeads,
  projectOwners,
  targetMarkets,
} from '../projects-data';

export type ProjectTab =
  | 'overview'
  | 'timeline'
  | 'market'
  | 'productDetails'
  | 'innovator'
  | 'api'
  | 'others';

export interface TabItem {
  id: ProjectTab;
  label: string;
}

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss',
})
export class AddProjectComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  activeTab: ProjectTab = 'overview';
  tabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'market', label: 'Market' },
    { id: 'productDetails', label: 'Product Details' },
    { id: 'innovator', label: 'Innovator' },
    { id: 'api', label: 'API' },
    { id: 'others', label: 'Others' }
  ];

  // Option lists for dropdowns
  readonly divisionsList = [
    'Endocrinology / Diabetes',
    'Neurology',
    'Gastroenterology',
    'Anti-infectives',
    'Respiratory',
    'Oncology',
    'Diagnostics / Contrast Media',
    'Oral Solids - OS',
    'Injectables - IJ',
    'Complex Injectables - CI',
    'Biotech - BT',
  ];
  readonly templatesList = [
    'Generic Tablet Development',
    'Generic API Process Development',
    'Complex Injectable Development',
    'Generic API Development',
    'Generic Injectable Formulation',
  ];
  readonly locationsList = locations && locations.length ? locations : [
    'Hyderabad',
    'Mumbai',
    'Bengaluru',
    'Ahmedabad',
    'Pune',
    'Chennai',
    'Delhi',
    'Baddi',
  ];
  readonly projectOwnersList = projectOwners;
  readonly projectLeadsList = projectLeads;
  readonly dosageFormsList = dosageForms;
  readonly targetMarketsList = targetMarkets;
  readonly marketsList = targetMarkets;
  readonly commercialAttractivenessList = commercialAttractivenessOptions;
  readonly priorityOptionsList = ['Critical', 'High', 'Medium', 'Low'];
  readonly starProductList = ['Yes', 'No'];
  readonly registrationTypesList = [
    'Regularisation / Revalidation',
    'New Registration',
    'Renewal',
    'Variation',
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projectForm = this.fb.group({
      // 1. Overview (Project Identification)
      projectCode: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      module: [''],
      division: [''],
      starProduct: [''],
      registrationType: [''],
      projectOwner: [''],
      projectLead: [''],
      location: [''],
      template: [''],

      // 2. Timeline (Priority, Timeline & Budget)
      priority: [''],
      projectStartDate: [''],
      projectEndDate: [''],
      projectBudget: [''],

      // 3. Market (Market & Commercial)
      market: [''],
      marketSizeLast3Years: [''],
      marketSizeUsdMnYr: [''],
      projectedMarketShare: [''],
      commercialAttractiveness: [''],
      projectedNpv: [''],

      // 4. Product Details
      dosageForm: [''],
      strength: [''],
      fillVolume: [''],
      pharmacopoeia: [''],
      packagingDetails: [''],

      // 5. Innovator (Innovator / RLD & IP)
      innovatorCompany: [''],
      innovatorBrandName: [''],
      innovatorDosageForm: [''],
      innovatorStrengths: [''],
      innovatorApprovalDate: [''],
      innovatorPackPresentation: [''],
      innovatorBioStrength: [''],
      rldInformation: [''],
      innovatorVsJodas: [''],
      ipDetails: [''],

      // 6. API
      apiManufacturer: [''],
      polymorphForm: [''],
      cepDmfNoReceiptStatus: [''],
      dmfAsmfCepReceived: [''],
      apiVendorQualification: [''],
      apiMl: [''],
      apiGmp: [''],

      // 7. Others (Site & Regulatory Certificates & Bio Study & Remarks)
      ml: [''],
      whoGmp: [''],
      bioStudyCroName: [''],
      bioStudyCroGmpStatus: [''],
      beNoc: [''],
      studyTimePeriod: [''],
      bioStudyReport: [''],
      remarks: [''],
      active: [true]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.projectForm.patchValue({
        // 1. Overview
        projectCode: this.data.projectCode || '',
        productName: this.data.productName || '',
        module: this.data.molecule || this.data.module || '',
        division: this.data.division || '',
        starProduct: this.data.starProduct || '',
        registrationType: this.data.registrationType || '',
        projectOwner: this.data.projectOwner || '',
        projectLead: this.data.projectLead || '',
        location: this.data.location || '',
        template: this.data.template || this.data.templateName || '',

        // 2. Timeline
        priority: this.data.priority || this.data.priorityOfProject || '',
        projectStartDate: this.data.projectStartDate || this.data.projectInitiatedOn || '',
        projectEndDate: this.data.projectEndDate || this.data.projectCompletedDate || '',
        projectBudget: this.data.projectBudget || this.data.estimatedCostForDevelopment || '',

        // 3. Market
        market: this.data.market || this.data.targetMarket || '',
        marketSizeLast3Years: this.data.marketSizeLast3Years || '',
        marketSizeUsdMnYr: this.data.marketSizeUsdMnYr || this.data.marketSizeInUsd || '',
        projectedMarketShare: this.data.projectedMarketShare || '',
        commercialAttractiveness: this.data.commercialAttractiveness || '',
        projectedNpv: this.data.projectedNpv || '',

        // 4. Product Details
        dosageForm: this.data.dosageForm || '',
        strength: this.data.strength || '',
        fillVolume: this.data.fillVolume || '',
        pharmacopoeia: this.data.pharmacopoeia || '',
        packagingDetails: this.data.packagingDetails || '',

        // 5. Innovator
        innovatorCompany: this.data.innovatorCompany || '',
        innovatorBrandName: this.data.innovatorBrandName || '',
        innovatorDosageForm: this.data.innovatorDosageForm || '',
        innovatorStrengths: this.data.innovatorStrengths || '',
        innovatorApprovalDate: this.data.innovatorApprovalDate || '',
        innovatorPackPresentation: this.data.innovatorPackPresentation || '',
        innovatorBioStrength: this.data.innovatorBioStrength || '',
        rldInformation: this.data.rldInformation || '',
        innovatorVsJodas: this.data.innovatorVsJodas || '',
        ipDetails: this.data.ipDetails || '',

        // 6. API
        apiManufacturer: this.data.apiManufacturer || '',
        polymorphForm: this.data.polymorphForm || '',
        cepDmfNoReceiptStatus: this.data.cepDmfNoReceiptStatus || '',
        dmfAsmfCepReceived: this.data.dmfAsmfCepReceived || '',
        apiVendorQualification: this.data.apiVendorQualification || '',
        apiMl: this.data.apiMl || '',
        apiGmp: this.data.apiGmp || '',

        // 7. Others
        ml: this.data.ml || '',
        whoGmp: this.data.whoGmp || '',
        bioStudyCroName: this.data.bioStudyCroName || '',
        bioStudyCroGmpStatus: this.data.bioStudyCroGmpStatus || '',
        beNoc: this.data.beNoc || '',
        studyTimePeriod: this.data.studyTimePeriod || '',
        bioStudyReport: this.data.bioStudyReport || '',
        remarks: this.data.remarks || '',
        active: this.data.status ? this.data.status === 'Active' : true
      });
    }
  }

  setActiveTab(tab: ProjectTab): void {
    this.activeTab = tab;
  }

  prevTab(): void {
    const currentIndex = this.tabs.findIndex(t => t.id === this.activeTab);
    if (currentIndex > 0) {
      this.activeTab = this.tabs[currentIndex - 1].id;
    }
  }

  nextTab(): void {
    const currentIndex = this.tabs.findIndex(t => t.id === this.activeTab);
    if (currentIndex < this.tabs.length - 1) {
      this.activeTab = this.tabs[currentIndex + 1].id;
    }
  }

  save(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      // If error is in Overview fields, navigate to Overview tab
      if (this.projectForm.get('projectCode')?.invalid || this.projectForm.get('productName')?.invalid) {
        this.activeTab = 'overview';
      }
      return;
    }

    this.dialogRef.close(this.projectForm.value);
  }

  close(): void {
    this.dialogRef.close();
  }
}
