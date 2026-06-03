import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NexusRemote } from '../nexus-remote.local';

@NexusRemote({ exposeAs: 'MultiSelect' })
@Component({
  selector: 'demo-multi-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <label>{{ label() }}</label>
      <input class="filter" placeholder="filter..." [value]="query()" (input)="query.set($any($event.target).value)" />
      <ul>
        @for (o of visible(); track o) {
          <li>
            <label class="opt">
              <input type="checkbox" [checked]="selected().has(o)" (change)="toggle(o)" />
              <span>{{ o }}</span>
            </label>
          </li>
        }
      </ul>
      <div class="info">{{ selected().size }} of {{ options().length }} selected</div>
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 240px; }
    label { display: block; font-size: 12px; color: #475569; margin-bottom: 6px; }
    .filter { width: 100%; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box; margin-bottom: 8px; }
    ul { list-style: none; padding: 0; margin: 0; max-height: 140px; overflow: auto; }
    .opt { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 13px; cursor: pointer; }
    .info { font-size: 11px; color: #94a3b8; margin-top: 8px; }
  `],
})
export default class MultiSelectComponent {
  readonly label = input<string>('Pick technologies');
  readonly options = input<string[]>(['TypeScript', 'JavaScript', 'Go', 'Rust', 'Python', 'Java', 'Kotlin', 'Swift', 'C#', 'Ruby', 'Elixir']);
  readonly query = signal('');
  readonly selected = signal<Set<string>>(new Set(['TypeScript', 'Rust']));
  readonly visible = computed(() => {
    const q = this.query().toLowerCase();
    return this.options().filter((o) => o.toLowerCase().includes(q));
  });
  toggle(o: string): void {
    const next = new Set(this.selected());
    if (next.has(o)) next.delete(o); else next.add(o);
    this.selected.set(next);
  }
}
