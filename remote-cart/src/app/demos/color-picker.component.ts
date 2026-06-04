import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';

@NexusRemote({ exposeAs: 'ColorPicker' })
@NexusComponent({
    "title": "Color Picker",
    "description": "HSL color picker with hex preview",
    "category": "input",
    "tags": [
      "color",
      "picker"
    ],
    "icon": "palette",
    "inputs": {
      "label": {
        "type": "string",
        "default": "Color picker"
      }
    }
  })
@Component({
  selector: 'demo-color-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <label>{{ label() }}</label>
      <div class="preview" [style.background]="hex()">
        <span>{{ hex() }}</span>
      </div>
      <div class="row"><span>Hue {{ hue() }}°</span><input type="range" min="0" max="360" [value]="hue()" (input)="hue.set(+$any($event.target).value)" /></div>
      <div class="row"><span>Sat {{ sat() }}%</span><input type="range" min="0" max="100" [value]="sat()" (input)="sat.set(+$any($event.target).value)" /></div>
      <div class="row"><span>Light {{ light() }}%</span><input type="range" min="0" max="100" [value]="light()" (input)="light.set(+$any($event.target).value)" /></div>
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 260px; }
    label { display: block; font-size: 12px; color: #475569; margin-bottom: 8px; }
    .preview { height: 60px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-family: monospace; text-shadow: 0 1px 2px rgba(0,0,0,0.4); margin-bottom: 12px; }
    .row { display: grid; grid-template-columns: 70px 1fr; gap: 8px; align-items: center; font-size: 12px; color: #475569; margin-bottom: 6px; }
    input[type=range] { width: 100%; }
  `],
})
export default class ColorPickerComponent {
  readonly label = input<string>('Color picker');
  readonly hue = signal(240);
  readonly sat = signal(70);
  readonly light = signal(55);
  readonly hex = computed(() => {
    const h = this.hue() / 360, s = this.sat() / 100, l = this.light() / 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number): string => {
      const k = (n + h * 12) % 12;
      const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      return Math.round(c * 255).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  });
}
