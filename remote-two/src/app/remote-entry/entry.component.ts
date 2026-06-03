import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NexusRemote } from '../nexus-remote.local';
import { environment } from '../../environments/environment';

@NexusRemote()
@Component({
  selector: 'app-remote-entry',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="remote-card">
      <header>
        <h2>Remote Two — independent micro frontend</h2>
        <span class="badge">Nexus entry</span>
      </header>

      <p class="lead">
        This component demonstrates that remote-two is fully isolated from remote-one —
        their state, build times and versions are independent.
      </p>

      <dl class="meta">
        <dt>Remote name</dt>
        <dd>{{ remoteName }}</dd>
        <dt>Build time</dt>
        <dd>{{ buildTime }}</dd>
      </dl>

      <div class="counter">
        <p>Local state counter:</p>
        <button type="button" (click)="increment()">+1</button>
        <button type="button" (click)="decrement()">-1</button>
        <strong>{{ count() }}</strong>
      </div>

      <footer>
        <small>Exposed as <code>./RemoteEntry</code> via Nexus.</small>
      </footer>
    </section>
  `,
  styles: [
    `
      .remote-card {
        background: #fff;
        border: 2px solid #16a34a;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 12px rgba(22, 163, 74, 0.1);
      }
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }
      h2 {
        margin: 0;
        color: #14532d;
        font-size: 20px;
      }
      .badge {
        background: #dcfce7;
        color: #14532d;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
      }
      .lead {
        color: #166534;
        font-size: 14px;
        line-height: 1.5;
        margin: 0 0 16px;
      }
      .meta {
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: 6px 12px;
        margin: 0 0 20px;
        padding: 12px 0;
        border-top: 1px solid #d1fae5;
        border-bottom: 1px solid #d1fae5;
        font-size: 14px;
      }
      dt { color: #64748b; font-weight: 500; }
      dd { margin: 0; color: #0f172a; font-family: 'SF Mono', Menlo, monospace; }
      .counter {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }
      .counter p { margin: 0 8px 0 0; color: #475569; font-size: 14px; }
      .counter button {
        background: #16a34a;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      }
      .counter button:hover { background: #15803d; }
      .counter strong {
        font-size: 18px;
        color: #14532d;
        min-width: 32px;
        text-align: center;
      }
      footer small { color: #64748b; font-size: 12px; }
      code {
        background: #f0fdf4;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'SF Mono', Menlo, monospace;
      }
    `,
  ],
})
export default class EntryComponent {
  readonly remoteName = environment.remoteName;
  readonly buildTime = environment.buildTime;
  readonly count = signal(0);

  increment(): void {
    this.count.update((v) => v + 1);
  }

  decrement(): void {
    this.count.update((v) => v - 1);
  }
}

export { EntryComponent };
