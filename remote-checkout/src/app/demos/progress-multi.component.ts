import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';

interface Bar { label: string; value: number; color: string; }

@NexusRemote({ exposeAs: 'ProgressMulti' })
@NexusComponent({
    "title": "Multi Progress",
    "description": "Multiple labelled progress bars",
    "category": "data-display",
    "tags": [
      "progress",
      "bar"
    ],
    "icon": "leaderboard",
    "inputs": {
      "title": {
        "type": "string",
        "default": "System resources"
      },
      "bars": {
        "type": "array",
        "description": "Array of { label, value, color }"
      }
    }
  })
@Component({
  selector: 'demo-progress-multi',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h4>{{ title() }}</h4>
      @for (b of bars(); track b.label) {
        <div class="row">
          <div class="head"><span>{{ b.label }}</span><strong>{{ b.value }}%</strong></div>
          <div class="track"><div class="fill" [style.width.%]="b.value" [style.background]="b.color"></div></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 260px; }
    h4 { margin: 0 0 12px; font-size: 13px; color: #475569; }
    .row { margin-bottom: 10px; }
    .head { display: flex; justify-content: space-between; font-size: 12px; color: #475569; margin-bottom: 4px; }
    .track { height: 6px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
    .fill { height: 100%; transition: width 0.4s ease; }
  `],
})
export default class ProgressMultiComponent {
  readonly title = input<string>('System resources');
  readonly bars = input<Bar[]>([
    { label: 'CPU',    value: 62, color: '#6366f1' },
    { label: 'Memory', value: 78, color: '#10b981' },
    { label: 'Disk',   value: 34, color: '#f59e0b' },
    { label: 'Net',    value: 91, color: '#ef4444' },
  ]);
}
