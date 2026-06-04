import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';

@NexusRemote({ exposeAs: 'AccountPage' })
@NexusComponent({
  title: 'Account page',
  category: 'pages',
  tags: ['account', 'shop'],
})
@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    <div class="account">
      <div class="account-header">
        <div class="avatar">👤</div>
        <div>
          <h1>{{ user.name }}</h1>
          <p class="email">{{ user.email }}</p>
        </div>
      </div>
      <section>
        <h2>Ordrehistorik</h2>
        <div class="orders">
          @for (order of orders; track order.id) {
            <div class="order-card">
              <div class="order-meta">
                <span class="order-id">#{{ order.id }}</span>
                <span class="order-date">{{ order.date | date:'d. MMM yyyy' }}</span>
                <span class="order-status" [class]="order.status">{{ order.statusLabel }}</span>
              </div>
              <div class="order-items">
                @for (item of order.items; track item) {
                  <span>{{ item }}</span>
                }
              </div>
              <div class="order-total">
                {{ order.total | currency:'DKK':'symbol':'1.0-0' }}
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .account { max-width: 720px; margin: 0 auto; }
    .account-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; }
    .avatar { font-size: 3.5rem; }
    h1 { margin: 0 0 .25rem; }
    .email { color: #888; margin: 0; }
    h2 { margin-bottom: 1rem; }
    .order-card {
      border: 1px solid #eee; border-radius: 10px; padding: 1rem 1.25rem;
      margin-bottom: 1rem; display: flex; align-items: center; gap: 1.5rem;
    }
    .order-meta { display: flex; align-items: center; gap: 1rem; min-width: 220px; }
    .order-id { font-weight: 600; color: #2563eb; }
    .order-date { color: #888; font-size: .9rem; }
    .order-status { font-size: .8rem; padding: .2rem .6rem; border-radius: 999px; }
    .order-status.delivered { background: #dcfce7; color: #16a34a; }
    .order-status.shipped   { background: #dbeafe; color: #1d4ed8; }
    .order-items { flex: 1; display: flex; gap: .5rem; flex-wrap: wrap; color: #555; font-size: .9rem; }
    .order-total { font-weight: 600; min-width: 80px; text-align: right; }
  `],
})
export class AccountPageComponent {
  user = { name: 'Anders Hansen', email: 'anders@example.dk' };

  orders = [
    {
      id: '10042', date: new Date('2026-05-28'), total: 1747,
      status: 'delivered', statusLabel: 'Leveret',
      items: ['👕 T-shirt', '👟 Sneakers', '🧥 Hoodie'],
    },
    {
      id: '10038', date: new Date('2026-05-14'), total: 349,
      status: 'delivered', statusLabel: 'Leveret',
      items: ['👡 Sandaler'],
    },
    {
      id: '10051', date: new Date('2026-06-02'), total: 799,
      status: 'shipped', statusLabel: 'Undervejs',
      items: ['👟 Løbesko'],
    },
  ];
}
