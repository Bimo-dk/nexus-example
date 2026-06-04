import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';
import { NexusBus } from '@bimo-dk/nexus-bus';

interface CartAdded { sku: string; qty: number; }

@NexusRemote({ exposeAs: 'CartPublisher' })
@NexusComponent({
  title: 'Cart Publisher',
  description: 'Buttons that publish cart:item-added events on the NexusBus',
  category: 'demo',
  tags: ['bus', 'pubsub', 'demo'],
  icon: 'shopping_cart',
  inputs: {},
})
@Component({
  selector: 'demo-cart-publisher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h3>Cart publisher (from remoteTwo)</h3>
      <p>Click a product — this remote publishes a <code>cart:item-added</code> event. The host's cart badge subscribes and updates without any direct coupling.</p>
      <div class="products">
        @for (p of products; track p.sku) {
          <button class="product" (click)="add(p.sku, p.qty)">
            <strong>{{ p.name }}</strong>
            <span>SKU {{ p.sku }} · +{{ p.qty }}</span>
          </button>
        }
      </div>
      @if (lastSent(); as last) {
        <div class="log">Sent: <code>{{ last }}</code></div>
      }
      <button class="ghost" (click)="askTotal()">Request cart total (RPC)</button>
      @if (rpcResult() !== null) { <span class="rpc">Total: <strong>{{ rpcResult() }}</strong></span> }
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; }
    h3 { margin: 0 0 4px; font-size: 16px; }
    p { margin: 0 0 12px; font-size: 13px; color: #64748b; }
    p code { background: #f1f5f9; padding: 1px 5px; border-radius: 3px; font-size: 12px; }
    .products { display: flex; flex-wrap: wrap; gap: 8px; }
    .product { display: flex; flex-direction: column; gap: 2px; padding: 8px 12px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; text-align: left; }
    .product:hover { background: #4f46e5; }
    .product strong { font-size: 13px; }
    .product span { font-size: 11px; opacity: 0.85; }
    .log { margin-top: 10px; font-size: 12px; color: #475569; }
    .log code { font-family: monospace; }
    .ghost { margin-top: 12px; background: transparent; color: #6366f1; border: 1px solid #6366f1; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; }
    .ghost:hover { background: #eef2ff; }
    .rpc { margin-left: 10px; font-size: 12px; color: #475569; }
  `],
})
export default class CartPublisherComponent {
  private readonly bus = inject(NexusBus);
  readonly lastSent = signal<string | null>(null);
  readonly rpcResult = signal<number | null>(null);

  readonly products = [
    { sku: 'BIM-001', name: 'Bimo Hoodie',   qty: 1 },
    { sku: 'BIM-042', name: 'Nexus Mug',     qty: 2 },
    { sku: 'BIM-099', name: 'Federation Hat', qty: 1 },
  ];

  add(sku: string, qty: number): void {
    this.bus.publish<CartAdded>('cart:item-added', { sku, qty }, { source: 'remoteTwo/CartPublisher' });
    this.lastSent.set(`${sku} × ${qty}`);
  }

  async askTotal(): Promise<void> {
    try {
      const total = await this.bus.request<void, number>('cart:get-total', undefined, { timeoutMs: 2000 });
      this.rpcResult.set(total);
    } catch (err) {
      this.rpcResult.set(-1);
      console.error('[cart-publisher] RPC failed', err);
    }
  }
}
