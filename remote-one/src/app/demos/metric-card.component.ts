import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NexusRemote } from '../nexus-remote.local';

@NexusRemote({ exposeAs: 'MetricCard' })
@Component({
  selector: 'demo-metric-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <div class="label">{{ label() }}</div>
      <div class="value">{{ value() }}</div>
      <div class="trend" [class.up]="trend() > 0" [class.down]="trend() < 0">
        {{ trend() > 0 ? '▲' : '▼' }} {{ trendPct() }}%
      </div>
    </div>
  `,
  styles: [`
    .card { padding: 16px 20px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border-radius: 12px; min-width: 180px; box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; opacity: 0.85; }
    .value { font-size: 32px; font-weight: 700; margin: 4px 0; font-variant-numeric: tabular-nums; }
    .trend { font-size: 13px; font-weight: 600; opacity: 0.9; }
    .trend.up { color: #86efac; }
    .trend.down { color: #fca5a5; }
  `],
})
export default class MetricCardComponent {
  readonly label = input<string>('Active users');
  readonly value = input<string>('12,438');
  readonly trend = input<number>(8.2);
  readonly trendPct = input<number>(8.2);
}
