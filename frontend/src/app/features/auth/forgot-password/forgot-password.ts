import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@/core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html'
})
export class ForgotPasswordComponent {
  // Step 1: Request OTP
  email = '';
  
  // Step 2: Verify OTP and Reset
  otpArray: string[] = ['', '', '', '', '', ''];
  newPassword = '';
  confirmPassword = '';
  
  otpIndices = [0, 1, 2, 3, 4, 5];

  get otp(): string {
    return this.otpArray.join('');
  }

  onOtpInput(event: any, index: number) {
    const value = event.target.value;
    if (value && index < 5) {
      const nextInput = document.getElementById('otp-' + (index + 1));
      if (nextInput) nextInput.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpArray[index] && index > 0) {
      const prevInput = document.getElementById('otp-' + (index - 1));
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text');
    if (pasteData) {
      const numbers = pasteData.replace(/\D/g, '').split('').slice(0, 6);
      for (let i = 0; i < numbers.length; i++) {
        this.otpArray[i] = numbers[i];
      }
      const focusIndex = Math.min(numbers.length, 5);
      const nextInput = document.getElementById('otp-' + focusIndex);
      if (nextInput) nextInput.focus();
    }
  }

  step: 1 | 2 | 3 = 1;
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  requestOtp() {
    if (!this.email) {
      this.error = 'Please enter your email address.';
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'OTP sent to your email. Please check your inbox.';
        this.step = 2; // Move to the next step
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to send OTP. Ensure your email is valid.';
        this.cdr.detectChanges();
      }
    });
  }

  verifyOtp() {
    if (this.otp.length !== 6) {
      this.error = 'Please enter a valid 6-digit OTP.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.authService.verifyResetOtp({ email: this.email, otp: this.otp }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'OTP verified! Please enter your new password.';
        this.step = 3; // Move to the new password step
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Invalid or expired OTP.';
        this.cdr.detectChanges();
      }
    });
  }

  resetPassword() {
    if (!this.otp || !this.newPassword || !this.confirmPassword) {
      this.error = 'Please fill in all fields.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.authService.resetPassword({
      email: this.email,
      otp: this.otp,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Password reset successfully! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to reset password. Check your inputs.';
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    if (this.step === 3) {
      this.step = 2;
    } else if (this.step === 2) {
      this.step = 1;
    }
    this.error = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }
}
