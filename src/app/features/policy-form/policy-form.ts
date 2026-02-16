import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PolicyService } from '../../services/policy.service';
import { QuickLinks } from '../Admin/quick-links/quick-links';

@Component({
  selector: 'app-policy-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    QuickLinks
  ],
  templateUrl: './policy-form.html',
  styleUrls: ['./policy-form.css']
})
export class PolicyForm {
  private fb = inject(FormBuilder);
  private policyService = inject(PolicyService);
  private router = inject(Router);

  policyForm: FormGroup = this.fb.group({
    policyId: ['', Validators.required],
    premium: ['', [Validators.required, Validators.min(0)]]
  });

  onSubmit() {
    if (this.policyForm.valid) {
      this.policyService.createPolicy(this.policyForm.value).subscribe({
        next: () => {
          alert('Policy created successfully!');
          this.policyForm.reset();
        },
        error: (err: any) => {
          const msg = err?.error?.message || err?.error?.error || err?.message || 'Failed to create policy';
          alert(msg);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/admin/dashboard']);
  }
}
