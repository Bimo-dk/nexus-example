import { ChangeDetectionStrategy, Component, Type, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ComponentLoaderService } from '@bimo-dk/nexus-runtime';
import type { DemoSpec } from './demo-catalog';

/**
 * A modal-style dialog (no MatDialog dependency to keep host bundle small).
 * Loads the demo component on demand when opened, renders via NgComponentOutlet.
 */
@Component({
  selector: 'demo-dialog',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open() && spec()) {
      <div class="backdrop" (click)="close()">
        <div class="modal" (click)="$event.stopPropagation()">
          <header>
            <div>
              <h3>{{ spec()!.title }}</h3>
              <p>{{ spec()!.description }} — loaded into a modal via NgComponentOutlet</p>
            </div>
            <button class="x" (click)="close()" aria-label="close">×</button>
          </header>
          <div class="body">
            @if (loadedComponent(); as cmp) {
              <ng-container *ngComponentOutlet="cmp" />
            } @else if (error()) {
              <div class="err">Failed to load: {{ error() }}</div>
            } @else {
              <div class="loading">Loading...</div>
            }
          </div>
          <footer>
            <code>{{ spec()!.remote }} / ./{{ spec()!.expose }}</code>
          </footer>
        </div>
      </div>
    }
  `,
  styles: [`
    .backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
    .modal { background: #f8fafc; border-radius: 14px; max-width: 560px; width: 100%; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
    header { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px 24px 12px; gap: 12px; }
    header h3 { margin: 0; font-size: 18px; }
    header p { margin: 4px 0 0; font-size: 12px; color: #64748b; }
    .x { background: none; border: none; font-size: 28px; line-height: 1; cursor: pointer; color: #94a3b8; }
    .x:hover { color: #0f172a; }
    .body { padding: 12px 24px 24px; overflow: auto; flex: 1; }
    .loading, .err { padding: 24px; text-align: center; color: #94a3b8; }
    .err { color: #ef4444; }
    footer { padding: 12px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
    footer code { font-family: monospace; }
  `],
})
export class DemoDialogComponent {
  private readonly loader = inject(ComponentLoaderService);

  readonly open = signal(false);
  readonly spec = signal<DemoSpec | null>(null);
  readonly loadedComponent = signal<Type<unknown> | null>(null);
  readonly error = signal<string | null>(null);

  async show(spec: DemoSpec): Promise<void> {
    this.spec.set(spec);
    this.loadedComponent.set(null);
    this.error.set(null);
    this.open.set(true);
    try {
      const cmp = await this.loader.loadComponent(spec.remote, spec.expose);
      this.loadedComponent.set(cmp);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    }
  }

  close(): void {
    this.open.set(false);
  }
}
