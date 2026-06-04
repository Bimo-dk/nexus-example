import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';

@NexusRemote({ exposeAs: 'MiniLineChart' })
@NexusComponent({
    "title": "Mini Line Chart",
    "description": "Sparkline with gradient fill",
    "category": "chart",
    "tags": [
      "chart",
      "sparkline",
      "svg"
    ],
    "icon": "show_chart",
    "inputs": {
      "label": {
        "type": "string",
        "default": "Requests / min"
      },
      "data": {
        "type": "array",
        "description": "Array of numeric data points"
      }
    }
  })
@Component({
  selector: 'demo-mini-line-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <div class="header">
        <span class="label">{{ label() }}</span>
        <strong class="last">{{ last() }}</strong>
      </div>
      <svg [attr.viewBox]="'0 0 200 60'" preserveAspectRatio="none" class="chart">
        <polyline fill="none" stroke="#10b981" stroke-width="2" [attr.points]="points()" />
        <polyline fill="url(#g)" fill-opacity="0.25" stroke="none" [attr.points]="filled()" />
        <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#10b981" stop-opacity="0"/></linearGradient></defs>
      </svg>
    </div>
  `,
  styles: [`
    .card { padding: 14px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 220px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .label { font-size: 12px; color: #64748b; }
    .last { font-size: 18px; font-weight: 700; color: #065f46; font-variant-numeric: tabular-nums; }
    .chart { width: 100%; height: 60px; }
  `],
})
export default class MiniLineChartComponent {
  readonly label = input<string>('Requests / min');
  readonly data = input<number[]>([42, 51, 38, 67, 59, 73, 81, 75, 92, 88]);
  readonly last = computed(() => this.data().at(-1) ?? 0);
  readonly points = computed(() => {
    const d = this.data();
    const max = Math.max(...d, 1);
    const stepX = 200 / Math.max(d.length - 1, 1);
    return d.map((v, i) => `${(i * stepX).toFixed(1)},${(60 - (v / max) * 55).toFixed(1)}`).join(' ');
  });
  readonly filled = computed(() => `${this.points()} 200,60 0,60`);
}
