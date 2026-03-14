import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@/core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './signup.html'
})
export class SignupComponent {

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';

  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  signup() {

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      phone: this.phone || undefined
    }).subscribe({

      next: () => {
        this.successMessage =
          'Account created successfully. Please check your email to verify your account.';
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        this.loading = false;
        const msg = err.error?.message;
        this.error = (msg && msg !== 'BAD_REQUEST') 
          ? msg 
          : 'Registration failed. Please check your inputs and try again.';
        this.cdr.detectChanges();
      }

    });
  }

}