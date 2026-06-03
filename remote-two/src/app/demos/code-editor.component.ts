import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NexusRemote } from '../nexus-remote.local';

@NexusRemote({ exposeAs: 'CodeEditor' })
@Component({
  selector: 'demo-code-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <div class="head">
        <label>{{ filename() }}</label>
        <div class="stats">{{ lines() }} lines · {{ chars() }} chars</div>
      </div>
      <textarea spellcheck="false" [value]="code()" (input)="code.set($any($event.target).value)"></textarea>
      <div class="actions">
        <button (click)="format()">Format</button>
        <button (click)="clear()">Clear</button>
        <span class="status">● saved</span>
      </div>
    </div>
  `,
  styles: [`
    .card { padding: 12px; background: #0f172a; color: #e2e8f0; border-radius: 10px; min-width: 360px; font-family: 'SF Mono', Menlo, monospace; }
    .head { display: flex; justify-content: space-between; align-items: center; padding: 4px 6px 10px; }
    label { font-size: 12px; color: #94a3b8; }
    .stats { font-size: 11px; color: #64748b; }
    textarea { width: 100%; min-height: 140px; background: #1e293b; color: #e2e8f0; border: none; border-radius: 6px; padding: 10px; font-family: inherit; font-size: 13px; resize: vertical; outline: none; box-sizing: border-box; }
    .actions { display: flex; gap: 8px; padding-top: 8px; align-items: center; }
    button { background: #334155; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; }
    button:hover { background: #475569; }
    .status { margin-left: auto; font-size: 11px; color: #22c55e; }
  `],
})
export default class CodeEditorComponent {
  readonly filename = input<string>('example.ts');
  readonly initial = input<string>(`function greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet('Nexus'));`);
  readonly code = signal('');
  readonly lines = computed(() => this.code().split('\n').length);
  readonly chars = computed(() => this.code().length);
  constructor() { this.code.set(this.initial()); }
  format(): void {
    const formatted = this.code().split('\n').map((l) => l.trimEnd()).join('\n');
    this.code.set(formatted);
  }
  clear(): void { this.code.set(''); }
}
