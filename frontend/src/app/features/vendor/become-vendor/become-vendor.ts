import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VendorService, VendorRequest } from '@/core/services/vendor.service';
import { AuthService } from '@/core/services/auth.service';

@Component({
  selector: 'app-become-vendor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './become-vendor.html',
  styleUrl: './become-vendor.css',
})
export class BecomeVendorComponent implements OnInit {
  // Form fields (Store)
  storeName = '';
  storeDescription = '';
  storePhone = '';
  storeEmail = '';
  storeLogoUrl = '';
  message = '';

  // Form fields (User - for guests)
  name = '';
  email = '';
  password = '';

  isLoading = false;
  successMessage = '';
  errorMessage = '';
  isUserLoggedIn = false;

  existingRequests: VendorRequest[] = [];
  hasPendingRequest = false;
  isVendor = false;

  constructor(
    private vendorService: VendorService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isUserLoggedIn = this.authService.isAuthenticated();
    const role = this.authService.getUserRole();
    this.isVendor = role === 'vendor';

    if (this.isVendor) {
      this.router.navigate(['/vendor/dashboard']);
      return;
    }

    this.vendorService.getMyRequests().subscribe({
      next: (res) => {
        this.existingRequests = res.data;
        this.hasPendingRequest = this.existingRequests.some(r => r.status === 'pending');
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  submitRequest() {
    if (!this.storeName || !this.storeDescription || !this.storePhone || !this.storeEmail) {
      this.errorMessage = 'Please fill in all required fields.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.isValidEmail(this.storeEmail)) {
      this.errorMessage = 'Please enter a valid store email address.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.isUserLoggedIn) {
      if (!this.name || !this.email || !this.password) {
        this.errorMessage = 'Please provide your account details (Name, Email, Password).';
        this.cdr.detectChanges();
        return;
      }
      if (!this.isValidEmail(this.email)) {
        this.errorMessage = 'Please enter a valid account email address.';
        this.cdr.detectChanges();
        return;
      }
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    const payload: any = {
      storeName: this.storeName,
      storeDescription: this.storeDescription,
      storePhone: this.storePhone,
      storeEmail: this.storeEmail,
      storeLogoUrl: this.storeLogoUrl || undefined,
      message: this.message || undefined,
    };

    // Only add guest details if NOT logged in
    if (!this.isUserLoggedIn) {
      payload.name = this.name;
      payload.email = this.email;
      payload.password = this.password;
    }

    this.vendorService.submitVendorRequest(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Your vendor application has been submitted! We will review it shortly.';
        this.hasPendingRequest = true;
        this.storeName = '';
        this.storeDescription = '';
        this.storePhone = '';
        this.storeEmail = '';
        this.storeLogoUrl = '';
        this.message = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to submit request. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  logout() {
    this.authService.logout();
    this.isUserLoggedIn = false;
    this.existingRequests = [];
    this.hasPendingRequest = false;
    this.cdr.detectChanges();
  }
}
