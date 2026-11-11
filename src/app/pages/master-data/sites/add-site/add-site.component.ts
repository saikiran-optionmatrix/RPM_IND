import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-site',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-site.component.html',
  styleUrl: './add-site.component.scss',
})
export class AddSiteComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  states: string[] = [
    'Maharashtra',
    'Tamil Nadu',
    'Karnataka',
    'Telangana',
    'Gujarat',
  ];

  stateCitiesMap: { [key: string]: string[] } = {
    'Maharashtra': ['Mumbai', 'Pune'],
    'Tamil Nadu': ['Chennai'],
    'Karnataka': ['Bengaluru'],
    'Telangana': ['Hyderabad'],
    'Gujarat': ['Ahmedabad', 'Vadodara'],
  };

  allCities: string[] = [
    'Ahmedabad',
    'Baddi',
    'Bengaluru',
    'Chennai',
    'Delhi',
    'Hyderabad',
    'Mumbai',
    'Pune',
    'Vadodara',
  ];

  filteredCities: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddSiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.filteredCities = [...this.allCities];

    this.myGroup = this.fb.group({
      SiteName: ['', [Validators.required]],
      SiteCode: ['', [Validators.required]],
      State: ['', [Validators.required]],
      City: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.isEditMode) {
      const state = this.data.State ?? this.data.state ?? '';
      const city = this.data.City ?? this.data.city ?? '';

      this.myGroup.patchValue({
        SiteName: this.data.SiteName ?? this.data.name ?? '',
        SiteCode: this.data.SiteCode ?? this.data.code ?? '',
        State: state,
        City: city,
      });

      if (state && this.stateCitiesMap[state]) {
        this.filteredCities = this.stateCitiesMap[state];
      }
    }
  }

  onStateChange(): void {
    const selectedState = this.myGroup.get('State')?.value;
    if (selectedState && this.stateCitiesMap[selectedState]) {
      this.filteredCities = this.stateCitiesMap[selectedState];
      const currentCity = this.myGroup.get('City')?.value;
      if (currentCity && !this.filteredCities.includes(currentCity)) {
        this.myGroup.patchValue({ City: '' });
      }
    } else {
      this.filteredCities = [...this.allCities];
    }
  }

  onCityChange(): void {
    const selectedCity = this.myGroup.get('City')?.value;
    const currentState = this.myGroup.get('State')?.value;
    if (selectedCity && !currentState) {
      for (const [state, cities] of Object.entries(this.stateCitiesMap)) {
        if (cities.includes(selectedCity)) {
          this.myGroup.patchValue({ State: state });
          this.filteredCities = cities;
          break;
        }
      }
    }
  }

  upsertSite(): void {
    this.isSubmitting = true;

    if (this.myGroup.invalid) {
      return;
    }

    this.dialogRef.close({
      ...this.data,
      ...this.myGroup.value,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
