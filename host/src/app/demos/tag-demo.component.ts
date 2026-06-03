import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CatalogService, type CatalogEntry } from './catalog.local.service';
import { NexusComponent } from './nexus-component.local';

/**
 * Pattern 3: Drop-in tag.
 *
 * The host's template just uses <nexus-component remote="..." expose="..." />.
 * No service injection, no Promises, no NgComponentOutlet plumbing. The tag
 * itself handles fetch/cache/loading/error.
 *
 * Optionally filter the catalog by category so you can show "only data-display"
 * components etc.
 */
@Component({
  selector: 'app-tag-demo',
  standalone: true,
  imports: [NexusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <header>
        <h1>Pattern 3 — Drop-in tag</h1>
        <p>Just use <code>&lt;nexus-component&gt;</code> like any other Angular tag.</p>
        <pre class="snippet">&lt;nexus-component
  [remote]="e.remote"
  [expose]="e.expose"
  [inputs]="&#123; label: 'Custom' &#125;" /&gt;</pre>
      </header>

      <div class="filters">
        <label>Category:
          <select [value]="selectedCategory()" (change)="selectedCategory.set($any($event.target).value)">
            <option value="">All</option>
            @for (c of catalog.categories(); track c) { <option [value]="c">{{ c }}</option> }
          </select>
        </label>
        <span class="count">{{ filtered().length }} component(s)</span>
      </div>

      <div class="grid">
        @for (e of filtered(); track e.remote + ':' + e.expose) {
          <article>
            <header>
              <h4>{{ e.title }}</h4>
              <code>{{ e.remote }}/{{ e.expose }}</code>
            </header>
            <nexus-component [remote]="e.remote" [expose]="e.expose" />
          </article>
        } @empty {
          <p class="empty">No components match the filter.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; max-width: 1280px; margin: 0 auto; }
    header h1 { margin: 0; font-size: 22px; color: #0f172a; }
    header p { margin: 4px 0 12px; font-size: 13px; color: #64748b; }
    header code { background: #f1f5f9; padding: 1px 6px; border-radius: 4px; font-size: 12px; }
    .snippet { background: #0f172a; color: #cbd5e1; padding: 12px 16px; border-radius: 8px; font-family: monospace; font-size: 12px; overflow: auto; }
    .filters { display: flex; gap: 16px; align-items: center; padding: 12px 16px; background: #f8fafc; border-radius: 10px; margin: 16px 0; }
    .filters label { display: flex; gap: 6px; align-items: center; font-size: 13px; color: #475569; }
    .filters select { padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; }
    .filters .count { font-size: 12px; color: #94a3b8; margin-left: auto; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    article { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
    article header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; gap: 8px; }
    article h4 { margin: 0; font-size: 13px; color: #475569; }
    article code { font-family: monospace; font-size: 10px; color: #94a3b8; }
    .empty { padding: 32px; text-align: center; color: #94a3b8; font-size: 13px; }
  `],
})
export class TagDemoComponent {
  readonly catalog = inject(CatalogService);
  readonly selectedCategory = signal<string>('');

  readonly filtered = computed<CatalogEntry[]>(() => {
    return this.catalog.filter({ category: this.selectedCategory() || undefined });
  });
}
