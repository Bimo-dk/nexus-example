import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';

interface Event { time: string; title: string; description: string; tone?: 'ok' | 'warn' | 'err'; }

@NexusRemote({ exposeAs: 'EventTimeline' })
@NexusComponent({
    "title": "Event Timeline",
    "description": "Vertical timeline of events with status dots",
    "category": "data-display",
    "tags": [
      "timeline",
      "events"
    ],
    "icon": "timeline",
    "inputs": {
      "title": {
        "type": "string",
        "default": "Deployment timeline"
      },
      "events": {
        "type": "array",
        "description": "Array of { time, title, description, tone? }"
      }
    }
  })
@Component({
  selector: 'demo-event-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h4>{{ title() }}</h4>
      <ol class="timeline">
        @for (e of events(); track e.time) {
          <li>
            <div class="dot" [class]="e.tone ?? 'ok'"></div>
            <div class="line"></div>
            <div class="content">
              <div class="time">{{ e.time }}</div>
              <div class="title">{{ e.title }}</div>
              <div class="desc">{{ e.description }}</div>
            </div>
          </li>
        }
      </ol>
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 300px; }
    h4 { margin: 0 0 12px; font-size: 13px; color: #475569; }
    .timeline { list-style: none; padding: 0; margin: 0; position: relative; }
    .timeline li { display: grid; grid-template-columns: 20px 1fr; gap: 8px; padding: 8px 0; position: relative; }
    .dot { width: 12px; height: 12px; border-radius: 999px; background: #10b981; margin-top: 4px; z-index: 1; }
    .dot.warn { background: #f59e0b; }
    .dot.err { background: #ef4444; }
    .line { position: absolute; left: 5px; top: 16px; bottom: -8px; width: 2px; background: #e2e8f0; }
    .timeline li:last-child .line { display: none; }
    .time { font-size: 11px; color: #94a3b8; }
    .title { font-size: 13px; font-weight: 600; color: #0f172a; }
    .desc { font-size: 12px; color: #64748b; }
  `],
})
export default class EventTimelineComponent {
  readonly title = input<string>('Deployment timeline');
  readonly events = input<Event[]>([
    { time: '14:32', title: 'Build started',  description: 'commit a8f3c1', tone: 'ok' },
    { time: '14:35', title: 'Tests passed',   description: '142 tests, 0 failures', tone: 'ok' },
    { time: '14:37', title: 'Deploy started', description: 'rollout to production', tone: 'ok' },
    { time: '14:39', title: 'Health degraded', description: 'p95 latency spike', tone: 'warn' },
    { time: '14:41', title: 'Stabilized',     description: 'rollout complete', tone: 'ok' },
  ]);
}
