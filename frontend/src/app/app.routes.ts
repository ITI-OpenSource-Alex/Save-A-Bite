import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
// import { ProductPage } from './layout/product-page/product-page';
import { Home } from '@/layout/layouts/home/home';
import { MainLayout } from '@/layout/layouts/main-layout/main-layout';
import { Browse } from './layout/layouts/browse/browse';
import { ProductLayout } from './layout/layouts/product-layout/product-layout/product-layout';

//@Component({ template: '<h1>Welcome Home! (Public)</h1>', standalone: true })

//export class DummyHomeComponent {}

//@/omponent({ template: '<h1>Checkout Page (Protected)</h1>', standalone: true })
//export class DummyCheckoutComponent {}

//@Component({ template: '<h1>Admin Dashboard (Restricted)</h1>', standalone: true })
///export class DummyAdminComponent {}

export const routes: Routes = [
  // {
  //    path: 'home',
  //  component: DummyHomeComponent
  //},
  //  {
  //    path: 'checkout',
  //   component: DummyCheckoutComponent,
  //   canActivate: [authGuard]
  // },
  // {
  //   path: 'admin',
  //   component: DummyAdminComponent,
  //   canActivate: [roleGuard],
  //   data: { roles: ['Admin'] }
  //},
  // {
  //  path: '**',
  //  redirectTo: 'home'
  // }
  {
    // The Layout acts as the parent route
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        // Eagerly loaded: Bundled with the main app
        path: 'home',
        component: Home,
      },
      {
        // Lazy loaded: Fetched over the network only when clicked
        path: 'browse',
        loadComponent: () => import('./layout/layouts/browse/browse').then((m) => m.Browse),
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./layout/layouts/product-layout/product-layout/product-layout').then((m) => m.ProductLayout),
      }

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
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
