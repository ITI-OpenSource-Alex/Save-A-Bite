import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ProductPage } from './layout/product.page/product.page';
import { Home } from '@/layout/layouts/home/home';
import { MainLayout } from '@/layout/layouts/main-layout/main-layout';
import { Browse } from './layout/layouts/browse/browse';

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
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
