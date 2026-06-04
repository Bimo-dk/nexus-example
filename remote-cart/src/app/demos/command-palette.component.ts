import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';

interface Command { id: string; label: string; shortcut?: string; icon: string; }

@NexusRemote({ exposeAs: 'CommandPalette' })
@NexusComponent({
    "title": "Command Palette",
    "description": "Fuzzy-search command launcher",
    "category": "navigation",
    "tags": [
      "command",
      "palette",
      "search"
    ],
    "icon": "keyboard_command_key",
    "inputs": {
      "label": {
        "type": "string",
        "default": "Command palette"
      },
      "commands": {
        "type": "array",
        "description": "Array of { id, label, icon, shortcut? }"
      }
    }
  })
@Component({
  selector: 'demo-command-palette',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <label>{{ label() }}</label>
      <div class="palette">
        <input class="search" type="text" placeholder="Type a command or search..." [value]="query()" (input)="query.set($any($event.target).value)" />
        <ul>
          @for (c of results(); track c.id; let i = $index) {
            <li [class.active]="i === 0" (click)="run(c)">
              <span class="icon">{{ c.icon }}</span>
              <span class="lbl">{{ c.label }}</span>
              @if (c.shortcut) { <kbd>{{ c.shortcut }}</kbd> }
            </li>
          } @empty {
            <li class="empty">No commands match</li>
          }
        </ul>
      </div>
      @if (lastRun()) { <div class="ran">Ran: <strong>{{ lastRun() }}</strong></div> }
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 320px; }
    label { display: block; font-size: 12px; color: #475569; margin-bottom: 8px; }
    .palette { background: #0f172a; border-radius: 10px; padding: 8px; }
    .search { width: 100%; background: transparent; color: white; border: none; outline: none; padding: 8px 12px; font-size: 14px; box-sizing: border-box; }
    ul { list-style: none; padding: 4px 0 0; margin: 0; max-height: 200px; overflow: auto; }
    li { display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #cbd5e1; font-size: 13px; cursor: pointer; border-radius: 6px; }
    li.active, li:hover { background: #1e293b; color: white; }
    li.empty { color: #64748b; font-style: italic; }
    .icon { font-size: 16px; }
    .lbl { flex: 1; }
    kbd { background: #334155; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-family: monospace; }
    .ran { font-size: 12px; color: #6366f1; margin-top: 8px; }
  `],
})
export default class CommandPaletteComponent {
  readonly label = input<string>('Command palette');
  readonly commands = input<Command[]>([
    { id: 'new',     label: 'New file',          icon: '📄', shortcut: 'Ctrl+N' },
    { id: 'open',    label: 'Open file...',      icon: '📂', shortcut: 'Ctrl+O' },
    { id: 'save',    label: 'Save',              icon: '💾', shortcut: 'Ctrl+S' },
    { id: 'find',    label: 'Find in files',     icon: '🔍', shortcut: 'Ctrl+Shift+F' },
    { id: 'theme',   label: 'Toggle theme',      icon: '🎨' },
    { id: 'deploy',  label: 'Deploy to prod',    icon: '🚀' },
    { id: 'restart', label: 'Restart language server', icon: '🔄' },
  ]);
  readonly query = signal('');
  readonly lastRun = signal<string | null>(null);
  readonly results = computed(() => {
    const q = this.query().toLowerCase();
    return this.commands().filter((c) => c.label.toLowerCase().includes(q));
  });
  run(c: Command): void { this.lastRun.set(c.label); }
}
