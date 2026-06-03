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
        <h2>Remote One — this is a micro frontend</h2>
        <span class="badge">Nexus entry</span>
      </header>

      <dl class="meta">
        <dt>Remote name</dt>
        <dd>{{ remoteName }}</dd>
        <dt>Build time</dt>
        <dd>{{ buildTime }}</dd>
      </dl>

      <div class="counter">
        <p>Isolated state counter (signal):</p>
        <button type="button" (click)="increment()">Click me</button>
        <strong>{{ count() }}</strong>
      </div>

      <footer>
        <small>This component is delivered via Nexus as <code>./RemoteEntry</code>.</small>
      </footer>
    </section>
  `,
  styles: [
    `
      .remote-card {
        background: #fff;
        border: 2px solid #2563eb;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
      }
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }
      h2 {
        margin: 0;
        color: #1e3a8a;
        font-size: 20px;
      }
      .badge {
        background: #dbeafe;
        color: #1e40af;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
      }
      .meta {
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: 6px 12px;
        margin: 0 0 20px;
        padding: 12px 0;
        border-top: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0;
        font-size: 14px;
      }
      dt { color: #64748b; font-weight: 500; }
      dd { margin: 0; color: #0f172a; font-family: 'SF Mono', Menlo, monospace; }
      .counter {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }
      .counter p { margin: 0; color: #475569; font-size: 14px; }
      .counter button {
        background: #2563eb;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
      }
      .counter button:hover { background: #1d4ed8; }
      .counter strong {
        font-size: 18px;
        color: #1e3a8a;
        min-width: 32px;
        text-align: center;
      }
      footer small {
        color: #64748b;
        font-size: 12px;
      }
      code {
        background: #f1f5f9;
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
}

export { EntryComponent };
