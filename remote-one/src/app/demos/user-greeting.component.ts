import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build';
import { getUserSignal, userHasAnyRole } from '@bimo-dk/nexus-runtime';

@NexusRemote({ exposeAs: 'UserGreeting' })
@NexusComponent({
  title: 'User Greeting',
  description: 'Reads USER_CONTEXT injected by the host and greets the user',
  category: 'demo',
  tags: ['auth', 'context', 'demo'],
  icon: 'person',
  inputs: {},
})
@Component({
  selector: 'demo-user-greeting',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      @if (user(); as u) {
        <div class="row">
          <div class="avatar">{{ initials() }}</div>
          <div class="who">
            <strong>Hi, {{ u.name }}</strong>
            @if (u.email) { <span class="email">{{ u.email }}</span> }
          </div>
        </div>
        <div class="roles">
          @for (r of u.roles; track r) {
            <span class="pill" [class.admin]="r === 'admin'">{{ r }}</span>
          }
        </div>
        @if (isAdmin()) {
          <div class="admin-note">✓ Admin tools unlocked (would render extra UI here)</div>
        }
        <details>
          <summary>Raw context (sent down by host via USER_CONTEXT token)</summary>
          <pre>{{ raw() }}</pre>
        </details>
      } @else {
        <div class="anon">No user injected — host did not provide USER_CONTEXT (anonymous mode).</div>
      }
    </div>
  `,
  styles: [`
    .card { padding: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; }
    .row { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .who strong { display: block; font-size: 15px; color: #0f172a; }
    .who .email { font-size: 12px; color: #64748b; }
    .roles { display: flex; gap: 4px; margin: 10px 0; flex-wrap: wrap; }
    .pill { background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 999px; font-size: 11px; }
    .pill.admin { background: #fef3c7; color: #92400e; font-weight: 600; }
    .admin-note { padding: 8px 12px; background: #fef3c7; color: #92400e; border-radius: 6px; font-size: 12px; margin: 8px 0; }
    .anon { padding: 12px; background: #f1f5f9; color: #64748b; border-radius: 6px; font-size: 12px; font-style: italic; }
    details { margin-top: 10px; font-size: 12px; }
    summary { cursor: pointer; color: #6366f1; }
    pre { background: #0f172a; color: #cbd5e1; padding: 12px; border-radius: 6px; font-size: 11px; overflow: auto; margin-top: 6px; }
  `],
})
export default class UserGreetingComponent {
  readonly user = getUserSignal();
  readonly initials = computed(() => {
    const u = this.user();
    if (!u) return '?';
    return u.name.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();
  });
  readonly isAdmin = computed(() => userHasAnyRole(this.user(), ['admin']));
  readonly raw = computed(() => JSON.stringify(this.user(), null, 2));
}
