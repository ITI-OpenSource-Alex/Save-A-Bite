import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '@/core/services/auth.service';
import { OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['verified'] === 'true') {
        this.successMessage = 'Email verified successfully! You can now sign in.';
      }
    });
  }

  login() {
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          this.loading = false;
          const token = res.data?.accessToken;
          if (token) {
            this.authService.saveToken(token);
            this.router.navigate(['/home']);
          } else {
            this.error = 'Invalid email or password';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Invalid email or password';
          this.cdr.detectChanges();
        }
      });
  }

}