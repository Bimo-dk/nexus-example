import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountPageComponent } from './remote-entry/entry.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AccountPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class=”standalone-shell”>
      <header>
        <h1>Account — standalone mode</h1>
        <p>This page is only visible when remote-account runs in isolation (not federated into the host).</p>
      </header>
      <app-account-page></app-account-page>
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

