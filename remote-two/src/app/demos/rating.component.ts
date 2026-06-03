import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NexusRemote } from '../nexus-remote.local';

@NexusRemote({ exposeAs: 'Rating' })
@Component({
  selector: 'demo-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <label>{{ label() }}</label>
      <div class="stars" (mouseleave)="hover.set(0)">
        @for (i of stars; track i) {
          <button class="star" [class.on]="i <= (hover() || value())"
            (click)="value.set(i)" (mouseenter)="hover.set(i)" aria-label="rate">★</button>
        }
      </div>
      <div class="meta">{{ value() ? value() + ' / 5' : 'no rating yet' }}</div>
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; min-width: 220px; }
    label { display: block; font-size: 12px; color: #475569; margin-bottom: 6px; }
    .stars { display: flex; gap: 4px; }
    .star { background: none; border: none; font-size: 28px; color: #e2e8f0; cursor: pointer; padding: 0; transition: color 0.1s, transform 0.1s; }
    .star:hover { transform: scale(1.15); }
    .star.on { color: #fbbf24; }
    .meta { font-size: 12px; color: #475569; margin-top: 6px; }
  `],
})
export default class RatingComponent {
  readonly label = input<string>('Rate this');
  readonly value = signal<number>(3);
  readonly hover = signal<number>(0);
  readonly stars = [1, 2, 3, 4, 5];
}
