
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TreatyService } from '../../../services/treaty.service';
import { ReinsurerService } from '../../../services/reinsurer.service';
import { QuickLinks } from '../../Admin/quick-links/quick-links';
import { Treaty } from '../../../models/treaty.model';
import { Reinsurer } from '../../../models/reinsurer.model';

@Component({
  selector: 'app-treaty-form',
  standalone: true,
  imports: [
    CommonModule,
    QuickLinks,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './treaty-form.html',
  styleUrl: './treaty-form.css',
})
export class TreatyForm {
  form: FormGroup;
  isEdit = false;
  reinsurers: Reinsurer[] = [];

  constructor(
    private fb: FormBuilder,
    private treatyService: TreatyService,
    private reinsurerService: ReinsurerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      // treatyId required ONLY in edit mode; we set validator dynamically
      treatyId: [''],

      // must send reinsurerId to backend
      reinsurerId: ['', Validators.required],

      // purely for UX; we auto-populate name based on selected reinsurer
      reinsurerName: [{ value: '', disabled: false }],

      treatyType: ['', Validators.required],
      coverageLimit: [0, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      renewalDate: [''],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // 1) Load reinsurers for dropdown
    this.reinsurerService.list().subscribe({
      next: (list) => {
        this.reinsurers = list ?? [];
        // If an id is in route, load treaty (edit mode)
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.isEdit = true;
          // require treatyId only in edit mode
          this.form.get('treatyId')?.addValidators([Validators.required]);
          this.form.get('treatyId')?.updateValueAndValidity();

          this.treatyService.getById(id).subscribe({
            next: (t) => {
              if (t) {
                this.form.patchValue({
                  treatyId: t.treatyId,
                  reinsurerId: t.reinsurerId,
                  reinsurerName: t.reinsurerName,
                  treatyType: t.treatyType,
                  coverageLimit: t.coverageLimit,
                  startDate: t.startDate,
                  endDate: t.endDate,
                  renewalDate: t.renewalDate ?? '',
                  status: t.status,
                });
              }
            },
            error: (err) => {
              console.error('Failed to load treaty', err);
              alert('Failed to load treaty');
              this.router.navigate(['/treaties']);
            },
          });
        }
      },
      error: (err) => {
        console.error('Failed to load reinsurers', err);
        alert('Failed to load reinsurers. Please try again.');
      },
    });

    // 2) Auto-fill reinsurerName when reinsurerId changes
    this.form.get('reinsurerId')?.valueChanges.subscribe((rid: string) => {
      const r = this.reinsurers.find((x) => x.reinsurerId === rid);
      this.form.get('reinsurerName')?.setValue(r?.name ?? '');
    });
  }

  onReinsurerChange(): void {
    const rid = this.form.get('reinsurerId')?.value;
    const r = this.reinsurers.find((x) => x.reinsurerId === rid);
    this.form.get('reinsurerName')?.setValue(r?.name ?? '');
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Build payload the backend expects (Treaty interface)
    // getRawValue to include disabled/read-only fields if needed
    const value = this.form.getRawValue();

    // In CREATE mode, if treatyId is empty, remove it so backend generates one
    if (!this.isEdit && (!value.treatyId || !value.treatyId.trim())) {
      delete value.treatyId;
    }

    const payload: Treaty = {
      treatyId: value.treatyId ?? '',      // if empty in create, backend ignores
      reinsurerId: value.reinsurerId,      // REQUIRED
      reinsurerName: value.reinsurerName ?? '',
      treatyType: value.treatyType,
      coverageLimit: Number(value.coverageLimit),
      startDate: value.startDate,
      endDate: value.endDate,
      status: value.status,
      renewalDate: value.renewalDate || undefined,
    };

    this.treatyService.save(payload).subscribe({
      next: () => {
        this.router.navigate(['/treaties']);
      },
      error: (err) => {
        console.error('Save failed', err);
        const msg = err?.error?.error || err?.message || 'Save failed';
        alert(msg);
      },
    });
  }
}
