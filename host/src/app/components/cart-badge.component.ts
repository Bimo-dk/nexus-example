import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NexusBus } from '../bus.local';
import { USER_CONTEXT } from '../user-context.local';

export interface CartAdded {
  sku: string;
  qty: number;
}

/**
 * Demo of cross-component communication via NexusBus.
 * Lives in the host shell. Subscribes to `cart:item-added` events that any
 * federated component anywhere in the app can publish.
 *
 * Also reads USER_CONTEXT so it can show the user's greeting.
 */
@Component({
  selector: 'app-cart-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (user(); as u) {
      <span class="user">{{ u.name }}</span>
    }
    <span class="badge" [class.pulse]="justUpdated()">
      🛒 <strong>{{ count() }}</strong>
    </span>
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; gap: 12px; font-size: 13px; }
    .user { color: var(--host-text-muted, #64748b); font-weight: 500; }
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: #eef2ff; color: #4338ca; border-radius: 999px; font-weight: 600; transition: transform 0.2s; }
    .badge.pulse { transform: scale(1.15); background: #c7d2fe; }
  `],
})
export class CartBadgeComponent {
  private readonly bus = inject(NexusBus);
  private readonly destroyRef = inject(DestroyRef);
  readonly user = inject(USER_CONTEXT, { optional: true }) ?? signal(null);

  readonly count = signal(0);
  readonly justUpdated = signal(false);

  constructor() {
    this.bus.on<CartAdded>('cart:item-added')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => {
        this.count.update((n) => n + e.payload.qty);
        this.justUpdated.set(true);
        setTimeout(() => this.justUpdated.set(false), 300);
        console.log(`[cart-badge] +${e.payload.qty} ${e.payload.sku} from ${e.source ?? 'unknown'} — total ${this.count()}`);
      });

    // Respond to `cart:get-total` so anyone can request the current count
    this.bus.respond<void, number>('cart:get-total', () => this.count());
  }
}
