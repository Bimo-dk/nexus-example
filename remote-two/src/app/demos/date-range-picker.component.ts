import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NexusRemote } from '@bimo-dk/nexus-build';

@NexusRemote({ exposeAs: 'DateRangePicker' })
@Component({
  selector: 'demo-date-range-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <label>{{ label() }}</label>
      <div class="row">
        <input type="date" [value]="from()" (change)="from.set($any($event.target).value)" />
        <span>→</span>
        <input type="date" [value]="to()" (change)="to.set($any($event.target).value)" />
      </div>
      <div class="presets">
        <button (click)="preset(7)">Last 7 days</button>
        <button (click)="preset(30)">Last 30 days</button>
        <button (click)="preset(90)">Last quarter</button>
      </div>
      <div class="info">Range: <strong>{{ days() }}</strong> days</div>
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 300px; }
    label { display: block; font-size: 12px; color: #475569; margin-bottom: 8px; }
    .row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
    .row span { color: #94a3b8; }
    input { padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; }
    .presets { display: flex; gap: 6px; margin-bottom: 10px; }
    .presets button { background: #f1f5f9; border: none; padding: 6px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; color: #475569; }
    .presets button:hover { background: #e2e8f0; }
    .info { font-size: 12px; color: #475569; }
  `],
})
export default class DateRangePickerComponent {
  readonly label = input<string>('Date range');
  readonly from = signal<string>(new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10));
  readonly to = signal<string>(new Date().toISOString().slice(0, 10));
  readonly days = computed(() => {
    const f = new Date(this.from()).getTime();
    const t = new Date(this.to()).getTime();
    return Math.max(0, Math.round((t - f) / 86400000));
  });
  preset(d: number): void {
    this.from.set(new Date(Date.now() - d * 86400000).toISOString().slice(0, 10));
    this.to.set(new Date().toISOString().slice(0, 10));
  }
}
