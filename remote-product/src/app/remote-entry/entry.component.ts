import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';

@NexusRemote({ exposeAs: 'ProductPage' })
@NexusComponent({
  title: 'Product detail page',
  category: 'pages',
  tags: ['product', 'shop'],
})
@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="product-detail">
      <div class="product-hero">
        <div class="product-emoji">{{ product.emoji }}</div>
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <p class="price">{{ product.price | currency:'DKK':'symbol':'1.0-0' }}</p>
          <p class="desc">{{ product.description }}</p>
          <button class="add-to-cart">Læg i kurv</button>
        </div>
      </div>
      <section class="reviews">
        <h2>Anmeldelser</h2>
        @for (r of product.reviews; track r.author) {
          <div class="review">
            <div class="stars">{{ '★'.repeat(r.stars) }}{{ '☆'.repeat(5 - r.stars) }}</div>
            <p><strong>{{ r.author }}</strong> — {{ r.text }}</p>
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .product-detail { max-width: 800px; margin: 0 auto; }
    .product-hero { display: flex; gap: 3rem; margin-bottom: 3rem; }
    .product-emoji { font-size: 8rem; }
    .product-info { flex: 1; }
    h1 { font-size: 2rem; margin-bottom: .5rem; }
    .price { font-size: 1.5rem; font-weight: 700; color: #2563eb; margin-bottom: 1rem; }
    .desc { color: #555; margin-bottom: 1.5rem; line-height: 1.6; }
    .add-to-cart {
      background: #2563eb; color: #fff; border: none; border-radius: 8px;
      padding: .75rem 2rem; font-size: 1rem; font-weight: 600; cursor: pointer;
    }
    .reviews h2 { margin-bottom: 1rem; }
    .review { padding: 1rem 0; border-bottom: 1px solid #eee; }
    .stars { color: #f59e0b; font-size: 1.1rem; margin-bottom: .25rem; }
  `],
})
export class ProductPageComponent {
  product = {
    id: 1,
    name: 'Hvid T-shirt',
    emoji: '👕',
    price: 149,
    description: 'Klassisk hvid t-shirt i 100% bomuld. Behagelig pasform og holdbar kvalitet.',
    reviews: [
      { author: 'Anders H.', stars: 5, text: 'Super god kvalitet, passer perfekt.' },
      { author: 'Mette L.',  stars: 4, text: 'Fin t-shirt, lidt stor i størrelsen.' },
      { author: 'Jonas K.',  stars: 5, text: 'Købt tre stykker. Kan varmt anbefales.' },
    ],
  };
}
