import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VendorService } from '@/core/services/vendor.service';
import { AuthService } from '@/core/services/auth.service';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vendor-dashboard.html',
  styleUrl: './vendor-dashboard.css',
})
export class VendorDashboardComponent implements OnInit {
  store: any = null;
  products: any[] = [];
  categories: any[] = [];
  isLoading = true;
  activeTab: 'products' | 'add' | 'store' = 'products';

  // Add product form
  newProduct = {
    name: '',
    categoryId: '',
    price: 0,
    stock: 0,
    description: '',
    images: [''],
    isFlashDeal: false,
    discountPercentage: 0
  };

  // Edit product
  editingProduct: any = null;
  editForm = {
    name: '',
    price: 0,
    stock: 0,
    description: '',
    images: [''],
    isFlashDeal: false,
    discountPercentage: 0
  };

  successMessage = '';
  errorMessage = '';
  isSubmitting = false;
  isUploading = false;

  constructor(
    private vendorService: VendorService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const role = this.authService.getUserRole();
    if (role !== 'vendor') {
      this.router.navigate(['/become-vendor']);
      return;
    }

    this.loadStoreData();
    this.loadCategories();
  }

  loadStoreData() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.vendorService.getMyStore().subscribe({
      next: (res) => {
        this.store = res.data.store;
        this.products = res.data.products;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.store = null;
        }
        this.cdr.detectChanges();
      }
    });
  }

  loadCategories() {
    this.vendorService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = Array.isArray(res) ? res : (res.data || []);
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }

  addImageField() {
    this.newProduct.images.push('');
    this.cdr.detectChanges();
  }

  removeImageField(index: number) {
    this.newProduct.images.splice(index, 1);
    this.cdr.detectChanges();
  }

  addProduct() {
    if (!this.newProduct.name || !this.newProduct.categoryId || !this.newProduct.price || !this.newProduct.description) {
      this.errorMessage = 'Please fill in all required fields.';
      this.cdr.detectChanges();
      return;
    }

    const images = this.newProduct.images.filter(img => img.trim() !== '');
    if (images.length === 0) {
      this.errorMessage = 'Please add at least one product image URL.';
      this.cdr.detectChanges();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.vendorService.addProduct(this.store._id, {
      name: this.newProduct.name,
      categoryId: this.newProduct.categoryId,
      price: this.newProduct.price,
      stock: this.newProduct.stock,
      description: this.newProduct.description,
      images,
      isFlashDeal: this.newProduct.isFlashDeal,
      discountPercentage: this.newProduct.discountPercentage
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Product added successfully! Your store is updated immediately.';
        this.newProduct = { 
          name: '', 
          categoryId: '', 
          price: 0, 
          stock: 0, 
          description: '', 
          images: [''],
          isFlashDeal: false,
          discountPercentage: 0
        };
        this.loadStoreData();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.activeTab = 'products';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to add product.';
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(product: any) {
    this.editingProduct = product;
    this.editForm = {
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      images: [...(product.images || [''])],
      isFlashDeal: product.isFlashDeal || false,
      discountPercentage: product.discountPercentage || 0
    };
    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.editingProduct = null;
    this.cdr.detectChanges();
  }

  saveEdit() {
    if (!this.editingProduct) return;
    this.isSubmitting = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const images = this.editForm.images.filter(img => img.trim() !== '');

    this.vendorService.updateProduct(this.editingProduct._id, {
      name: this.editForm.name,
      price: this.editForm.price,
      stock: this.editForm.stock,
      description: this.editForm.description,
      images: images.length > 0 ? images : undefined,
      isFlashDeal: this.editForm.isFlashDeal,
      discountPercentage: this.editForm.discountPercentage
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.editingProduct = null;
        this.successMessage = 'Product updated immediately!';
        this.loadStoreData();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to update product.';
        this.cdr.detectChanges();
      }
    });
  }

  deleteProduct(productId: string) {
    if (!confirm('Are you sure you want to delete this product? It will be removed from the app immediately.')) return;

    this.vendorService.deleteProduct(productId).subscribe({
      next: () => {
        this.successMessage = 'Product removed from store.';
        this.loadStoreData();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to delete product.';
        this.cdr.detectChanges();
      }
    });
  }

  addEditImageField() {
    this.editForm.images.push('');
    this.cdr.detectChanges();
  }

  removeEditImageField(index: number) {
    this.editForm.images.splice(index, 1);
    this.cdr.detectChanges();
  }

  getCategoryName(product: any): string {
    if (product.categoryId && typeof product.categoryId === 'object') {
      return product.categoryId.name || 'Unknown';
    }
    const cat = this.categories.find(c => c._id === product.categoryId);
    return cat ? cat.name : 'Unknown';
  }

  trackByIndex(index: number): number {
    return index;
  }

  onFileSelected(event: any, type: 'new' | 'edit', index: number) {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploading = true;
    this.cdr.detectChanges();

    this.vendorService.uploadImage(file).subscribe({
      next: (res) => {
        if (type === 'new') {
          this.newProduct.images[index] = res.data.url;
        } else {
          this.editForm.images[index] = res.data.url;
        }
        this.isUploading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = 'Failed to upload image. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}
