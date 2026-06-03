import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NexusRemote } from '@bimo-dk/nexus-build';

@NexusRemote({ exposeAs: 'SliderRange' })
@Component({
  selector: 'demo-slider-range',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <label>{{ label() }}</label>
      <div class="values"><strong>{{ low() }}</strong><span>to</span><strong>{{ high() }}</strong></div>
      <div class="track">
        <div class="fill" [style.left.%]="leftPct()" [style.right.%]="rightPct()"></div>
        <input type="range" [min]="min()" [max]="max()" [value]="low()"
               (input)="setLow(+$any($event.target).value)" class="thumb thumb-l" />
        <input type="range" [min]="min()" [max]="max()" [value]="high()"
               (input)="setHigh(+$any($event.target).value)" class="thumb thumb-h" />
      </div>
      <div class="ticks"><span>{{ min() }}</span><span>{{ max() }}</span></div>
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 280px; }
    label { display: block; font-size: 12px; color: #475569; margin-bottom: 6px; }
    .values { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; color: #6366f1; margin-bottom: 16px; }
    .values span { font-size: 12px; color: #94a3b8; font-weight: 400; }
    .track { position: relative; height: 6px; background: #e2e8f0; border-radius: 999px; margin: 0 8px 4px; }
    .fill { position: absolute; top: 0; bottom: 0; background: #6366f1; border-radius: 999px; }
    .thumb { position: absolute; top: 50%; transform: translateY(-50%); width: 100%; left: 0; appearance: none; background: transparent; pointer-events: none; height: 16px; }
    .thumb::-webkit-slider-thumb { appearance: none; width: 16px; height: 16px; background: white; border: 2px solid #6366f1; border-radius: 50%; pointer-events: auto; cursor: pointer; }
    .ticks { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; margin-top: 8px; }
  `],
})
export default class SliderRangeComponent {
  readonly label = input<string>('Price range');
  readonly min = input<number>(0);
  readonly max = input<number>(1000);
  readonly low = signal<number>(200);
  readonly high = signal<number>(750);
  readonly leftPct = computed(() => ((this.low() - this.min()) / (this.max() - this.min())) * 100);
  readonly rightPct = computed(() => 100 - ((this.high() - this.min()) / (this.max() - this.min())) * 100);
  setLow(v: number): void { this.low.set(Math.min(v, this.high() - 1)); }
  setHigh(v: number): void { this.high.set(Math.max(v, this.low() + 1)); }
}
