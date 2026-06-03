import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, type Routes } from '@angular/router';
import { ComponentLoaderService } from './component-loader.local';
import { CatalogService, type CatalogEntry } from './catalog.local.service';

/**
 * Pattern 1: Route-based loading.
 *
 * Every catalog entry gets its own route under /demos/routes/:slug, registered
 * dynamically against the live Router. Clicking a link navigates and the
 * component renders inside <router-outlet>.
 *
 * Production usage in app.routes.ts would simply call `nexusRoute()` from
 * @bimo-dk/nexus-runtime — that helper produces the same Route shape we
 * generate here.
 */
@Component({
  selector: 'app-routes-demo',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <header>
        <h1>Pattern 1 — Route-based</h1>
        <p>Each component is a real Angular route. Click to navigate; the URL updates and the component loads on first visit (cached thereafter).</p>
        <pre class="snippet">// app.routes.ts
import &#123; nexusRoute &#125; from '&#64;bimo-dk/nexus-runtime';
import &#123; catalog &#125; from './my-catalog';

export const routes: Routes = catalog.map((e) =&gt;
  nexusRoute(&#123; path: \`demos/routes/$&#123;e.expose&#125;\`, remote: e.remote, expose: e.expose &#125;)
);</pre>
      </header>

      <div class="layout">
        <aside>
          <h3>Available routes</h3>
          @for (e of catalog.entries(); track e.remote + ':' + e.expose) {
            <a [routerLink]="['/demos/routes', e.expose]" routerLinkActive="active">
              <span class="title">{{ e.title }}</span>
              <code class="path">{{ e.remote }}/{{ e.expose }}</code>
            </a>
          } @empty {
            <p class="empty">Catalog empty — start a remote with &#64;NexusComponent metadata.</p>
          }
        </aside>
        <main>
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; max-width: 1280px; margin: 0 auto; }
    header { margin-bottom: 16px; }
    header h1 { margin: 0; font-size: 22px; color: #0f172a; }
    header p { margin: 4px 0 16px; font-size: 13px; color: #64748b; }
    .snippet { background: #0f172a; color: #cbd5e1; padding: 12px 16px; border-radius: 8px; font-family: monospace; font-size: 12px; overflow: auto; }
    .layout { display: grid; grid-template-columns: 280px 1fr; gap: 16px; min-height: 480px; }
    aside { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; overflow: auto; max-height: 600px; }
    aside h3 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.6px; color: #64748b; }
    aside a { display: block; padding: 8px 10px; border-radius: 6px; text-decoration: none; color: #0f172a; font-size: 13px; margin-bottom: 2px; }
    aside a:hover { background: #e2e8f0; text-decoration: none; }
    aside a.active { background: #eef2ff; color: #4338ca; font-weight: 600; }
    aside a .title { display: block; }
    aside a .path { display: block; font-family: monospace; font-size: 10px; color: #94a3b8; font-weight: 400; margin-top: 2px; }
    aside .empty { padding: 16px; color: #94a3b8; font-size: 12px; font-style: italic; }
    main { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; }
  `],
})
export class RoutesDemoComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly loader = inject(ComponentLoaderService);
  readonly catalog = inject(CatalogService);

  ngOnInit(): void {
    // Register one lazy CHILD route per catalog entry on the parent
    // `demos/routes` route — so they render inside this component's
    // <router-outlet />, beside the sidebar.
    const entries = this.catalog.entries();
    const children: Routes = entries.map((e: CatalogEntry) => ({
      path: e.expose,
      loadComponent: () => this.loader.loadComponent(e.remote, e.expose),
    }));

    // Find the existing 'demos/routes' parent, mutate its children, then
    // call resetConfig so Angular picks up the new child routes.
    const updated = this.router.config.map((r) =>
      r.path === 'demos/routes' ? { ...r, children } : r,
    );
    this.router.resetConfig(updated);
  }
}
