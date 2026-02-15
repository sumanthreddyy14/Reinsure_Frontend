// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './login.html',
//   styleUrls: ['./login.css']
// })
// export class LoginComponent {
//   loginForm: FormGroup;
//   isSignUp = false;
//   isSubmitted = false;
//   loading = false;

//   constructor(private fb: FormBuilder, private router: Router,private auth: AuthService) {
//     this.loginForm = this.fb.group({
//       username: ['', [Validators.required, Validators.minLength(3)]],
//       // email: ['', [Validators.email]], 
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       role: ['admin', Validators.required]
//     });
//   }

//   toggleMode() {
//     this.isSignUp = !this.isSignUp;
//     this.isSubmitted = false;
//     const emailControl = this.loginForm.get('email');
//     if (this.isSignUp) {
//       emailControl?.setValidators([Validators.required, Validators.email]);
//     } else {
//       emailControl?.clearValidators();
//     }
//     emailControl?.updateValueAndValidity();
//   }


//   get f() { return this.loginForm.controls; }


// onSubmit() {
//   this.isSubmitted = true;
//   if (this.loginForm.invalid) return;

//   this.loading = true;
//   setTimeout(() => {
//     this.loading = false;
//     const { username, role } = this.loginForm.value;

//     // Create user info object
//     const userInfo = {
//       userId: username,
//       persona: role === 'admin' ? 'Administrator' : 'Finance Specialist',
//       lastLogin: new Date().toLocaleString()
//     };

//     this.auth.setUser(userInfo);

//     if (!this.isSignUp) {
//       this.router.navigate([role === 'admin' ? '/admin-dashboard' : '/dashboard']);
//     } else {
//       alert('Registration Successful');
//       this.toggleMode();
//     }
//   }, 100);
// }
// }



// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './login.html',
//   styleUrls: ['./login.css']
// })
// export class LoginComponent {
//   private fb = inject(FormBuilder);
//   private router = inject(Router);
//   private auth = inject(AuthService);

//   loginForm: FormGroup;
//   isSignUp = false;
//   isSubmitted = false;
//   loading = false;
//   serverError = '';

//   constructor() {
//     this.loginForm = this.fb.group({
//       username: ['', [Validators.required, Validators.minLength(3)]],
//       // Email is only used on Sign Up (backend doesn't require it)
//       email: [''],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       // Role is required on Sign Up
//       role: ['']
//     });
//   }

//   get f() {
//     return this.loginForm.controls;
//   }

//   toggleMode() {
//     this.isSignUp = !this.isSignUp;
//     this.isSubmitted = false;
//     this.serverError = '';

//     const emailControl = this.loginForm.get('email');
//     const roleControl = this.loginForm.get('role');

//     if (this.isSignUp) {
//       emailControl?.setValidators([Validators.required, Validators.email]);
//       roleControl?.setValidators([Validators.required]);
//     } else {
//       emailControl?.clearValidators();
//       roleControl?.clearValidators();
//     }
//     emailControl?.updateValueAndValidity();
//     roleControl?.updateValueAndValidity();
//   }

//   onSubmit() {
//     this.isSubmitted = true;
//     this.serverError = '';

//     if (this.loginForm.invalid) return;

//     const { username, password, role } = this.loginForm.value;
//     this.loading = true;

//     if (this.isSignUp) {
//       // Registration (backend expects: username, password, role)
//       const roleUpper = (role || '').toString().toUpperCase();
//       this.auth.register(username, password, roleUpper).subscribe({
//         next: () => {
//           this.loading = false;
//           alert('Registration Successful. Please sign in.');
//           this.toggleMode();
//         },
//         error: (err) => {
//           this.loading = false;
//           this.serverError = err?.error || 'Registration failed';
//         }
//       });
//       return;
//     }

//     // Login (backend returns raw JWT token)
//     this.auth.login(username, password).subscribe({
//       next: (user) => {
//         this.loading = false;
//         // Navigate by role decoded from JWT
//         if (user.role === 'ADMIN') {
//           this.router.navigate(['/admin-dashboard']);
//         } else {
//           this.router.navigate(['/dashboard']);
//         }
//       },
//       error: (err) => {
//         this.loading = false;
//         this.serverError = err?.error || 'Invalid username or password';
//       }
//     });
//   }
// }
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: [''] // required only on SignUp
  });

  isSignUp = false;
  isSubmitted = false;
  loading = false;
  serverError = '';

  get f() { return this.loginForm.controls; }

  toggleMode() {
    this.isSignUp = !this.isSignUp;
    this.isSubmitted = false;
    this.serverError = '';

    const emailControl = this.loginForm.get('email');
    const roleControl = this.loginForm.get('role');

    if (this.isSignUp) {
      emailControl?.setValidators([Validators.required, Validators.email]);
      roleControl?.setValidators([Validators.required]);
    } else {
      emailControl?.clearValidators();
      roleControl?.clearValidators();
    }
    emailControl?.updateValueAndValidity();
    roleControl?.updateValueAndValidity();
  }

  onSubmit() {
    this.isSubmitted = true;
    this.serverError = '';

    if (this.loginForm.invalid) {
      console.warn('[LoginComponent] form invalid', this.loginForm.value, this.loginForm.errors, this.loginForm);
      return;
    }

    const { username, password, role } = this.loginForm.value;
    this.loading = true;

    if (this.isSignUp) {
      const roleUpper = (role || '').toString().toUpperCase();
      console.log('[LoginComponent] register submit', { username, roleUpper });
      this.auth.register(username, password, roleUpper).subscribe({
        next: (msg) => {
          console.log('[LoginComponent] register success', msg);
          this.loading = false;
          // Use setTimeout to allow UI update (hide loader) before alert
          setTimeout(() => {
            alert('Registration Successful. Please sign in.');
            this.toggleMode(); // Redirect to Login mode
          }, 10);
        },
        error: (err) => {
          console.error('[LoginComponent] register error', err);
          this.loading = false;
          this.serverError = (err?.error || 'Registration failed');
        }
      });
      return;
    }

    console.log('[LoginComponent] login submit', { username });
    this.auth.login(username, password).subscribe({
      next: (user) => {
        console.log('[LoginComponent] login success', user);
        this.loading = false;
        if (user.role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/dashboard']); // or finance-dashboard
        }
      },
      error: (err) => {
        console.error('[LoginComponent] login error', err);
        this.loading = false;
        this.serverError = (err?.error || 'Invalid username or password');

        // Popup as requested by user
        if (this.serverError) {
          // Use a short timeout to let the UI update first, or just alert immediately
          setTimeout(() => alert('Login Failed: ' + this.serverError), 10);
        }
      }
    });
  }
}