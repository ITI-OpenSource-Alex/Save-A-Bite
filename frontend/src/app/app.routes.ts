import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ProductPage } from './layout/product-page/product-page';
import { Home } from '@/layout/layouts/home/home';
import { MainLayout } from '@/layout/layouts/main-layout/main-layout';

export const routes: Routes = [
  // ─── Shared Layout Routes (with Navbar & Footer) ───
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'checkout/success', 
        loadComponent: () => import('./features/checkout/components/checkout-success/checkout-success')
          .then(m => m.CheckoutSuccessComponent) 
      },
      { path: 'checkout/cancel', redirectTo: 'cart' },
      {
        path: 'browse',
        loadComponent: () => import('./layout/layouts/browse/browse').then((m) => m.Browse),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./layout/layouts/product-layout/product-layout').then((m) => m.ProductLayout),
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart').then((m) => m.CartComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login')
            .then(m => m.LoginComponent)
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/signup/signup')
            .then(m => m.SignupComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password')
            .then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'become-vendor',
        loadComponent: () =>
          import('./features/vendor/become-vendor/become-vendor')
            .then(m => m.BecomeVendorComponent),
      }
    ],
  },

  // ─── Standalone Portal Routes (No Global Navbar) ───
  {
    path: 'vendor/dashboard',
    loadComponent: () =>
      import('./features/vendor/vendor-dashboard/vendor-dashboard')
        .then(m => m.VendorDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['vendor'] },
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['super-admin'] },
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
