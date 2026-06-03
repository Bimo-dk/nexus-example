import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'demos',
    loadComponent: () => import('./demos/demo-dashboard.component').then((m) => m.DemoDashboardComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
