import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { PATTERN_SLICES, type DemoSpec } from './demo-catalog';
import { DemoDialogComponent } from './demo-dialog.component';

/**
 * Pattern 4: Modal dialog.
 * Components are loaded only when the user opens a dialog, rendered inside
 * the modal via the same NgComponentOutlet trick. Closes free the slot.
 */
@Component({
  selector: 'pattern-dialog',
  standalone: true,
  imports: [DemoDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <header>
        <h2>Pattern 4 — Modal dialog</h2>
        <p>Click any card to open a modal that loads the component on demand and renders it inside.</p>
      </header>
      <div class="grid">
        @for (s of slices; track s.expose) {
          <button class="tile" (click)="open(s)">
            <h4>{{ s.title }}</h4>
            <p>{{ s.description }}</p>
            <code>{{ s.remote }}/{{ s.expose }}</code>
          </button>
        }
      </div>
      <demo-dialog #dialog />
    </section>
  `,
  styles: [`
    section { margin: 24px 0; }
    header h2 { margin: 0; font-size: 18px; }
    header p { margin: 4px 0 16px; font-size: 13px; color: #64748b; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
    .tile { text-align: left; background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; cursor: pointer; transition: border-color 0.15s, transform 0.15s; }
    .tile:hover { border-color: #6366f1; transform: translateY(-2px); }
    .tile h4 { margin: 0 0 6px; font-size: 14px; color: #0f172a; }
    .tile p { margin: 0 0 10px; font-size: 12px; color: #64748b; }
    .tile code { font-family: monospace; font-size: 11px; color: #6366f1; background: #eef2ff; padding: 2px 6px; border-radius: 4px; }
  `],
})
export class PatternDialogComponent {
  readonly slices = PATTERN_SLICES.dialog;
  @ViewChild('dialog') dialog!: DemoDialogComponent;

  open(spec: DemoSpec): void {
    this.dialog.show(spec);
  }
}
