import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PATTERN_SLICES, type DemoSpec } from './demo-catalog';
import { NexusComponent } from './nexus-component.local';

/**
 * Pattern 1: Tab navigation — the tag is mounted with whichever (remote, expose)
 * pair matches the active tab. Switching just updates two inputs; the tag
 * detects via effect() and refetches (cache hit if seen before).
 */
@Component({
  selector: 'pattern-route',
  standalone: true,
  imports: [NexusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <header>
        <h2>Pattern 1 — Tab navigation (lazy)</h2>
        <p>One tag, switched inputs. Click a tab — the tag re-fetches with the new (remote, expose) pair (cached after first load).</p>
      </header>

      <nav class="tabs">
        @for (s of slices; track s.expose) {
          <button [class.active]="active()?.expose === s.expose" (click)="active.set(s)">{{ s.title }}</button>
        }
      </nav>

      <div class="slot">
        @if (active(); as a) {
          <div class="meta"><strong>{{ a.title }}</strong> <code>{{ a.remote }}/{{ a.expose }}</code></div>
          <nexus-component [remote]="a.remote" [expose]="a.expose" />
        } @else {
          <div class="hint">Select a tab above to load a component.</div>
        }
      </div>

      <pre class="code"><span class="cm">&lt;!-- one tag, reactive to active(): --&gt;</span>
&lt;nexus-component [remote]="active().remote" [expose]="active().expose" /&gt;</pre>
    </section>
  `,
  styles: [`
    section { margin: 24px 0; }
    header h2 { margin: 0; font-size: 18px; }
    header p { margin: 4px 0 16px; font-size: 13px; color: #64748b; }
    .tabs { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
    .tabs button { background: none; border: none; padding: 8px 16px; font-size: 13px; cursor: pointer; color: #64748b; border-bottom: 2px solid transparent; margin-bottom: -1px; }
    .tabs button:hover { color: #0f172a; }
    .tabs button.active { color: #6366f1; border-bottom-color: #6366f1; font-weight: 600; }
    .slot { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; min-height: 160px; margin-bottom: 16px; }
    .meta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; font-size: 13px; color: #475569; }
    .meta code { font-family: monospace; font-size: 11px; color: #94a3b8; }
    .hint { padding: 24px; text-align: center; color: #94a3b8; font-size: 13px; }
    .code { background: #0f172a; color: #e2e8f0; padding: 12px 16px; border-radius: 8px; font-size: 12px; overflow: auto; margin: 0; }
    .code .cm { color: #64748b; }
  `],
})
export class PatternRouteComponent {
  readonly slices = PATTERN_SLICES.route;
  readonly active = signal<DemoSpec | null>(null);
}
