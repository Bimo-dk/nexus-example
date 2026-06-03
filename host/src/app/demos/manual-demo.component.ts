import { ChangeDetectionStrategy, Component, Type, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ComponentLoaderService } from './component-loader.local';
import { CatalogService, type CatalogEntry } from './catalog.local.service';

/**
 * Pattern 2: Programmatic loading.
 *
 * One page, one slot. User picks a component from the catalog and clicks Load;
 * we inject ComponentLoaderService and resolve a Type<unknown>, then render via
 * NgComponentOutlet.
 *
 * Use this pattern when the choice is dynamic (user-driven, feature-flag-driven,
 * config-driven) and a static route would be wrong.
 */
@Component({
  selector: 'app-manual-demo',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <header>
        <h1>Pattern 2 — Programmatic</h1>
        <p>Inject <code>ComponentLoaderService</code> and call <code>loadComponent(remote, expose)</code> on demand.</p>
        <pre class="snippet">private loader = inject(ComponentLoaderService);

async load(remote: string, expose: string) &#123;
  this.component.set(await this.loader.loadComponent(remote, expose));
&#125;</pre>
      </header>

      <div class="picker">
        <label>Component:
          <select [value]="selectedKey()" (change)="onPick($any($event.target).value)">
            <option value="">— choose —</option>
            @for (e of catalog.entries(); track e.remote + ':' + e.expose) {
              <option [value]="e.remote + ':' + e.expose">{{ e.title }} ({{ e.remote }})</option>
            }
          </select>
        </label>
        <button [disabled]="!selectedKey() || state() === 'loading'" (click)="load()">
          {{ state() === 'loading' ? 'Loading...' : 'Load' }}
        </button>
        @if (component()) {
          <button class="reset" (click)="reset()">Unload</button>
        }
      </div>

      <div class="slot">
        @if (component(); as cmp) {
          <ng-container *ngComponentOutlet="cmp" />
        } @else if (state() === 'error') {
          <div class="err">{{ error() }}</div>
        } @else {
          <div class="hint">Pick a component above and click Load.</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; max-width: 1080px; margin: 0 auto; }
    header { margin-bottom: 16px; }
    header h1 { margin: 0; font-size: 22px; color: #0f172a; }
    header p { margin: 4px 0 12px; font-size: 13px; color: #64748b; }
    header code { background: #f1f5f9; padding: 1px 6px; border-radius: 4px; font-size: 12px; }
    .snippet { background: #0f172a; color: #cbd5e1; padding: 12px 16px; border-radius: 8px; font-family: monospace; font-size: 12px; overflow: auto; }
    .picker { display: flex; gap: 12px; align-items: center; padding: 16px; background: #f8fafc; border-radius: 10px; margin: 16px 0; flex-wrap: wrap; }
    .picker label { display: flex; gap: 6px; align-items: center; font-size: 13px; color: #475569; }
    .picker select { padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; min-width: 240px; }
    .picker button { background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .picker button:disabled { background: #cbd5e1; cursor: not-allowed; }
    .picker button.reset { background: #94a3b8; }
    .slot { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; min-height: 200px; }
    .hint, .err { padding: 32px; text-align: center; color: #94a3b8; font-size: 13px; }
    .err { color: #b91c1c; font-family: monospace; }
  `],
})
export class ManualDemoComponent {
  private readonly loader = inject(ComponentLoaderService);
  readonly catalog = inject(CatalogService);

  readonly selectedKey = signal<string>('');
  readonly component = signal<Type<unknown> | null>(null);
  readonly state = signal<'idle' | 'loading' | 'error'>('idle');
  readonly error = signal<string | null>(null);

  onPick(key: string): void {
    this.selectedKey.set(key);
    this.reset();
  }

  async load(): Promise<void> {
    const key = this.selectedKey();
    if (!key) return;
    const [remote, expose] = key.split(':');
    this.state.set('loading');
    this.error.set(null);
    try {
      const cmp = await this.loader.loadComponent(remote, expose);
      this.component.set(cmp);
      this.state.set('idle');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
      this.state.set('error');
    }
  }

  reset(): void {
    this.component.set(null);
    this.state.set('idle');
    this.error.set(null);
  }
}
