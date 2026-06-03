import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NexusRemote, NexusComponent } from '../nexus-remote.local';

interface Todo { id: number; text: string; done: boolean; }

@NexusRemote({ exposeAs: 'TodoList' })
@NexusComponent({
    "title": "Todo List",
    "description": "Add / check / delete tasks",
    "category": "input",
    "tags": [
      "todo",
      "list"
    ],
    "icon": "task_alt",
    "inputs": {
      "label": {
        "type": "string",
        "default": "Tasks"
      }
    }
  })
@Component({
  selector: 'demo-todo-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <label>{{ label() }}</label>
      <form (submit)="add($event)" class="form">
        <input type="text" [value]="draft()" (input)="draft.set($any($event.target).value)" placeholder="add a todo..." />
        <button type="submit">+</button>
      </form>
      <ul>
        @for (t of todos(); track t.id) {
          <li [class.done]="t.done">
            <input type="checkbox" [checked]="t.done" (change)="toggle(t.id)" />
            <span>{{ t.text }}</span>
            <button class="del" (click)="remove(t.id)" aria-label="delete">×</button>
          </li>
        }
      </ul>
      <div class="info">{{ remaining() }} remaining · {{ todos().length }} total</div>
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 280px; }
    label { display: block; font-size: 12px; color: #475569; margin-bottom: 8px; }
    .form { display: flex; gap: 6px; margin-bottom: 10px; }
    .form input { flex: 1; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; }
    .form button { background: #6366f1; color: white; border: none; border-radius: 6px; width: 32px; font-size: 18px; cursor: pointer; }
    ul { list-style: none; padding: 0; margin: 0; max-height: 140px; overflow: auto; }
    li { display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 13px; }
    li.done span { text-decoration: line-through; color: #94a3b8; }
    .del { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 16px; padding: 0; margin-left: auto; opacity: 0.6; }
    .del:hover { opacity: 1; }
    .info { font-size: 11px; color: #94a3b8; margin-top: 8px; padding-top: 8px; border-top: 1px solid #f1f5f9; }
  `],
})
export default class TodoListComponent {
  readonly label = input<string>('Tasks');
  readonly todos = signal<Todo[]>([
    { id: 1, text: 'Review PR #42', done: false },
    { id: 2, text: 'Deploy to staging', done: true },
    { id: 3, text: 'Write docs', done: false },
  ]);
  readonly draft = signal('');
  readonly remaining = computed(() => this.todos().filter((t) => !t.done).length);
  add(ev: Event): void {
    ev.preventDefault();
    const v = this.draft().trim();
    if (!v) return;
    this.todos.update((arr) => [...arr, { id: Date.now(), text: v, done: false }]);
    this.draft.set('');
  }
  toggle(id: number): void {
    this.todos.update((arr) => arr.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
  remove(id: number): void {
    this.todos.update((arr) => arr.filter((t) => t.id !== id));
  }
}
