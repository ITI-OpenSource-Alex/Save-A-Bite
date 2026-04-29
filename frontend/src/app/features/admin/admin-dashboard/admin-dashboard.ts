import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VendorService, VendorRequest, VendorWithStore } from '@/core/services/vendor.service';
import { AuthService } from '@/core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'requests' | 'vendors' = 'requests';
  statusFilter: string = 'pending';

  requests: VendorRequest[] = [];
  vendors: VendorWithStore[] = [];

  isLoading = true;
  actionLoading: string | null = null; // id of item being acted on

  successMessage = '';
  errorMessage = '';

  // Reject modal
  showRejectModal = false;
  rejectRequestId = '';
  rejectionReason = '';

  constructor(
    private vendorService: VendorService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const role = this.authService.getUserRole();
    if (role !== 'super-admin') {
      this.router.navigate(['/']);
      return;
    }

    this.loadRequests();
    this.loadVendors();
  }

  loadRequests() {
    this.isLoading = true;
    this.cdr.detectChanges();
    const status = this.statusFilter || undefined;
    this.vendorService.getAllRequests(status).subscribe({
      next: (res) => {
        this.requests = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadVendors() {
    this.vendorService.getAllVendors().subscribe({
      next: (res) => {
        this.vendors = res.data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }

  onFilterChange() {
    this.loadRequests();
  }

  approveRequest(requestId: string) {
    this.actionLoading = requestId;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.vendorService.reviewRequest(requestId, 'approved').subscribe({
      next: () => {
        this.actionLoading = null;
        this.successMessage = 'Vendor request approved! Store has been created.';
        this.loadRequests();
        this.loadVendors();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        this.actionLoading = null;
        this.errorMessage = err.error?.message || 'Failed to approve request.';
        this.cdr.detectChanges();
      }
    });
  }

  openRejectModal(requestId: string) {
    this.rejectRequestId = requestId;
    this.rejectionReason = '';
    this.showRejectModal = true;
    this.cdr.detectChanges();
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.rejectRequestId = '';
    this.rejectionReason = '';
    this.cdr.detectChanges();
  }

  confirmReject() {
    this.actionLoading = this.rejectRequestId;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.vendorService.reviewRequest(this.rejectRequestId, 'rejected', this.rejectionReason).subscribe({
      next: () => {
        this.actionLoading = null;
        this.successMessage = 'Vendor request rejected.';
        this.closeRejectModal();
        this.loadRequests();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        this.actionLoading = null;
        this.errorMessage = err.error?.message || 'Failed to reject request.';
        this.cdr.detectChanges();
      }
    });
  }

  deleteVendor(vendorId: string, vendorName: string) {
    if (!confirm(`Are you sure you want to delete vendor "${vendorName}"? This will immediately remove their store and all products.`)) {
      return;
    }

    this.actionLoading = vendorId;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.vendorService.deleteVendor(vendorId).subscribe({
      next: () => {
        this.actionLoading = null;
        this.successMessage = `Vendor "${vendorName}" has been deleted. Store and products removed.`;
        this.loadVendors();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        this.actionLoading = null;
        this.errorMessage = err.error?.message || 'Failed to delete vendor.';
        this.cdr.detectChanges();
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'approved': return 'text-green-700 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  }
}
