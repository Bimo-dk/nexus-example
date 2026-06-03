import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NexusRemote } from '../nexus-remote.local';

interface Pill { label: string; value: string; tone: 'ok' | 'warn' | 'err' | 'info'; }

@NexusRemote({ exposeAs: 'StatPills' })
@Component({
  selector: 'demo-stat-pills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h4>{{ title() }}</h4>
      <div class="pills">
        @for (p of pills(); track p.label) {
          <span class="pill" [class]="p.tone">
            <strong>{{ p.value }}</strong>
            <span class="lbl">{{ p.label }}</span>
          </span>
        }
      </div>
    </div>
  `,
  styles: [`
    .card { padding: 14px 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 280px; }
    h4 { margin: 0 0 10px; font-size: 13px; color: #475569; }
    .pills { display: flex; flex-wrap: wrap; gap: 8px; }
    .pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 12px; }
    .pill strong { font-variant-numeric: tabular-nums; }
    .pill .lbl { opacity: 0.8; }
    .ok { background: #dcfce7; color: #166534; }
    .warn { background: #fef3c7; color: #92400e; }
    .err { background: #fee2e2; color: #991b1b; }
    .info { background: #dbeafe; color: #1e40af; }
  `],
})
export default class StatPillsComponent {
  readonly title = input<string>('Cluster snapshot');
  readonly pills = input<Pill[]>([
    { label: 'uptime', value: '99.97%', tone: 'ok' },
    { label: 'reqs/s', value: '1.2K',  tone: 'info' },
    { label: 'errors', value: '3',     tone: 'warn' },
    { label: 'down',   value: '0',     tone: 'ok' },
    { label: 'p95',    value: '142ms', tone: 'info' },
  ]);
}
