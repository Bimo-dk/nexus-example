import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';

@NexusRemote({ exposeAs: 'CatalogPage' })
@NexusComponent({
  title: 'Catalog page',
  category: 'pages',
  tags: ['products', 'shop'],
})
@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="catalog">
      <h1>Produkter</h1>
      <div class="filter-bar">
        <button (click)="filter.set('all')"     [class.active]="filter()==='all'">Alle</button>
        <button (click)="filter.set('clothes')" [class.active]="filter()==='clothes'">Tøj</button>
        <button (click)="filter.set('shoes')"   [class.active]="filter()==='shoes'">Sko</button>
      </div>
      <div class="product-grid">
        @for (p of filteredProducts(); track p.id) {
          <a class="product-card" [routerLink]="['/products', p.id]">
            <div class="product-emoji">{{ p.emoji }}</div>
            <div class="product-name">{{ p.name }}</div>
            <div class="product-price">{{ p.price | currency:'DKK':'symbol':'1.0-0' }}</div>
            <button class="add-to-cart" (click)="$event.preventDefault()">
              Læg i kurv
            </button>
          </a>
        }
      </div>
    </div>
  `,
  styles: [`
    .catalog { max-width: 1100px; margin: 0 auto; }
    h1 { margin-bottom: 1.5rem; font-size: 1.8rem; }
    .filter-bar { display: flex; gap: .75rem; margin-bottom: 2rem; }
    .filter-bar button {
      padding: .4rem 1rem; border: 1px solid #ddd; border-radius: 999px;
      background: #fff; cursor: pointer; font-size: .9rem; transition: all .15s;
    }
    .filter-bar button.active {
      background: #2563eb; color: #fff; border-color: #2563eb;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      border: 1px solid #eee; border-radius: 12px; padding: 1.5rem;
      text-align: center; text-decoration: none; color: inherit;
      transition: box-shadow .2s, transform .2s; display: block;
    }
    .product-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.1); transform: translateY(-2px); }
    .product-emoji { font-size: 3rem; margin-bottom: .75rem; }
    .product-name { font-weight: 600; margin-bottom: .25rem; }
    .product-price { color: #888; font-size: .9rem; margin-bottom: 1rem; }
    .add-to-cart {
      background: #2563eb; color: #fff; border: none; border-radius: 8px;
      padding: .5rem 1.25rem; cursor: pointer; font-size: .9rem;
      width: 100%; transition: background .15s;
    }
    .add-to-cart:hover { background: #1d4ed8; }
  `],
})
export class CatalogPageComponent {
  filter = signal<'all' | 'clothes' | 'shoes'>('all');

  private products = [
    { id: 1, name: 'Hvid T-shirt', emoji: '👕', price: 149, category: 'clothes' },
    { id: 2, name: 'Sorte jeans',  emoji: '👖', price: 499, category: 'clothes' },
    { id: 3, name: 'Løbesko',      emoji: '👟', price: 799, category: 'shoes'   },
    { id: 4, name: 'Sandaler',     emoji: '👡', price: 349, category: 'shoes'   },
    { id: 5, name: 'Hoodie',       emoji: '🧥', price: 599, category: 'clothes' },
    { id: 6, name: 'Sneakers',     emoji: '👟', price: 999, category: 'shoes'   },
  ];

  filteredProducts = computed(() =>
    this.filter() === 'all'
      ? this.products
      : this.products.filter(p => p.category === this.filter())
  );
}
