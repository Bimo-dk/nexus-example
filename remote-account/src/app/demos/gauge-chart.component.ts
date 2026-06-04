import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';

@NexusRemote({ exposeAs: 'GaugeChart' })
@NexusComponent({
    "title": "Gauge Chart",
    "description": "Semi-circular gauge with needle",
    "category": "chart",
    "tags": [
      "gauge",
      "svg"
    ],
    "icon": "speed",
    "inputs": {
      "label": {
        "type": "string",
        "default": "Latency"
      },
      "value": {
        "type": "number",
        "default": 142,
        "required": true
      },
      "min": {
        "type": "number",
        "default": 0
      },
      "max": {
        "type": "number",
        "default": 500
      },
      "unit": {
        "type": "string",
        "default": "ms"
      }
    }
  })
@Component({
  selector: 'demo-gauge-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h4>{{ label() }}</h4>
      <svg viewBox="0 0 120 70" class="gauge">
        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#e2e8f0" stroke-width="10" stroke-linecap="round" />
        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" [attr.stroke]="color()" stroke-width="10" stroke-linecap="round"
              [attr.stroke-dasharray]="dash()" />
        <line x1="60" y1="60" [attr.x2]="needleX()" [attr.y2]="needleY()" stroke="#0f172a" stroke-width="2" stroke-linecap="round" />
        <circle cx="60" cy="60" r="4" fill="#0f172a" />
      </svg>
      <div class="value">{{ value() }} <span>{{ unit() }}</span></div>
      <div class="range">{{ min() }} — {{ max() }}</div>
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 200px; text-align: center; }
    h4 { margin: 0 0 6px; font-size: 13px; color: #475569; }
    .gauge { width: 160px; height: 90px; }
    .value { font-size: 22px; font-weight: 700; color: #0f172a; }
    .value span { font-size: 12px; color: #64748b; font-weight: 400; }
    .range { font-size: 11px; color: #94a3b8; }
  `],
})
export default class GaugeChartComponent {
  readonly label = input<string>('Latency');
  readonly value = input<number>(142);
  readonly min = input<number>(0);
  readonly max = input<number>(500);
  readonly unit = input<string>('ms');
  readonly pct = computed(() => Math.min(Math.max((this.value() - this.min()) / (this.max() - this.min()), 0), 1));
  readonly dash = computed(() => `${(this.pct() * 157).toFixed(1)} 157`);
  readonly color = computed(() => this.pct() < 0.5 ? '#10b981' : this.pct() < 0.8 ? '#f59e0b' : '#ef4444');
  readonly needleX = computed(() => 60 + 45 * Math.cos(Math.PI + Math.PI * this.pct()));
  readonly needleY = computed(() => 60 + 45 * Math.sin(Math.PI + Math.PI * this.pct()));
}
