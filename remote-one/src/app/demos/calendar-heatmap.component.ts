import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NexusRemote } from '../nexus-remote.local';

@NexusRemote({ exposeAs: 'CalendarHeatmap' })
@Component({
  selector: 'demo-calendar-heatmap',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h4>{{ title() }}</h4>
      <div class="grid">
        @for (cell of cells(); track $index) {
          <span class="cell" [style.background]="color(cell)" [attr.title]="cell + ' contributions'"></span>
        }
      </div>
      <div class="legend"><span>Less</span><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span><span>More</span></div>
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 280px; }
    h4 { margin: 0 0 12px; font-size: 13px; color: #475569; }
    .grid { display: grid; grid-template-columns: repeat(14, 1fr); gap: 3px; }
    .cell { aspect-ratio: 1; border-radius: 2px; transition: transform 0.15s; }
    .cell:hover { transform: scale(1.4); }
    .legend { display: flex; align-items: center; gap: 4px; margin-top: 10px; font-size: 11px; color: #64748b; }
    .legend span:not([class]) { padding: 0 4px; }
    .l1, .l2, .l3, .l4 { width: 10px; height: 10px; border-radius: 2px; }
    .l1 { background: #dcfce7; } .l2 { background: #86efac; } .l3 { background: #22c55e; } .l4 { background: #15803d; }
  `],
})
export default class CalendarHeatmapComponent {
  readonly title = input<string>('Last 70 days');
  readonly seed = input<number>(7);
  readonly cells = computed(() => Array.from({ length: 70 }, (_, i) => (i * this.seed()) % 5));
  color(v: number): string {
    const palette = ['#f1f5f9', '#dcfce7', '#86efac', '#22c55e', '#15803d'];
    return palette[Math.min(Math.max(v, 0), 4)];
  }
}
