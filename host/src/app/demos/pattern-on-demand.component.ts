import { ChangeDetectionStrategy, Component, Type, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ComponentLoaderService } from '@bimo-dk/nexus-runtime';
import { PATTERN_SLICES, type DemoSpec } from './demo-catalog';

interface Slot { spec: DemoSpec; state: 'idle' | 'loading' | 'loaded' | 'error'; component: Type<unknown> | null; error: string | null; }

/**
 * Pattern 3: On-demand button-triggered load.
 * Each slot shows a "Load" button — the federation network call only happens
 * when the user clicks. Loaded components are cached so subsequent clicks
 * re-render instantly.
 */
@Component({
  selector: 'pattern-on-demand',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <header>
        <h2>Pattern 3 — On-demand (button-triggered)</h2>
        <p>Each component is fetched only when the user clicks <strong>Load</strong>. Network cost is paid lazily.</p>
      </header>
      <div class="grid">
        @for (s of slots(); track s.spec.expose) {
          <article>
            <h4>{{ s.spec.title }} <small>{{ s.spec.remote }}/{{ s.spec.expose }}</small></h4>
            <p class="desc">{{ s.spec.description }}</p>
            @switch (s.state) {
              @case ('idle') {
                <button (click)="load(s)">Load</button>
              }
              @case ('loading') {
                <div class="loading">Fetching from {{ s.spec.remote }}...</div>
              }
              @case ('loaded') {
                <div class="slot"><ng-container *ngComponentOutlet="s.component!" /></div>
                <button class="reset" (click)="reset(s)">Unload</button>
              }
              @case ('error') {
                <div class="err">{{ s.error }}</div>
                <button (click)="load(s)">Retry</button>
              }
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
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    article { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
    article h4 { margin: 0; font-size: 13px; color: #475569; display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
    article h4 small { font-family: monospace; font-size: 10px; color: #94a3b8; font-weight: 400; }
    .desc { margin: 0; font-size: 12px; color: #64748b; }
    button { background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; align-self: flex-start; }
    button:hover { background: #4f46e5; }
    button.reset { background: #94a3b8; align-self: flex-start; }
    .loading, .err { padding: 12px; text-align: center; font-size: 12px; color: #94a3b8; }
    .err { color: #ef4444; }
    .slot { margin-top: 8px; }
  `],
})
export class PatternOnDemandComponent {
  private readonly loader = inject(ComponentLoaderService);
  readonly slots = signal<Slot[]>(PATTERN_SLICES.onDemand.map((spec) => ({ spec, state: 'idle' as const, component: null, error: null })));

  async load(slot: Slot): Promise<void> {
    this.update(slot, { state: 'loading', error: null });
    try {
      const component = await this.loader.loadComponent(slot.spec.remote, slot.spec.expose);
      this.update(slot, { state: 'loaded', component });
    } catch (err) {
      this.update(slot, { state: 'error', error: err instanceof Error ? err.message : String(err) });
    }
  }

  reset(slot: Slot): void {
    this.update(slot, { state: 'idle', component: null, error: null });
  }

  private update(slot: Slot, patch: Partial<Slot>): void {
    this.slots.update((arr) => arr.map((s) => (s.spec.expose === slot.spec.expose ? { ...s, ...patch } : s)));
  }
}
