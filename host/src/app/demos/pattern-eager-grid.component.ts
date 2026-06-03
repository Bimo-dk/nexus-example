import { ChangeDetectionStrategy, Component, OnInit, Type, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ComponentLoaderService } from '@bimo-dk/nexus-runtime';
import { PATTERN_SLICES, type DemoSpec } from './demo-catalog';

interface LoadedTile { spec: DemoSpec; component: Type<unknown> | null; error: string | null; }

/**
 * Pattern 2: Eager NgComponentOutlet grid.
 * All 5 components are loaded in parallel at init via Promise.all, then rendered.
 */
@Component({
  selector: 'pattern-eager-grid',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <header>
        <h2>Pattern 2 — Eager grid (NgComponentOutlet)</h2>
        <p>All 5 components loaded in parallel at init, rendered via <code>*ngComponentOutlet</code>.</p>
      </header>
      <div class="grid">
        @for (t of tiles(); track t.spec.expose) {
          <article>
            <h4>{{ t.spec.title }} <small>{{ t.spec.remote }}/{{ t.spec.expose }}</small></h4>
            @if (t.component) {
              <ng-container *ngComponentOutlet="t.component" />
            } @else if (t.error) {
              <div class="err">{{ t.error }}</div>
            } @else {
              <div class="loading">Loading...</div>
            }
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    section { margin: 24px 0; }
    header h2 { margin: 0; font-size: 18px; }
    header p { margin: 4px 0 16px; font-size: 13px; color: #64748b; }
    header code { background: #f1f5f9; padding: 1px 6px; border-radius: 4px; font-size: 11px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    article { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
    article h4 { margin: 0 0 12px; font-size: 13px; color: #475569; display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
    article h4 small { font-family: monospace; font-size: 10px; color: #94a3b8; font-weight: 400; }
    .loading, .err { padding: 24px; text-align: center; color: #94a3b8; font-size: 13px; }
    .err { color: #ef4444; }
  `],
})
export class PatternEagerGridComponent implements OnInit {
  private readonly loader = inject(ComponentLoaderService);
  readonly tiles = signal<LoadedTile[]>(PATTERN_SLICES.eagerGrid.map((spec) => ({ spec, component: null, error: null })));

  async ngOnInit(): Promise<void> {
    const updates = await Promise.all(
      PATTERN_SLICES.eagerGrid.map(async (spec): Promise<LoadedTile> => {
        try {
          const component = await this.loader.loadComponent(spec.remote, spec.expose);
          return { spec, component, error: null };
        } catch (err) {
          return { spec, component: null, error: err instanceof Error ? err.message : String(err) };
        }
      }),
    );
    this.tiles.set(updates);
  }
}
