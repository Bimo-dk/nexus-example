import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { DemoSpec } from './demo-catalog';
import { NexusComponent } from './nexus-component.local';

/**
 * Modal dialog hosting a federated component via <nexus-component>.
 * The dialog itself owns no loading logic — it just toggles a signal and
 * lets the tag handle everything.
 */
@Component({
  selector: 'demo-dialog',
  standalone: true,
  imports: [NexusComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open() && spec(); as s) {
      <div class="backdrop" (click)="close()">
        <div class="modal" (click)="$event.stopPropagation()">
          <header>
            <div>
              <h3>{{ s.title }}</h3>
              <p>{{ s.description }}</p>
            </div>
            <button class="x" (click)="close()" aria-label="close">×</button>
          </header>
          <div class="body">
            <nexus-component [remote]="s.remote" [expose]="s.expose" />
          </div>
          <footer>
            <code>&lt;nexus-component remote="{{ s.remote }}" expose="{{ s.expose }}" /&gt;</code>
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
    footer { padding: 12px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
    footer code { font-family: monospace; }
  `],
})
export class DemoDialogComponent {
  readonly open = signal(false);
  readonly spec = signal<DemoSpec | null>(null);

  show(spec: DemoSpec): void {
    this.spec.set(spec);
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
  }
}
