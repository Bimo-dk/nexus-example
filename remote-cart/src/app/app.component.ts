import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartPageComponent } from './remote-entry/cart-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CartPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class=”standalone-shell”>
      <header>
        <h1>Cart — standalone mode</h1>
        <p>This page is only visible when remote-cart runs in isolation.</p>
      </header>
      <app-cart-page></app-cart-page>
    </main>
  `,
  styles: [
    `
      .standalone-shell {
        max-width: 960px;
        margin: 0 auto;
        padding: 24px;
      }
      header {
        border-bottom: 2px solid var(--remote-accent);
        padding-bottom: 12px;
        margin-bottom: 24px;
      }
      h1 {
        color: var(--remote-accent);
        margin: 0 0 4px;
      }
      header p {
        margin: 0;
        color: #475569;
        font-size: 14px;
      }
    `,
  ],
})
export class AppComponent {}

