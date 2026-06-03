import { ChangeDetectionStrategy, Component, Type, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ComponentLoaderService } from './component-loader.local';
import { PATTERN_SLICES, type DemoSpec } from './demo-catalog';

/**
 * Pattern 1: Route-based — navigate between components.
 * Each demo gets its own slug. Click a tab to switch — only the active
 * component is loaded (lazy). Switching reuses the cache.
 */
@Component({
  selector: 'pattern-route',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <header>
        <h2>Pattern 1 — Route / tab navigation (lazy)</h2>
        <p>Click a tab to load that component. Only the active one is fetched; the loader caches across switches.</p>
      </header>

      <nav class="tabs">
        @for (s of slices; track s.expose) {
          <button [class.active]="active()?.expose === s.expose" (click)="select(s)">{{ s.title }}</button>
        }
      </nav>

      <div class="slot">
        @if (active(); as a) {
          <div class="meta"><strong>{{ a.title }}</strong> <code>{{ a.remote }}/{{ a.expose }}</code></div>
          @if (loaded(); as cmp) {
            <ng-container *ngComponentOutlet="cmp" />
          } @else if (error()) {
            <div class="err">{{ error() }}</div>
          } @else {
            <div class="loading">Loading {{ a.title }}...</div>
          }
        } @else {
          <div class="hint">Select a tab above to load a component.</div>
        }
      </div>
    </section>
  `,
  styles: [`
    section { margin: 24px 0; }
    header h2 { margin: 0; font-size: 18px; }
    header p { margin: 4px 0 16px; font-size: 13px; color: #64748b; }
    .tabs { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 0; }
    .tabs button { background: none; border: none; padding: 8px 16px; font-size: 13px; cursor: pointer; color: #64748b; border-bottom: 2px solid transparent; margin-bottom: -1px; }
    .tabs button:hover { color: #0f172a; }
    .tabs button.active { color: #6366f1; border-bottom-color: #6366f1; font-weight: 600; }
    .slot { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; min-height: 180px; }
    .meta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; font-size: 13px; color: #475569; }
    .meta code { font-family: monospace; font-size: 11px; color: #94a3b8; }
    .loading, .err, .hint { padding: 24px; text-align: center; color: #94a3b8; font-size: 13px; }
    .err { color: #ef4444; }
  `],
})
export class PatternRouteComponent {
  private readonly loader = inject(ComponentLoaderService);
  readonly slices = PATTERN_SLICES.route;
  readonly active = signal<DemoSpec | null>(null);
  readonly loaded = signal<Type<unknown> | null>(null);
  readonly error = signal<string | null>(null);

  async select(spec: DemoSpec): Promise<void> {
    this.active.set(spec);
    this.loaded.set(null);
    this.error.set(null);
    try {
      const cmp = await this.loader.loadComponent(spec.remote, spec.expose);
      // Make sure we're still on this tab (user might have clicked again)
      if (this.active()?.expose === spec.expose) {
        this.loaded.set(cmp);
      }
    } catch (err) {
      if (this.active()?.expose === spec.expose) {
        this.error.set(err instanceof Error ? err.message : String(err));
      }
    }
  }
}
