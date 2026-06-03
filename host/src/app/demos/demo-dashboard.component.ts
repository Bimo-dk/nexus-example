import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PatternRouteComponent } from './pattern-route.component';
import { PatternEagerGridComponent } from './pattern-eager-grid.component';
import { PatternOnDemandComponent } from './pattern-on-demand.component';
import { PatternDialogComponent } from './pattern-dialog.component';

@Component({
  selector: 'app-demo-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PatternRouteComponent, PatternEagerGridComponent, PatternOnDemandComponent, PatternDialogComponent],
  template: `
    <div class="page">
      <header class="intro">
        <h1>20 federated components — 4 loading patterns</h1>
        <p>
          remote-one exposes 10 data-display components, remote-two exposes 10 interactive components.
          The host below renders all 20, grouped by a different loading strategy each.
        </p>
      </header>

      <pattern-route />
      <pattern-eager-grid />
      <pattern-on-demand />
      <pattern-dialog />
    </div>
  `,
  styles: [`
    .page { padding: 24px; max-width: 1280px; margin: 0 auto; }
    .intro { margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #e2e8f0; }
    .intro h1 { margin: 0; font-size: 22px; color: #0f172a; }
    .intro p { margin: 6px 0 0; font-size: 14px; color: #64748b; max-width: 720px; }
  `],
})
export class DemoDashboardComponent {}
