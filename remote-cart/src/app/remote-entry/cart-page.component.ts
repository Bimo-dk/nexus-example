import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';

@NexusRemote({ exposeAs: 'CartPage' })
@NexusComponent({
  title: 'Cart page',
  category: 'pages',
  tags: ['cart', 'shop'],
})
@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="cart">
      <h1>Din kurv</h1>
      @if (items.length === 0) {
        <p class="empty">Kurven er tom. <a routerLink="/products">Se produkter →</a></p>
      } @else {
        <div class="cart-items">
          @for (item of items; track item.id) {
            <div class="cart-item">
              <span class="item-emoji">{{ item.emoji }}</span>
              <span class="item-name">{{ item.name }}</span>
              <span class="item-price">{{ item.price | currency:'DKK':'symbol':'1.0-0' }}</span>
              <button class="remove" (click)="remove(item.id)">✕</button>
            </div>
          }
        </div>
        <div class="cart-footer">
          <div class="cart-total">
            Total: <strong>{{ total | currency:'DKK':'symbol':'1.0-0' }}</strong>
          </div>
          <a routerLink="/checkout" class="checkout-btn">Gå til betaling →</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart { max-width: 680px; margin: 0 auto; }
    h1 { margin-bottom: 1.5rem; }
    .empty { color: #888; }
    .empty a { color: #2563eb; }
    .cart-item {
      display: flex; align-items: center; gap: 1rem;
      padding: 1rem 0; border-bottom: 1px solid #eee;
    }
    .item-emoji { font-size: 1.8rem; }
    .item-name { flex: 1; font-weight: 500; }
    .item-price { color: #444; min-width: 80px; text-align: right; }
    .remove {
      background: none; border: none; color: #bbb; cursor: pointer;
      font-size: 1rem; padding: .25rem .5rem; transition: color .15s;
    }
    .remove:hover { color: #ef4444; }
    .cart-footer {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 1.5rem; padding-top: 1rem;
    }
    .cart-total { font-size: 1.1rem; }
    .checkout-btn {
      background: #2563eb; color: #fff; text-decoration: none;
      padding: .75rem 2rem; border-radius: 8px; font-weight: 600;
      transition: background .15s;
    }
    .checkout-btn:hover { background: #1d4ed8; }
  `],
})
export class CartPageComponent {
  items = [
    { id: 1, name: 'Hvid T-shirt', emoji: '👕', price: 149 },
    { id: 2, name: 'Sneakers',     emoji: '👟', price: 999 },
    { id: 3, name: 'Hoodie',       emoji: '🧥', price: 599 },
  ];

  get total() { return this.items.reduce((s, i) => s + i.price, 0); }

  remove(id: number) {
    this.items = this.items.filter(i => i.id !== id);
  }
}
