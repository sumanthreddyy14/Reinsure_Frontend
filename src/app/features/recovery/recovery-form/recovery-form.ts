// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { RecoveryService } from '../../../services/recovery.service';
// import { Recovery } from '../../../models/recovery.model';
// import { Router, RouterLink } from '@angular/router';
// import { QuickLinks } from '../../Admin/quick-links/quick-links';

// @Component({
//   selector: 'app-recovery-form',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule,
//     RouterLink,
//     QuickLinks
//   ],
//   templateUrl: './recovery-form.html',
//   styleUrls: ['./recovery-form.css']
// })
// export class RecoveryFormComponent {
//   recoveryForm: FormGroup;

//   constructor(private fb: FormBuilder, private recoveryService: RecoveryService) {
//     this.recoveryForm = this.fb.group({
//       claimId: ['', Validators.required],
//       treatyId: ['', Validators.required],
//       recoveryAmount: ['', Validators.required],
//       recoveryDate: ['', Validators.required],
//       status: ['PENDING', Validators.required]
//     });
//   }

//   onSubmit(): void {
//   if (this.recoveryForm.valid) {
//     const formValue = this.recoveryForm.value;
//     const payload = {
//       claimId: formValue.claimId,
//       treatyId: formValue.treatyId,
//       recoveryAmount: Number(formValue.recoveryAmount),
//       recoveryDate: formValue.recoveryDate, // yyyy-MM-dd from <input type="date">
//       status: formValue.status
//     };
//     this.recoveryService.add(payload as any).subscribe(rec => {
//       console.log('Recovery created:', rec);
//       this.recoveryForm.reset({ status: 'PENDING' });
//     });
//   }
// }


// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RecoveryService } from '../../../services/recovery.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { QuickLinks } from '../../Admin/quick-links/quick-links';

@Component({
  selector: 'app-recovery-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink,
    QuickLinks
  ],
  templateUrl: './recovery-form.html',
  styleUrls: ['./recovery-form.css']
})
export class RecoveryFormComponent {
  recoveryForm: FormGroup;
  private recoveryId?: string;

  constructor(
    private fb: FormBuilder,
    private recoveryService: RecoveryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recoveryForm = this.fb.group({
      claimId: ['', Validators.required],
      treatyId: ['', Validators.required],
      recoveryAmount: ['', Validators.required],
      recoveryDate: ['', Validators.required], // yyyy-MM-dd
      status: ['PENDING', Validators.required]
    });
  }
ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  console.log('form id:', id);
  if (id) {
    this.recoveryService.getById(id).subscribe({
      next: rec => {
        this.recoveryForm.patchValue({
          claimId: rec.claimId,
          treatyId: rec.treatyId,
          recoveryAmount: rec.recoveryAmount,
          recoveryDate: rec.recoveryDate?.substring(0, 10), // yyyy-MM-dd
          status: rec.status
        });
      },
      error: err => console.error('Failed to load recovery for edit', err)
    });
  }
}

  onSubmit(): void {
    if (this.recoveryForm.invalid) return;

    const v = this.recoveryForm.value;

    if (this.recoveryId) {
      // UPDATE existing
      const payload = {
        recoveryAmount: Number(v.recoveryAmount),
        recoveryDate: v.recoveryDate, // yyyy-MM-dd
        status: v.status
      };
      this.recoveryService.update(this.recoveryId, payload).subscribe({
        next: updated => this.router.navigate(['/recoveries', updated.recoveryId]),
        error: err => console.error(err)
      });
    } else {
      // CREATE new
      const payload = {
        claimId: v.claimId,
        treatyId: v.treatyId,
        recoveryAmount: Number(v.recoveryAmount),
        recoveryDate: v.recoveryDate,
        status: v.status
      };
      this.recoveryService.add(payload as any).subscribe({
        next: created => this.router.navigate(['/recoveries', created.recoveryId]),
        error: err => console.error(err)
      });
    }
  }
}