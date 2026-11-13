import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { AddDeliverableComponent } from '../../../stages/stages-wbs/add-deliverable/add-deliverable.component';
import { AddActivityComponent } from '../../../stages/stages-wbs/add-activity/add-activity.component';
import { AddCriteriaComponent } from '../../../gates/gate-criteria/add-criteria/add-criteria.component';
import { INDUSTRIAL_STAGES_MASTER, INDUSTRIAL_STAGES_WBS_MAP } from '../../../stages/industrial-stages.data';

// Interfaces to define our hierarchical data structure
export interface TaskItem {
  id: number;
  name: string;
  description?: string;
  completed: boolean;
}

export interface ModuleItem {
  id: number;
  name: string;
  description?: string;
  completed?: boolean;
  tasks: TaskItem[];
}

export interface StageItem {
  id: number;
  name: string;
  type: 'stage' | 'gate';
  completed?: boolean;
  modules: ModuleItem[];
  tasks?: TaskItem[];
}

const INDUSTRIAL_GATE_CRITERIA_MAP: Record<string, { id: number; name: string; criteria: { name: string; description: string }[] }> = {
  'Gate 1': {
    id: 31,
    name: 'Gate 1 - Business Case Approval',
    criteria: [
      {
        name: 'User Requirements Specification (URS) & Capacity Scope Finalized',
        description: 'Plant throughput targets, takt-time requirements, footprint constraints, and technical performance envelope approved by Operations and Engineering.'
      },
      {
        name: 'CapEx, OpEx & ROI Financial Model Validated',
        description: 'Finance-reviewed capital expenditure budget, payback period, and lifecycle operating cost analysis signed off for stage funding.'
      },
      {
        name: 'Safety, CE / ISO & Statutory Regulatory Pathway Verified',
        description: 'Applicable machine safety, electrical codes, emissions, and environmental compliance requirements documented with zero unmitigated blockers.'
      },
      {
        name: 'OEM Vendor Longlist & Long-Lead Supply Risk Screened',
        description: 'Qualified equipment suppliers and critical lead-time components assessed for capacity, delivery schedule, and service support.'
      },
      {
        name: 'Integrated Master Schedule & Project Charter Approved',
        description: 'Steering committee sign-off on cross-functional resource plan, milestone dates, and authorization to enter Concept Engineering.'
      }
    ]
  },
  'Gate 2': {
    id: 32,
    name: 'Gate 2 - Concept Selection & Design Freeze',
    criteria: [
      {
        name: '3D CAD Line Layout & Mechanical Concept Frozen',
        description: 'Selected equipment configuration, structural drawings, and utility interface points signed off by Engineering and Plant Facilities.'
      },
      {
        name: 'Design FMEA & HAZOP Risk Assessment Closed',
        description: 'All high-priority failure modes, ergonomic hazards, and operational mitigation actions documented and approved by EHS & Quality.'
      },
      {
        name: 'PLC / SCADA Control Architecture & I/O List Signed Off',
        description: 'Automation control philosophy, network topology, and safety interlock architecture approved by Controls Engineering.'
      },
      {
        name: 'Primary OEM Suppliers Qualified & Quotes Evaluated',
        description: 'Technical and commercial bid evaluations completed with preferred OEM vendors shortlisted for procurement execution.'
      },
      {
        name: 'Execution CapEx Baseline & Long-Lead Procurement Cleared',
        description: 'Formal management authorization to freeze design and release Stage 6 process engineering and equipment procurement.'
      }
    ]
  },
  'Gate 3': {
    id: 33,
    name: 'Gate 3 - Procurement & Build Readiness',
    criteria: [
      {
        name: 'Prototype Tooling & Subassembly Endurance Trials Passed',
        description: 'Mechanical stress, dimensional tolerance, and wear testing completed against URS acceptance thresholds.'
      },
      {
        name: 'Factory Acceptance Test (FAT) Protocol & Checklists Approved',
        description: 'Comprehensive OEM FAT test scripts, safety interlock checks, and dry-run acceptance criteria signed off prior to shipment.'
      },
      {
        name: 'Instrument Calibration & Metrology Traceability Verified',
        description: 'Critical process sensors, load cells, and inspection gauges calibrated to NIST/NABL traceable standards.'
      },
      {
        name: 'Manufacturing & Spare-Parts Purchase Orders Released',
        description: 'All capital equipment POs, vendor delivery milestones, and critical spare-parts kits locked with suppliers.'
      },
      {
        name: 'Site Foundation, Utilities & Rigging Readiness Confirmed',
        description: 'Plant floor civil work, power/air/cooling tie-ins, and EHS rigging permits verified ready for equipment installation.'
      }
    ]
  },
  'Gate 4': {
    id: 34,
    name: 'Gate 4 - Commissioning & Performance Acceptance',
    criteria: [
      {
        name: 'Installation Qualification (IQ) & Safety Interlocks Verified',
        description: 'Physical installation, laser alignment, E-stop circuits, and guarding verified compliant with engineering drawings.'
      },
      {
        name: 'Site Acceptance Test (SAT) Performance Targets Met',
        description: 'Equipment demonstrates rated cycle time, dimensional capability (Cpk), and scrap rate thresholds during SAT runs.'
      },
      {
        name: 'Sustained OEE Endurance & Full-Load Trial Passed',
        description: 'Continuous multi-shift endurance production run achieved target Overall Equipment Effectiveness (OEE) without critical faults.'
      },
      {
        name: 'Operator, Technician & LOTO Maintenance Training Completed',
        description: 'Plant operators and maintenance technicians certified on standard operating procedures and Lockout/Tagout protocols.'
      },
      {
        name: 'EHS Final Inspection & Commissioning Sign-Off Approved',
        description: 'Cross-functional Commissioning, Quality, and EHS approval authorizing progression to OQ production ramp-up.'
      }
    ]
  },
  'Gate 5': {
    id: 35,
    name: 'Gate 5 - Operational Handover Approval',
    criteria: [
      {
        name: 'Operational Qualification (OQ) Validation Summary Approved',
        description: 'Process stability, product quality yield, and repeatability confirmed across three consecutive production qualification runs.'
      },
      {
        name: 'Technical Transfer Dossier (TTD) & As-Built Package Complete',
        description: 'Updated as-built CAD/electrical schematics, PLC source backups, OEM manuals, and calibration records archived.'
      },
      {
        name: 'Critical Spare Parts & CMMS Preventive Maintenance Active',
        description: 'Min-max spare-parts inventory stocked in plant stores and PM schedules activated inside the maintenance system.'
      },
      {
        name: 'Open Punch-List & Engineering Change Notices Closed',
        description: 'All commissioning punch-list items resolved and non-conformance or change-control records formally closed.'
      },
      {
        name: 'Plant Operations Handover & Project Closeout Signed Off',
        description: 'Executive and Plant Manager sign-off transferring full asset ownership from capital project team to Operations.'
      }
    ]
  }
};

