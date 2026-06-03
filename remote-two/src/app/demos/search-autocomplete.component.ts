import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NexusRemote, NexusComponent } from '../nexus-remote.local';

@NexusRemote({ exposeAs: 'SearchAutocomplete' })
@NexusComponent({
    "title": "Search Autocomplete",
    "description": "Text input with dropdown suggestions",
    "category": "input",
    "tags": [
      "search",
      "autocomplete"
    ],
    "icon": "search",
    "inputs": {
      "label": {
        "type": "string",
        "default": "Search component"
      },
      "placeholder": {
        "type": "string",
        "default": "Type to search..."
      },
      "options": {
        "type": "array",
        "description": "Array of selectable strings"
      }
    }
  })
@Component({
  selector: 'demo-search-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <label>{{ label() }}</label>
      <div class="wrap">
        <input type="text" [value]="query()" (input)="onInput($any($event.target).value)" [placeholder]="placeholder()" />
        @if (query() && filtered().length > 0) {
          <ul class="dropdown">
            @for (item of filtered(); track item) {
              <li (click)="pick(item)">{{ item }}</li>
            }
          </ul>
        }
      </div>
      @if (selected()) { <div class="picked">Selected: <strong>{{ selected() }}</strong></div> }
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 280px; }
    label { display: block; font-size: 12px; color: #475569; margin-bottom: 6px; }
    .wrap { position: relative; }
    input { width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
    .dropdown { position: absolute; top: 100%; left: 0; right: 0; list-style: none; padding: 0; margin: 4px 0 0; background: white; border: 1px solid #e2e8f0; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); max-height: 180px; overflow: auto; z-index: 10; }
    .dropdown li { padding: 8px 12px; cursor: pointer; font-size: 13px; }
    .dropdown li:hover { background: #f1f5f9; }
    .picked { margin-top: 10px; font-size: 12px; color: #475569; }
  `],
})
export default class SearchAutocompleteComponent {
  readonly label = input<string>('Search component');
  readonly placeholder = input<string>('Type to search...');
  readonly options = input<string[]>(['Angular', 'React', 'Vue', 'Svelte', 'Solid', 'Qwik', 'Lit', 'Stencil', 'Preact', 'Ember']);
  readonly query = signal('');
  readonly selected = signal<string | null>(null);
  readonly filtered = computed(() => {
    const q = this.query().toLowerCase();
    return this.options().filter((o) => o.toLowerCase().includes(q)).slice(0, 6);
  });
  onInput(v: string): void { this.query.set(v); this.selected.set(null); }
  pick(v: string): void { this.selected.set(v); this.query.set(v); }
}
