import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';

@NexusRemote({ exposeAs: 'CheckoutPage' })
@NexusComponent({
  title: 'Checkout page',
  category: 'pages',
  tags: ['checkout', 'shop'],
})
@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="checkout">
      @if (!completed()) {
        <h1>Betaling</h1>
        <form class="checkout-form" (submit)="submit($event)">
          <label>Navn<input type="text" placeholder="Dit fulde navn" required /></label>
          <label>Email<input type="email" placeholder="din@email.dk" required /></label>
          <label>Adresse<input type="text" placeholder="Gadenavn 1, 1234 By" required /></label>
          <label>Kortnummer<input type="text" placeholder="1234 5678 9012 3456" required /></label>
          <div class="card-row">
            <label>Udløb<input type="text" placeholder="MM/ÅÅ" required /></label>
            <label>CVV<input type="text" placeholder="123" required /></label>
          </div>
          <button type="submit" class="pay-btn">Gennemfør ordre</button>
        </form>
      } @else {
        <div class="success">
          <div class="check">✅</div>
          <h1>Ordre bekræftet!</h1>
          <p>Tak for dit køb. Du modtager en bekræftelse på din email.</p>
          <a routerLink="/products" class="back-btn">Fortsæt shopping</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout { max-width: 520px; margin: 0 auto; }
    h1 { margin-bottom: 1.5rem; }
    .checkout-form { display: flex; flex-direction: column; gap: 1rem; }
    label { display: flex; flex-direction: column; gap: .25rem; font-size: .9rem; color: #555; }
    input {
      padding: .6rem .9rem; border: 1px solid #ddd; border-radius: 8px;
      font-size: 1rem; outline: none; transition: border-color .15s;
    }
    input:focus { border-color: #2563eb; }
    .card-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .pay-btn {
      background: #2563eb; color: #fff; border: none; border-radius: 8px;
      padding: .875rem; font-size: 1rem; font-weight: 600; cursor: pointer;
      margin-top: .5rem; transition: background .15s;
    }
    .pay-btn:hover { background: #1d4ed8; }
    .success { text-align: center; padding: 3rem 0; }
    .check { font-size: 4rem; margin-bottom: 1rem; }
    .back-btn {
      display: inline-block; margin-top: 1.5rem; color: #2563eb;
      text-decoration: none; font-weight: 600;
    }
  `],
})
export class CheckoutPageComponent {
  completed = signal(false);

  submit(e: Event) {
    e.preventDefault();
    this.completed.set(true);
  }
}