function buildIndustrialStagesAndGates(): StageItem[] {
  const result: StageItem[] = [];

  INDUSTRIAL_STAGES_MASTER.forEach((stage, stageIdx) => {
    const wbs = INDUSTRIAL_STAGES_WBS_MAP[stage.stageCode];
    const modules: ModuleItem[] = (wbs?.sidebarMenus || []).map((menu, modIdx) => {
      const modBaseId = (stageIdx + 1) * 100 + (modIdx + 1);
      const tasks: TaskItem[] = (wbs?.modulesData?.[modIdx] || []).map((t, taskIdx) => ({
        id: modBaseId * 10 + (taskIdx + 1),
        name: t.task,
        description: t.description,
        completed: false
      }));
      return {
        id: modBaseId,
        name: menu.name,
        description: menu.description || '',
        completed: false,
        tasks
      };
    });

    result.push({
      id: stageIdx + 1,
      name: `${stage.stageCode} - ${stage.stageName}`,
      type: 'stage',
      completed: false,
      modules
    });

    const gateCfg = INDUSTRIAL_GATE_CRITERIA_MAP[stage.gateCode];
    if (gateCfg) {
      result.push({
        id: gateCfg.id,
        name: gateCfg.name,
        type: 'gate',
        completed: false,
        modules: [],
        tasks: gateCfg.criteria.map((c, cIdx) => ({
          id: gateCfg.id * 100 + (cIdx + 1),
          name: c.name,
          description: c.description,
          completed: false
        }))
      });
    }
  });

  return result;
}

@Component({
  selector: 'app-project-setup',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './project-setup.component.html',
  styleUrl: './project-setup.component.scss',
})
export class ProjectSetupComponent implements OnInit {

  // Project Header Properties
  projectName: string = 'Industrial Equipment Line Expansion';
  projectCode: string = '2026/IND/001';
  dynamicBreadcrumb: string = 'Industrial Equipment Line Expansion - 2026/IND/001';

  selectedStage: StageItem | null = null;
  selectedModule: ModuleItem | null = null;

