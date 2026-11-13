import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import {
  INDUSTRIAL_STAGES_MASTER,
  INDUSTRIAL_STAGES_WBS_MAP,
} from '../../../../stages/industrial-stages.data';

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

const INDUSTRIAL_GATE_DEFINITIONS: Record<
  string,
  { label: string; completed: boolean; items: { name: string; desc: string }[] }
> = {
  'Gate 1': {
    label: 'Gate 1: Business Case Approval',
    completed: true,
    items: [
      {
        name: 'Plant Capacity Need & Bottleneck Audit Approved',
        desc: 'Throughput gap analysis, takt-time demand, and OEM equipment benchmarking verified by Manufacturing Operations.',
      },
      {
        name: 'User Requirements Specification (URS) Baseline Signed Off',
        desc: 'Rated capacity, equipment footprint envelope, cycle-time target, and utility specs frozen in URS.',
      },
      {
        name: 'Safety, CE / ISO & Statutory Regulatory Pathway Verified',
        desc: 'Applicable machinery safety directives (CE, UL 508A, BIS, ISO 12100) and environmental permits mapped.',
      },
      {
        name: 'CapEx Budget, NPV & Payback Model Approved',
        desc: 'Preliminary capital outlay, operating cost impact, and ROI threshold validated by Finance.',
      },
      {
        name: 'Executive Program Charter & Gate 1 Release',
        desc: 'Steering committee sign-off releasing Concept Engineering & Solution Development funding.',
      },
    ],
  },
  'Gate 2': {
    label: 'Gate 2: Concept Selection & Design Freeze',
    completed: false,
    items: [
      {
        name: '3D CAD Assembly & Structural FEA Simulation Signed Off',
        desc: 'Parametric equipment layout, clash detection, modal vibration, and structural deflection checks approved.',
      },
      {
        name: 'PLC / SCADA Control Philosophy & Safety Interlocks Frozen',
        desc: 'EtherCAT/PROFINET architecture, HMI screens, and ISO 13849 PLd safety circuit diagrams frozen.',
      },
      {
        name: 'DFMA Review & Critical-to-Quality Tolerance Cascade Complete',
        desc: 'Design for Manufacturing & Assembly audit and CMM GD&T inspection datums finalized.',
      },
      {
        name: 'Concept Selection & Design Freeze Committee Sign-off',
        desc: 'Cross-functional engineering freeze authorizing procurement and long-lead OEM orders.',
      },
    ],
  },
  'Gate 3': {
    label: 'Gate 3: Procurement & Build Readiness',
    completed: false,
    items: [
      {
        name: 'Long-Lead Component & OEM Purchase Orders Released',
        desc: 'Servo drives, linear rails, precision castings, and PLC hardware delivery schedules confirmed.',
      },
      {
        name: 'First-Article Fixture & Subassembly Fabrication Verified',
        desc: 'Prototype workholding fixtures and panel build pass dimensional and IEC 60204-1 checks.',
      },
      {
        name: 'Measurement System Analysis (Gage R&R < 10%) Qualified',
        desc: 'Inline metrology sensors and CMM inspection routines qualified before FAT.',
      },
      {
        name: 'Site Foundation, 480V Utility & Rigging Readiness Confirmed',
        desc: 'Concrete pad, compressed-air headers, chilled water loops, and crane rigging path cleared.',
      },
    ],
  },
  'Gate 4': {
    label: 'Gate 4: Commissioning & Performance Acceptance',
    completed: false,
    items: [
      {
        name: 'Factory & Site Acceptance Tests (FAT / SAT) Punchlist Closed',
        desc: 'All Priority-1 mechanical, electrical, and safety punchlist items resolved on plant floor.',
      },
      {
        name: 'Installation & Operational Qualification (IQ / OQ) Executed',
        desc: 'Laser leveling, utility load stability, PLC I/O loops, and E-stop stopping times verified.',
      },
      {
        name: 'Process Capability (Cpk >= 1.67) & Cycle-Time Study Passed',
        desc: 'Multi-part capability trial meets dimensional tolerances and rated throughput.',
      },
      {
        name: 'EHS Safety & MES / SCADA Telemetry Sign-off',
        desc: 'Guarding interlocks, noise limits (< 80 dBA), and real-time OEE reporting certified.',
      },
    ],
  },
  'Gate 5': {
    label: 'Gate 5: Operational Handover Approval',
    completed: false,
    items: [
      {
        name: '3-Shift OEE (>= 85%) Production Ramp-Up Qualified',
        desc: 'Three consecutive multi-shift production runs confirm process stability and yield.',
      },
      {
        name: 'As-Built Technical Transfer Dossier (TTD) & EPLAN Archive',
        desc: 'Final CAD drawings, electrical schematics, PLC source code, and spare BOMs archived.',
      },
      {
        name: 'CMMS Preventive Maintenance & Spares Crib Handed Over',
        desc: 'Lubrication schedules, sensor calibrations, and critical wear spares loaded in CMMS.',
      },
      {
        name: 'Operator & LOTO Certification Complete — Plant Handover',
        desc: 'All shift crews certified and executive Gate 5 closeout signed.',
      },
    ],
  },
};

