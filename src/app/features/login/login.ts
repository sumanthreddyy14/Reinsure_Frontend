import { Component } from '@angular/core';
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
  loginForm: FormGroup;
  isSignUp = false;
  isSubmitted = false;
  loading = false;

  constructor(private fb: FormBuilder, private router: Router,private auth: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['admin', Validators.required]
    });
  }

  toggleMode() {
    this.isSignUp = !this.isSignUp;
    this.isSubmitted = false;
    const emailControl = this.loginForm.get('email');
    if (this.isSignUp) {
      emailControl?.setValidators([Validators.required, Validators.email]);
    } else {
      emailControl?.clearValidators();
    }
    emailControl?.updateValueAndValidity();
  }


  get f() { return this.loginForm.controls; }


onSubmit() {
  this.isSubmitted = true;
  if (this.loginForm.invalid) return;

  this.loading = true;
  setTimeout(() => {
    this.loading = false;
    const { username, role } = this.loginForm.value;

    // Create user info object
    const userInfo = {
      userId: username,
      persona: role === 'admin' ? 'Administrator' : 'Finance Specialist',
      lastLogin: new Date().toLocaleString()
    };

    this.auth.setUser(userInfo);

    if (!this.isSignUp) {
      this.router.navigate([role === 'admin' ? '/admin-dashboard' : '/dashboard']);
    } else {
      alert('Registration Successful');
      this.toggleMode();
    }
  }, 100);
}
}
