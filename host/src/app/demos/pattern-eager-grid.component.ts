import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PATTERN_SLICES } from './demo-catalog';
import { NexusComponent } from './nexus-component.local';

/**
 * Pattern 2: Drop-in tag (eager).
 * Use <nexus-component> like any other Angular tag. No service injection, no
 * NgComponentOutlet boilerplate — the tag handles fetch/cache/loading state.
 */
@Component({
  selector: 'pattern-eager-grid',
  standalone: true,
  imports: [NexusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <header>
        <h2>Pattern 2 — Drop-in tag (eager)</h2>
        <p>Use <code>&lt;nexus-component&gt;</code> like any other Angular component.
          All 5 load on first render — no script, no boilerplate.</p>
      </header>
      <div class="grid">
        @for (s of slices; track s.expose) {
          <article>
            <h4>{{ s.title }} <small>{{ s.remote }}/{{ s.expose }}</small></h4>
            <nexus-component [remote]="s.remote" [expose]="s.expose" />
          </article>
        }
      </div>
      <pre class="code"><span class="cm">&lt;!-- the entire markup for one tile: --&gt;</span>
&lt;nexus-component remote="remoteOne" expose="MetricCard" /&gt;</pre>
    </section>
  `,
  styles: [`
    section { margin: 24px 0; }
    header h2 { margin: 0; font-size: 18px; }
    header p { margin: 4px 0 16px; font-size: 13px; color: #64748b; }
    header code { background: #f1f5f9; padding: 1px 6px; border-radius: 4px; font-size: 11px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 16px; }
    article { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
    article h4 { margin: 0 0 12px; font-size: 13px; color: #475569; display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
    article h4 small { font-family: monospace; font-size: 10px; color: #94a3b8; font-weight: 400; }
    .code { background: #0f172a; color: #e2e8f0; padding: 12px 16px; border-radius: 8px; font-size: 12px; overflow: auto; margin: 0; }
    .code .cm { color: #64748b; }
  `],
})
export class PatternEagerGridComponent {
  readonly slices = PATTERN_SLICES.eagerGrid;
}