function buildIndustrialStagesAndGates(): StageItem[] {
  const result: StageItem[] = [];
  let rowId = 1;

  for (const stage of INDUSTRIAL_STAGES_MASTER) {
    const wbsConfig = INDUSTRIAL_STAGES_WBS_MAP[stage.stageCode];
    const stageNum = Number(stage.stageCode.replace(/\D/g, '')) || rowId;
    const isCompleted = stageNum <= 2;

    const modules: ModuleItem[] = (wbsConfig?.sidebarMenus ?? []).map((deliv, dIdx) => {
      const activities = wbsConfig?.modulesData?.[dIdx] ?? [];
      return {
        id: stageNum * 100 + dIdx + 1,
        name: deliv.name,
        description: deliv.description || `Execute and obtain acceptance for ${deliv.name.toLowerCase()} under ${stage.stageName}.`,
        completed: isCompleted || (stageNum === 3 && dIdx === 0),
        tasks: activities.map((act, aIdx) => ({
          id: stageNum * 1000 + dIdx * 20 + aIdx + 1,
          name: act.task,
          description: act.description || `${act.department || 'Engineering'} activity (${act.duration}, ${act.effort}).`,
          completed: isCompleted || (stageNum === 3 && dIdx === 0 && aIdx < 2),
        })),
      };
    });

    result.push({
      id: rowId++,
      name: `${stage.stageCode}: ${stage.stageName}`,
      type: 'stage',
      completed: isCompleted,
      modules,
    });

    if (stage.gateCode && stage.gateCode !== '-' && INDUSTRIAL_GATE_DEFINITIONS[stage.gateCode]) {
      const gateDef = INDUSTRIAL_GATE_DEFINITIONS[stage.gateCode];
      const gateNum = Number(stage.gateCode.replace(/\D/g, '')) || 1;
      result.push({
        id: rowId++,
        name: gateDef.label,
        type: 'gate',
        completed: gateDef.completed,
        modules: [],
        tasks: gateDef.items.map((gItem, idx) => ({
          id: gateNum * 10000 + idx + 1,
          name: gItem.name,
          description: gItem.desc,
          completed: gateDef.completed,
        })),
      });
    }
  }

  return result;
}

@Component({
  selector: 'app-template-setup',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './template-setup.component.html',
  styleUrl: './template-setup.component.scss',
})
export class TemplateSetupComponent implements OnInit {
  projectName =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Industrial Equipment Line Expansion Program';

  projectCode: string = 'TPL/IND/001';
  dynamicBreadcrumb: string = 'Industrial Equipment Line Expansion Program - TPL/IND/001';

  selectedStage: StageItem | null = null;
  selectedModule: ModuleItem | null = null;

  stagesAndGates: StageItem[] = buildIndustrialStagesAndGates();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const templateName =
        params['templateName'] || params['projectName'] || params['name'];
      if (templateName) {
        this.projectName = templateName;
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    const defaultStage = this.stagesAndGates[0];
    this.selectStage(defaultStage);
  }

  selectStage(stage: StageItem): void {
    this.selectedStage = stage;
    if (stage.modules && stage.modules.length > 0) {
      this.selectedModule = stage.modules[0];
    } else {
      this.selectedModule = null;
    }
  }

  selectModule(moduleItem: ModuleItem): void {
    this.selectedModule = moduleItem;
  }

  goBack(): void {
    this.router.navigate(['/master-data/templates']);
  }
}
