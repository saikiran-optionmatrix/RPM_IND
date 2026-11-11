import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup
} from '@angular/cdk/drag-drop';
import {
  Project,
  commercialAttractivenessOptions,
  competitionLevels,
  dosageForms,
  drugAuthorityOptions,
  locations,
  molecules,
  priorityOptions,
  productStatusOptions,
  projectLeads,
  projectOwners,
  projects,
  targetMarkets,
} from './projects-data';
import { SaveTemplateComponent } from './save-template/save-template.component';
import { ResetTemplateComponent } from './reset-template/reset-template.component';
import { ConfirmationDialogComponent } from '../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { HistoryPopComponent } from '../../common/shared/history-pop/history-pop.component';

export type Status = 'Pending' | 'Allocated' | 'Progress' | 'Hold' | 'Cancelled' | 'Completed';

export interface Card {
  id: number;
  subject: string;
  code?: string;
  LawFirm: string;
  createdBy: string;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  expedite: boolean;
  notes: { text: string; author: string; date: string }[];
  expanded: boolean;
  status: Status;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTooltipModule,
    RouterModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    // AddProjectComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projects: Project[] = [...projects];
  readonly projectOwners = projectOwners;
  readonly projectLeads = projectLeads;
  readonly molecules = molecules;
  readonly dosageForms = dosageForms;
  readonly targetMarkets = targetMarkets;
  readonly competitionLevels = competitionLevels;
  readonly commercialAttractivenessOptions = commercialAttractivenessOptions;
  readonly priorityOptions = priorityOptions;
  readonly productStatusOptions = productStatusOptions;
  readonly drugAuthorityOptions = drugAuthorityOptions;
  readonly locations = locations;
  readonly dateTypes = [
    'Project Initiated On',
    'Project Completed Date',
    'Pre EB Activities Completed On',
  ];

  showFilter = false;
  keyword = '';
  status = '';
  filterProjectOwner = '';
  filterProjectLead = '';
  filterMolecule = '';
  filterDosageForm = '';
  filterProductStatus = '';
  filterDrugAuthority = '';
  filterTargetMarket = '';
  filterLevelOfCompetition = '';
  filterCommercialAttractiveness = '';
  filterPriority = '';
  filterDateType = '';
  filterStartDate = '';
  filterEndDate = '';
  searchKeyword = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 5;

  // View Toggle State
  isKanbanView = false;

  // Kanban Properties
  lists: Status[] = ['Pending', 'Allocated', 'Progress', 'Hold', 'Cancelled', 'Completed'];
  cards: Record<Status, Card[]> = {
    Pending: [], Allocated: [], Progress: [],
    Hold: [], Cancelled: [], Completed: []
  };

  kanbanData = [
    { subject: 'Dapagliflozin Film-Coated Tablets', code: '2026/RD/001', distributor: 'Film-coated tablets (5 mg and 10 mg)', Lead: 'A. Sharma', status: 'Completed', TargetDate: '2027-10-31', FailureDate: '2026-11-01' },
    { subject: 'Levetiracetam Oral Solution', code: '2026/RD/002', distributor: 'Oral solution (100 mg/mL)', Lead: 'R. Mehta', status: 'Progress', TargetDate: '2027-11-30', FailureDate: '2026-12-01' },
    { subject: 'Pantoprazole Sodium Delayed-Release Tablets', code: '2026/RD/003', distributor: 'Delayed-release tablets (20 mg and 40 mg)', Lead: 'S. Iyer', status: 'Allocated', TargetDate: '2027-12-31', FailureDate: '2027-01-01' },
    { subject: 'Ceftriaxone for Injection', code: '2026/RD/004', distributor: 'Sterile powder for injection (500 mg and 1 g)', Lead: 'P. Nair', status: 'Hold', TargetDate: '2028-02-29', FailureDate: '2026-11-15' },
    { subject: 'Budesonide/Formoterol Inhalation Powder', code: '2026/RD/005', distributor: 'Dry powder for inhalation', Lead: 'V. Rao', status: 'Pending', TargetDate: '2028-07-31', FailureDate: '2027-02-01' }
  ];

