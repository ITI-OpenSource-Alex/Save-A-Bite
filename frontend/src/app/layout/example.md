for example:

## in the path src/app/layout/main-layout/main-layout.ts there's one layout

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>

      <div class="layout-body">
        <app-sidebar></app-sidebar>

        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class MainLayoutComponent {}
```

## and in src/app/layout/auth-layout/auth-layout.ts there's another layout

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-container">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AuthLayoutComponent {}
```

## now we have to configure the router paths

```typescript
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ---------------------------------------------------------
  // 1. PUBLIC ROUTES (Uses AuthLayout)
  // ---------------------------------------------------------
  {
    path: 'auth',
    component: AuthLayoutComponent, // The parent wrapper
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
      },
    ],
  },

  // ---------------------------------------------------------
  // 2. PROTECTED ROUTES (Uses MainLayout)
  // ---------------------------------------------------------
  {
    path: '',
    component: MainLayoutComponent, // The parent wrapper
    canActivate: [authGuard], // Protects the layout and ALL children
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'billing',
        loadComponent: () =>
          import('./features/billing/billing.component').then((m) => m.BillingComponent),
      },
    ],
  },

  // ---------------------------------------------------------
  // 3. FALLBACK ROUTE
  // ---------------------------------------------------------
  { path: '**', redirectTo: 'auth/login' },
];
```
