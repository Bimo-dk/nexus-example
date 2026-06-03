import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NexusRemote } from '@bimo-dk/nexus-build';

interface Segment { label: string; value: number; color: string; }

@NexusRemote({ exposeAs: 'DonutChart' })
@Component({
  selector: 'demo-donut-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h4>{{ title() }}</h4>
      <div class="layout">
        <svg viewBox="0 0 42 42" class="donut">
          @for (s of arcs(); track s.label) {
            <circle cx="21" cy="21" r="15.915" fill="transparent" [attr.stroke]="s.color" stroke-width="6"
              [attr.stroke-dasharray]="s.dash" [attr.stroke-dashoffset]="s.offset" transform="rotate(-90 21 21)" />
          }
        </svg>
        <ul class="legend">
          @for (s of segments(); track s.label) {
            <li><span class="swatch" [style.background]="s.color"></span>{{ s.label }} <strong>{{ s.value }}%</strong></li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 280px; }
    h4 { margin: 0 0 12px; font-size: 13px; color: #475569; }
    .layout { display: flex; align-items: center; gap: 16px; }
    .donut { width: 100px; height: 100px; }
    .legend { list-style: none; padding: 0; margin: 0; font-size: 12px; }
    .legend li { display: flex; align-items: center; gap: 6px; padding: 2px 0; }
    .legend strong { margin-left: auto; }
    .swatch { width: 10px; height: 10px; border-radius: 2px; }
  `],
})
export default class DonutChartComponent {
  readonly title = input<string>('Traffic source');
  readonly segments = input<Segment[]>([
    { label: 'Direct', value: 45, color: '#6366f1' },
    { label: 'Search', value: 30, color: '#10b981' },
    { label: 'Social', value: 15, color: '#f59e0b' },
    { label: 'Email',  value: 10, color: '#ef4444' },
  ]);
  readonly arcs = computed(() => {
    let acc = 0;
    return this.segments().map((s) => {
      const dash = `${s.value} ${100 - s.value}`;
      const offset = (100 - acc) % 100;
      acc += s.value;
      return { ...s, dash, offset };
    });
  });
}
