import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PATTERN_SLICES, type DemoSpec } from './demo-catalog';
import { NexusComponent } from './nexus-component.local';

/**
 * Pattern 3: On-demand using @if + <nexus-component>.
 * Same drop-in tag — Angular's @if controls whether it's even mounted.
 * Clicking "Load" flips a signal, which makes the tag appear and fetch.
 */
@Component({
  selector: 'pattern-on-demand',
  standalone: true,
  imports: [NexusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <header>
        <h2>Pattern 3 — On-demand (&#64;if + tag)</h2>
        <p>Toggle a signal to mount the tag. The network fetch only happens when the tag exists in the DOM.</p>
      </header>
      <div class="grid">
        @for (s of slices; track s.expose) {
          <article>
            <h4>{{ s.title }} <small>{{ s.remote }}/{{ s.expose }}</small></h4>
            <p class="desc">{{ s.description }}</p>
            @if (active().has(s.expose)) {
              <nexus-component [remote]="s.remote" [expose]="s.expose" />
              <button class="reset" (click)="toggle(s)">Unmount</button>
            } @else {
              <button (click)="toggle(s)">Load</button>
            }
          </article>
        }
      </div>
      <pre class="code"><span class="cm">&lt;!-- the slot logic: --&gt;</span>
&#64;if (active().has(s.expose)) &#123;
  &lt;nexus-component [remote]="s.remote" [expose]="s.expose" /&gt;
&#125;</pre>
    </section>
  `,
  styles: [`
    section { margin: 24px 0; }
    header h2 { margin: 0; font-size: 18px; }
    header p { margin: 4px 0 16px; font-size: 13px; color: #64748b; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 16px; }
    article { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
    article h4 { margin: 0; font-size: 13px; color: #475569; display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
    article h4 small { font-family: monospace; font-size: 10px; color: #94a3b8; font-weight: 400; }
    .desc { margin: 0; font-size: 12px; color: #64748b; }
    button { background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; align-self: flex-start; }
    button:hover { background: #4f46e5; }
    button.reset { background: #94a3b8; }
    .code { background: #0f172a; color: #e2e8f0; padding: 12px 16px; border-radius: 8px; font-size: 12px; overflow: auto; margin: 0; }
    .code .cm { color: #64748b; }
  `],
})
export class PatternOnDemandComponent {
  readonly slices = PATTERN_SLICES.onDemand;
  readonly active = signal<Set<string>>(new Set());

  toggle(spec: DemoSpec): void {
    const next = new Set(this.active());
    if (next.has(spec.expose)) next.delete(spec.expose);
    else next.add(spec.expose);
    this.active.set(next);
  }
}