  private statusMap: Record<string, Status> = {
    'Pending': 'Pending',
    'Allocated': 'Allocated',
    'Process': 'Progress',
    'Progress': 'Progress',
    'Hold': 'Hold',
    'Cancelled': 'Cancelled',
    'Closed': 'Completed',
    'Completed': 'Completed'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  readonly historySequence: number[] = [4, 5, 1, 2, 6, 3, 4, 8, 2, 4, 7, 3, 5, 1, 6, 9, 2, 4, 3, 8, 5, 1, 7, 2, 6, 4, 3, 5, 8, 2];
  readonly updatedDates: string[] = [
    '05-Oct-2026', '03-Oct-2026', '30-Sep-2026', '26-Sep-2026', '22-Sep-2026',
    '18-Sep-2026', '14-Sep-2026', '09-Sep-2026', '04-Sep-2026', '28-Aug-2026',
    '24-Aug-2026', '19-Aug-2026', '15-Aug-2026', '10-Aug-2026', '04-Aug-2026'
  ];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  ngOnInit(): void {
    this.projects.forEach((p, idx) => {
      p.historyCount = this.historySequence[idx % this.historySequence.length];
      if (!p.status) {
        p.status = 'Active';
      }
      if (!p.updatedDate) {
        p.updatedDate = this.updatedDates[idx % this.updatedDates.length];
      }
      if (!p.updatedBy) {
        p.updatedBy = p.projectLead || p.projectOwner || 'Anki Reddy';
      }
      if (!p.division) {
        const form = (p.dosageForm || '').toLowerCase();
        if (form.includes('tablet') || form.includes('capsule')) {
          p.division = 'Oral Solids - OS';
        } else if (form.includes('lyo') || form.includes('pfs')) {
          p.division = 'Complex Injectables - CI';
        } else if (form.includes('solution') || form.includes('inj') || form.includes('dpi')) {
          p.division = 'Injectables - IJ';
        } else {
          const defaults = ['Oral Solids - OS', 'Injectables - IJ', 'Complex Injectables - CI', 'Biotech - BT'];
          p.division = defaults[idx % defaults.length];
        }
      }
      if (!p.location) {
        p.location = this.locations[idx % this.locations.length];
      }
    });

    const savedData = localStorage.getItem('kanbanData');
    if (savedData && !savedData.includes('Mahindra') && !savedData.includes('Tesla') && !savedData.includes('Battery Pack') && !savedData.includes('ADAS')) {
      this.cards = JSON.parse(savedData);
    } else {
      this.initializeKanbanData();
    }
  }

  get filteredProjects(): Project[] {
    return this.projects.filter((project) => {
      const searchableText = [
        project.projectCode,
        project.projectOwner,
        project.projectLead,
        project.molecule,
        project.productName,
        project.division,
        project.location,
        project.targetMarket,
        project.market,
        project.productStatus,
        project.starProduct,
        project.registrationType,
        project.priority,
        project.dosageForm,
        project.strength,
        project.innovatorCompany,
        project.innovatorBrandName,
        project.apiManufacturer,
        project.remarks,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const keywordMatches = !this.searchKeyword || searchableText.includes(this.searchKeyword.toLowerCase());
      const statusMatches = !this.searchStatus || project.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedProjects(): Project[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredProjects.slice(startIndex, startIndex + this.pageSize);
  }

  // Kanban & View Methods
  toggleView(isKanban: boolean): void {
    this.isKanbanView = isKanban;
  }

  initializeKanbanData(): void {
    const grouped: Record<Status, Card[]> = {
      Pending: [], Allocated: [], Progress: [],
      Hold: [], Cancelled: [], Completed: []
    };

    this.kanbanData.forEach((item, index) => {
      const status: Status = this.statusMap[item.status] ?? 'Pending';
      grouped[status].push({
        id: index + 1,
        subject: item.subject,
        code: item.code || `2026/RD/00${index + 1}`,
        LawFirm: item.distributor,
        createdBy: item.Lead,
        assignedTo: item.Lead,
        createdDate: item.FailureDate,
        dueDate: item.TargetDate,
        expedite: status === 'Progress' || index % 3 === 0,
        notes: [],
        expanded: false,
        status
      });
    });

    this.cards = grouped;
    localStorage.setItem('kanbanData', JSON.stringify(this.cards));
  }

  drop(event: CdkDragDrop<Card[]>, targetList: Status): void {
    const previousList = event.previousContainer.id as Status;
    const currentList = event.container.id as Status;

    if (previousList !== currentList) {
      transferArrayItem(
        this.cards[previousList],
        this.cards[currentList],
        event.previousIndex,
        event.currentIndex
      );
      this.cards[currentList][event.currentIndex].status = currentList;
    } else {
      moveItemInArray(this.cards[targetList], event.previousIndex, event.currentIndex);
    }

    this.cards = { ...this.cards };
    localStorage.setItem('kanbanData', JSON.stringify(this.cards));
  }

  toggleCard(card: Card): void {
    card.expanded = !card.expanded;
  }

  getColor(status: string): string {
    const colors: Record<string, string> = {
      'Pending': '#e24b4a',
      'Allocated': '#ef9f27',
      'Progress': '#378add',
      'Hold': '#f0995b',
      'Cancelled': '#888780',
      'Completed': '#639922'
    };
    return colors[status] ?? '#888780';
  }

  getCardClass(status: string): string {
    const classes: Record<string, string> = {
      'Pending': 'pending-card',
      'Allocated': 'allocated-card',
      'Progress': 'progress-card',
      'Hold': 'hold-card',
      'Cancelled': 'cancelled-card',
      'Completed': 'completed-card'
    };
    return classes[status] ?? 'default-card';
  }

  goToDashboard(item: any) {
    this.router.navigate(['/projects', 'dashboard'], {
      relativeTo: this.route,
      queryParams: {
        projectCode: item.code,
        projectName: item.subject
      }
    });
  }

  // Grid/Filter Actions
  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchStatus = this.status;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.status = '';
    this.filterProjectOwner = '';
    this.filterProjectLead = '';
    this.filterMolecule = '';
    this.filterDosageForm = '';
    this.filterProductStatus = '';
    this.filterDrugAuthority = '';
    this.filterTargetMarket = '';
    this.filterLevelOfCompetition = '';
    this.filterCommercialAttractiveness = '';
    this.filterPriority = '';
    this.filterDateType = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.searchKeyword = '';
    this.searchStatus = '';
    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openEditDialog(project: any): void {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: project
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (!project) {
          const newProject: Project = {
            projectCode: res.projectCode || `2026/RD/${String(this.projects.length + 1).padStart(3, '0')}`,
            productName: res.productName || '',
            molecule: res.module || '',
            division: res.division || 'Oral Solids - OS',
            starProduct: res.starProduct || '',
            registrationType: res.registrationType || '',
            projectOwner: res.projectOwner || '',
            projectLead: res.projectLead || '',
            location: res.location || '',
            priority: res.priority || '',
            projectStartDate: res.projectStartDate || '',
            projectEndDate: res.projectEndDate || '',
            projectBudget: res.projectBudget || '',
            market: res.market || '',
            marketSizeLast3Years: res.marketSizeLast3Years || '',
            marketSizeUsdMnYr: res.marketSizeUsdMnYr || '',
            projectedMarketShare: res.projectedMarketShare || '',
            commercialAttractiveness: res.commercialAttractiveness || '',
            projectedNpv: res.projectedNpv || '',
            dosageForm: res.dosageForm || '',
            strength: res.strength || '',
            fillVolume: res.fillVolume || '',
            pharmacopoeia: res.pharmacopoeia || '',
            packagingDetails: res.packagingDetails || '',
            innovatorCompany: res.innovatorCompany || '',
            innovatorBrandName: res.innovatorBrandName || '',
            innovatorDosageForm: res.innovatorDosageForm || '',
            innovatorStrengths: res.innovatorStrengths || '',
            innovatorApprovalDate: res.innovatorApprovalDate || '',
            innovatorPackPresentation: res.innovatorPackPresentation || '',
            innovatorBioStrength: res.innovatorBioStrength || '',
            rldInformation: res.rldInformation || '',
            innovatorVsJodas: res.innovatorVsJodas || '',
            ipDetails: res.ipDetails || '',
            apiManufacturer: res.apiManufacturer || '',
            polymorphForm: res.polymorphForm || '',
            cepDmfNoReceiptStatus: res.cepDmfNoReceiptStatus || '',
            dmfAsmfCepReceived: res.dmfAsmfCepReceived || '',
            apiVendorQualification: res.apiVendorQualification || '',
            apiMl: res.apiMl || '',
            apiGmp: res.apiGmp || '',
            ml: res.ml || '',
            whoGmp: res.whoGmp || '',
            bioStudyCroName: res.bioStudyCroName || '',
            bioStudyCroGmpStatus: res.bioStudyCroGmpStatus || '',
            beNoc: res.beNoc || '',
            studyTimePeriod: res.studyTimePeriod || '',
            bioStudyReport: res.bioStudyReport || '',
            remarks: res.remarks || '',
            status: res.active !== false ? 'Active' : 'Inactive',
            updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
            updatedBy: res.projectLead || res.projectOwner || 'Anki Reddy'
          };
          this.projects.unshift(newProject);
        } else {
          Object.assign(project, {
            projectCode: res.projectCode,
            productName: res.productName,
            molecule: res.module,
            division: res.division !== undefined ? res.division : project.division,
            starProduct: res.starProduct !== undefined ? res.starProduct : project.starProduct,
            registrationType: res.registrationType !== undefined ? res.registrationType : project.registrationType,
            projectOwner: res.projectOwner,
            projectLead: res.projectLead,
            location: res.location !== undefined ? res.location : project.location,
            priority: res.priority !== undefined ? res.priority : project.priority,
            projectStartDate: res.projectStartDate !== undefined ? res.projectStartDate : project.projectStartDate,
            projectEndDate: res.projectEndDate !== undefined ? res.projectEndDate : project.projectEndDate,
            projectBudget: res.projectBudget !== undefined ? res.projectBudget : project.projectBudget,
            market: res.market !== undefined ? res.market : project.market,
            marketSizeLast3Years: res.marketSizeLast3Years !== undefined ? res.marketSizeLast3Years : project.marketSizeLast3Years,
            marketSizeUsdMnYr: res.marketSizeUsdMnYr !== undefined ? res.marketSizeUsdMnYr : project.marketSizeUsdMnYr,
            projectedMarketShare: res.projectedMarketShare !== undefined ? res.projectedMarketShare : project.projectedMarketShare,
            commercialAttractiveness: res.commercialAttractiveness !== undefined ? res.commercialAttractiveness : project.commercialAttractiveness,
            projectedNpv: res.projectedNpv !== undefined ? res.projectedNpv : project.projectedNpv,
            dosageForm: res.dosageForm !== undefined ? res.dosageForm : project.dosageForm,
            strength: res.strength !== undefined ? res.strength : project.strength,
            fillVolume: res.fillVolume !== undefined ? res.fillVolume : project.fillVolume,
            pharmacopoeia: res.pharmacopoeia !== undefined ? res.pharmacopoeia : project.pharmacopoeia,
            packagingDetails: res.packagingDetails !== undefined ? res.packagingDetails : project.packagingDetails,
            innovatorCompany: res.innovatorCompany !== undefined ? res.innovatorCompany : project.innovatorCompany,
            innovatorBrandName: res.innovatorBrandName !== undefined ? res.innovatorBrandName : project.innovatorBrandName,
            innovatorDosageForm: res.innovatorDosageForm !== undefined ? res.innovatorDosageForm : project.innovatorDosageForm,
            innovatorStrengths: res.innovatorStrengths !== undefined ? res.innovatorStrengths : project.innovatorStrengths,
            innovatorApprovalDate: res.innovatorApprovalDate !== undefined ? res.innovatorApprovalDate : project.innovatorApprovalDate,
            innovatorPackPresentation: res.innovatorPackPresentation !== undefined ? res.innovatorPackPresentation : project.innovatorPackPresentation,
            innovatorBioStrength: res.innovatorBioStrength !== undefined ? res.innovatorBioStrength : project.innovatorBioStrength,
            rldInformation: res.rldInformation !== undefined ? res.rldInformation : project.rldInformation,
            innovatorVsJodas: res.innovatorVsJodas !== undefined ? res.innovatorVsJodas : project.innovatorVsJodas,
            ipDetails: res.ipDetails !== undefined ? res.ipDetails : project.ipDetails,
            apiManufacturer: res.apiManufacturer !== undefined ? res.apiManufacturer : project.apiManufacturer,
            polymorphForm: res.polymorphForm !== undefined ? res.polymorphForm : project.polymorphForm,
            cepDmfNoReceiptStatus: res.cepDmfNoReceiptStatus !== undefined ? res.cepDmfNoReceiptStatus : project.cepDmfNoReceiptStatus,
            dmfAsmfCepReceived: res.dmfAsmfCepReceived !== undefined ? res.dmfAsmfCepReceived : project.dmfAsmfCepReceived,
            apiVendorQualification: res.apiVendorQualification !== undefined ? res.apiVendorQualification : project.apiVendorQualification,
            apiMl: res.apiMl !== undefined ? res.apiMl : project.apiMl,
            apiGmp: res.apiGmp !== undefined ? res.apiGmp : project.apiGmp,
            ml: res.ml !== undefined ? res.ml : project.ml,
            whoGmp: res.whoGmp !== undefined ? res.whoGmp : project.whoGmp,
            bioStudyCroName: res.bioStudyCroName !== undefined ? res.bioStudyCroName : project.bioStudyCroName,
            bioStudyCroGmpStatus: res.bioStudyCroGmpStatus !== undefined ? res.bioStudyCroGmpStatus : project.bioStudyCroGmpStatus,
            beNoc: res.beNoc !== undefined ? res.beNoc : project.beNoc,
            studyTimePeriod: res.studyTimePeriod !== undefined ? res.studyTimePeriod : project.studyTimePeriod,
            bioStudyReport: res.bioStudyReport !== undefined ? res.bioStudyReport : project.bioStudyReport,
            remarks: res.remarks !== undefined ? res.remarks : project.remarks,
            status: res.active !== false ? 'Active' : 'Inactive',
            updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
            updatedBy: res.projectLead || res.projectOwner || project.updatedBy || 'Anki Reddy'
          });
        }
      }
    });
  }

  onEdit(project: Project): void {
    this.openEditDialog(project);
  }

  onDelete(project: Project): void {
    console.log('Delete project:', project);
  }

  onArchive(project: Project): void {
    console.log('Archive project:', project);
  }

  saveAsTemplate(project: Project): void {
    const dialogRef = this.dialog.open(SaveTemplateComponent, {
      width: '600px',
      data: {
        projectName: project.productName || project.projectCode,
        projectCode: project.projectCode,
        project: project
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log('Template saved successfully:', res);
      }
    });
  }

  resetTemplateConfirmation(project: Project): void {
    const projName = project.productName || project.projectCode;
    const dialogRef = this.dialog.open(ResetTemplateComponent, {
      width: '560px',
      data: {
        project: project,
        projectName: projName,
        currentTemplate: 'Generic Tablet Development'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.confirmed) {
        console.log('Reset template confirmed with template:', res.selectedTemplate, 'for project:', project);
      }
    });
  }

  setProjectActive(project: Project, active: boolean): void {
    project.status = active ? 'Active' : 'Inactive';
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

  openHistory(project?: any): void {
    if (typeof project === 'object' && project !== null) {
      this.router.navigate(['/projects/history'], {
        queryParams: {
          code: project.projectCode,
          name: project.productName || project.projectName || project.projectCode
        }
      });
    } else if (typeof project === 'string') {
      this.router.navigate(['/projects/history'], {
        queryParams: { name: project }
      });
    } else {
      this.router.navigate(['/projects/history']);
    }
  }

  onStatusChange(project: Project): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: 'Are you sure you want to change the status?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        project.status = project.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}