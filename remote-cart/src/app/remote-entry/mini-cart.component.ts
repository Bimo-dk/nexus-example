import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NexusComponent } from '@bimo-dk/nexus-build';

@NexusComponent({
  title: 'Mini cart',
  category: 'navigation',
  tags: ['cart', 'navbar'],
  inputs: {
    itemCount: { type: 'number', default: 0 },
  },
})
@Component({
  selector: 'app-mini-cart',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a routerLink="/cart" class="mini-cart">
      🛒
      @if (itemCount > 0) {
        <span class="badge">{{ itemCount }}</span>
      }
    </a>
  `,
  styles: [`
    .mini-cart {
      position: relative; text-decoration: none;
      font-size: 1.4rem; padding: .25rem;
    }
    .badge {
      position: absolute; top: -6px; right: -8px;
      background: #ef4444; color: #fff; border-radius: 50%;
      font-size: 11px; font-weight: 700;
      padding: 1px 5px; min-width: 18px; text-align: center;
      line-height: 16px;
    }
  `],
})
export class MiniCartComponent {
  @Input() itemCount = 0;
}
