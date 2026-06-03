import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'demos', loadComponent: () => import('./demos/demo-index.component').then((m) => m.DemoIndexComponent) },
  { path: 'demos/routes', loadComponent: () => import('./demos/routes-demo.component').then((m) => m.RoutesDemoComponent) },
  { path: 'demos/manual', loadComponent: () => import('./demos/manual-demo.component').then((m) => m.ManualDemoComponent) },
  { path: 'demos/tag', loadComponent: () => import('./demos/tag-demo.component').then((m) => m.TagDemoComponent) },
  { path: '**', redirectTo: 'dashboard' },
];
