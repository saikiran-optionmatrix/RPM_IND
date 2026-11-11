import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectMaterial } from '../project-materials.component';

@Component({
  selector: 'app-add-requisition',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './add-requisition.component.html',
  styleUrl: './add-requisition.component.scss'
})
export class AddRequisitionComponent implements OnInit {

  isEditMode: boolean = false;
  materialData: Partial<ProjectMaterial> = {
    itemName: '',
    quantity: 0,
    unitRate: 0,
    materialCost: 0,
    targetDate: '',
    remarks: '',
    requestedBy: '',
    requestDate: '',
    requestedQuantity: 0,
    issuedQuantity: 0,
    issueDate: '',
    available: false,
    reserved: false,
    issued: false,
    stage: 'Feasibility',
    module: 'API Assessment',
    task: 'API Evaluation'
  };

  constructor(
    public dialogRef: MatDialogRef<AddRequisitionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectMaterial | null
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.materialData = { ...this.data };
    } else {
      const today = new Date().toISOString().split('T')[0];
      this.materialData.requestDate = today;
      this.materialData.targetDate = today;
    }
  }

  calculateCost(): void {
    const qty = this.materialData.quantity || this.materialData.requestedQuantity || 0;
    const rate = this.materialData.unitRate || 0;
    this.materialData.materialCost = qty * rate;
  }

  save(): void {
    if (!this.materialData.itemName || !this.materialData.itemName.trim()) {
      alert('Please enter an Item Name.');
      return;
    }
    this.dialogRef.close(this.materialData);
  }

  close(): void {
    this.dialogRef.close();
  }
}