  stagesAndGates: StageItem[] = buildIndustrialStagesAndGates();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    // Default to the first stage (S1, id: 1)
    const defaultStage = this.stagesAndGates[0];
    this.selectStage(defaultStage);
  }

  // --- Migrated Methods ---

  selectStage(stage: StageItem) {
    this.selectedStage = stage;
    if (stage.modules && stage.modules.length > 0) {
      this.selectedModule = stage.modules[0];
    } else {
      this.selectedModule = null;
    }
  }

  selectModule(moduleItem: ModuleItem) {
    this.selectedModule = moduleItem;
  }

  openAddDeliverableDialog(): void {
    if (!this.selectedStage || this.selectedStage.type === 'gate') return;

    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        stage: this.selectedStage.name,
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.deliverableName || result.name)) {
        const newModule: ModuleItem = {
          id: Date.now(),
          name: result.deliverableName || result.name,
          description: result.description || '',
          completed: false,
          tasks: []
        };
        if (!this.selectedStage!.modules) {
          this.selectedStage!.modules = [];
        }
        this.selectedStage!.modules.push(newModule);
        this.selectedModule = newModule;
      }
    });
  }

  openAddActivityDialog(): void {
    if (!this.selectedStage || this.selectedStage.type === 'gate') return;

    const deliverables = this.selectedStage.modules?.map(m => m.name) || [];
    const currentDeliverable = this.selectedModule?.name || (deliverables.length > 0 ? deliverables[0] : '');

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: {
        stage: this.selectedStage.name,
        deliverable: currentDeliverable,
        deliverables: deliverables.length > 0 ? deliverables : [currentDeliverable || 'Deliverable'],
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.activityName || result.task)) {
        const newActivity: TaskItem = {
          id: Date.now(),
          name: result.activityName || result.task,
          description: result.description || '',
          completed: false
        };

        let targetModule = this.selectedModule;
        if (result.deliverable && this.selectedStage?.modules) {
          const found = this.selectedStage.modules.find(m => m.name === result.deliverable);
          if (found) targetModule = found;
        }

        if (targetModule) {
          if (!targetModule.tasks) {
            targetModule.tasks = [];
          }
          targetModule.tasks.push(newActivity);
        }
      }
    });
  }

  openAddCriteriaDialog(): void {
    if (!this.selectedStage || this.selectedStage.type !== 'gate') return;

    const dialogRef = this.dialog.open(AddCriteriaComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        stage: this.selectedStage.name,
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.subject || result.question || result.name)) {
        const newCriterion: TaskItem = {
          id: Date.now(),
          name: result.subject || result.question || result.name || '',
          description: result.description || '',
          completed: false
        };

        if (this.selectedStage) {
          if (!this.selectedStage.tasks) {
            this.selectedStage.tasks = [];
          }
          this.selectedStage.tasks.push(newCriterion);
        }
      }
    });
  }

  editItem(item: any, type: string) {
    if (type === 'Criterion') {
      const dialogRef = this.dialog.open(AddCriteriaComponent, {
        width: '900px',
        maxWidth: '95vw',
        height: 'auto',
        data: {
          mode: 'edit',
          id: item.id,
          subject: item.name,
          question: item.name,
          description: item.description,
          priority: item.priority || 'High',
          mandatory: item.mandatory || false
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          item.name = result.subject || result.question || result.name || item.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    } else if (type === 'Module' || type === 'Deliverable') {
      const dialogRef = this.dialog.open(AddDeliverableComponent, {
        width: '600px',
        maxWidth: '90vw',
        data: {
          mode: 'edit',
          stage: this.selectedStage?.name || '',
          deliverableName: item.name,
          description: item.description
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && (result.deliverableName || result.name)) {
          item.name = result.deliverableName || result.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    } else if (type === 'Task' || type === 'Activity') {
      const deliverables = this.selectedStage?.modules?.map(m => m.name) || [];
      const dialogRef = this.dialog.open(AddActivityComponent, {
        width: '1000px',
        maxWidth: '95vw',
        data: {
          mode: 'edit',
          stage: this.selectedStage?.name || '',
          deliverable: this.selectedModule?.name || '',
          deliverables: deliverables.length > 0 ? deliverables : [this.selectedModule?.name || 'Deliverable'],
          activityName: item.name,
          task: item.name,
          description: item.description
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          item.name = result.activityName || result.task || item.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    }
  }

  deleteItem(item: any, type: string) {
    if (type === 'Task' || type === 'Criterion' || type === 'Activity') {
      if (this.selectedStage?.type === 'gate' && this.selectedStage.tasks) {
        const idx = this.selectedStage.tasks.indexOf(item);
        if (idx > -1) this.selectedStage.tasks.splice(idx, 1);
      } else if (this.selectedModule && this.selectedModule.tasks) {
        const idx = this.selectedModule.tasks.indexOf(item);
        if (idx > -1) this.selectedModule.tasks.splice(idx, 1);
      }
    } else if (type === 'Module' || type === 'Deliverable') {
      if (this.selectedStage && this.selectedStage.modules) {
        const idx = this.selectedStage.modules.indexOf(item);
        if (idx > -1) {
          this.selectedStage.modules.splice(idx, 1);
          if (this.selectedModule === item) {
            this.selectedModule = this.selectedStage.modules[0] || null;
          }
        }
      }
    }
  }

  toggleCompleted(event: Event, item: any) {
    event.stopPropagation();
    item.completed = !item.completed;
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || '2026/IND/001', name: this.projectName || 'Industrial Equipment Line Expansion' }
    });
  }

}
