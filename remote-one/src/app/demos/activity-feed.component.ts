import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NexusRemote } from '@bimo-dk/nexus-build';

interface Activity { icon: string; text: string; time: string; tone?: 'ok' | 'warn' | 'err'; }

@NexusRemote({ exposeAs: 'ActivityFeed' })
@Component({
  selector: 'demo-activity-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h4>{{ title() }}</h4>
      <ul>
        @for (a of items(); track a.text) {
          <li [class]="a.tone ?? 'ok'">
            <span class="icon">{{ a.icon }}</span>
            <div><div class="text">{{ a.text }}</div><div class="time">{{ a.time }}</div></div>
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 280px; }
    h4 { margin: 0 0 10px; font-size: 13px; color: #475569; }
    ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
    li { display: flex; gap: 10px; padding: 8px; border-radius: 6px; background: #f8fafc; font-size: 13px; }
    li.warn { background: #fef3c7; }
    li.err { background: #fee2e2; }
    .icon { font-size: 18px; }
    .text { color: #0f172a; }
    .time { font-size: 11px; color: #64748b; margin-top: 2px; }
  `],
})
export default class ActivityFeedComponent {
  readonly title = input<string>('Recent activity');
  readonly items = input<Activity[]>([
    { icon: '✅', text: 'Deploy succeeded for remote-one', time: '2 min ago' },
    { icon: '🔄', text: 'Registry sync completed', time: '5 min ago' },
    { icon: '⚠️', text: 'High latency on remote-two', time: '12 min ago', tone: 'warn' },
    { icon: '❌', text: 'Health check failed', time: '1 hour ago', tone: 'err' },
  ]);
}
