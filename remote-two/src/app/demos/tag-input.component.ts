import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NexusRemote } from '@bimo-dk/nexus-build';

@NexusRemote({ exposeAs: 'TagInput' })
@Component({
  selector: 'demo-tag-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <label>{{ label() }}</label>
      <div class="box">
        @for (t of tags(); track t) {
          <span class="tag">{{ t }}<button (click)="remove(t)" aria-label="remove">×</button></span>
        }
        <input type="text" [value]="draft()" (input)="draft.set($any($event.target).value)" (keydown.enter)="add()"
          (keydown.backspace)="onBackspace()" placeholder="add..." />
      </div>
      <div class="hint">{{ tags().length }} tags · enter to add, backspace to remove last</div>
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 280px; }
    label { display: block; font-size: 12px; color: #475569; margin-bottom: 6px; }
    .box { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; min-height: 36px; align-items: center; }
    .tag { background: #6366f1; color: white; padding: 4px 10px; border-radius: 999px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; }
    .tag button { background: none; border: none; color: white; font-size: 16px; line-height: 1; cursor: pointer; opacity: 0.8; padding: 0; }
    input { flex: 1; min-width: 80px; border: none; outline: none; font-size: 13px; padding: 4px; }
    .hint { font-size: 11px; color: #94a3b8; margin-top: 6px; }
  `],
})
export default class TagInputComponent {
  readonly label = input<string>('Tags');
  readonly initial = input<string[]>(['angular', 'micro-frontend', 'federation']);
  readonly tags = signal<string[]>([]);
  readonly draft = signal('');
  constructor() { this.tags.set([...this.initial()]); }
  add(): void {
    const v = this.draft().trim();
    if (!v || this.tags().includes(v)) return;
    this.tags.update((t) => [...t, v]);
    this.draft.set('');
  }
  remove(t: string): void { this.tags.update((arr) => arr.filter((x) => x !== t)); }
  onBackspace(): void {
    if (this.draft().length === 0) this.tags.update((t) => t.slice(0, -1));
  }
}
