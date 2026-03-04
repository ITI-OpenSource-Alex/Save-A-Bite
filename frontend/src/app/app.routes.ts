import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ProductPage } from './layout/product.page/product.page';

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
];