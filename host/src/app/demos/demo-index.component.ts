import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from './catalog.local.service';

@Component({
  selector: 'app-demo-index',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <header>
        <h1>Loading patterns for federated components</h1>
        <p>Three idiomatic ways to consume Bimo-Nexus remote components from inside the host. Each demo loads the same catalog — no hardcoded component lists.</p>
        <p class="info">{{ catalog.entries().length }} components discovered across {{ catalog.entries().length > 0 ? 'all registered remotes' : '0 remotes' }}.</p>
      </header>

      <div class="grid">
        <a routerLink="/demos/routes" class="card">
          <div class="head">
            <span class="badge">Pattern 1</span>
            <span class="material">route</span>
          </div>
          <h2>Route-based</h2>
          <p>Each federated component is wired into <code>app.routes.ts</code> via <code>nexusRoute()</code> and reached by URL.</p>
          <code class="snippet">nexusRoute(&#123; path: 'cart', remote: 'shop', expose: 'Cart' &#125;)</code>
        </a>

        <a routerLink="/demos/manual" class="card">
          <div class="head">
            <span class="badge">Pattern 2</span>
            <span class="material">code</span>
          </div>
          <h2>Programmatic</h2>
          <p>Single page injects <code>ComponentLoaderService</code> and renders into a slot when the user picks one from the catalog.</p>
          <code class="snippet">loader.loadComponent('shop', 'Cart')</code>
        </a>

        <a routerLink="/demos/tag" class="card">
          <div class="head">
            <span class="badge">Pattern 3</span>
            <span class="material">tag</span>
          </div>
          <h2>Drop-in tag</h2>
          <p>Use <code>&lt;nexus-component&gt;</code> in any template — zero code in the consumer beyond markup.</p>
          <code class="snippet">&lt;nexus-component remote="shop" expose="Cart" /&gt;</code>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; max-width: 1200px; margin: 0 auto; }
    header { margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #e2e8f0; }
    header h1 { margin: 0; font-size: 24px; color: #0f172a; }
    header p { margin: 6px 0 0; font-size: 14px; color: #64748b; max-width: 720px; }
    header p.info { font-size: 12px; color: #94a3b8; margin-top: 12px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .card {
      display: flex; flex-direction: column; gap: 8px;
      padding: 20px; background: white; border: 1px solid #e2e8f0; border-radius: 12px;
      text-decoration: none; color: inherit;
      transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
    }
    .card:hover { border-color: #6366f1; transform: translateY(-2px); box-shadow: 0 8px 16px rgba(99,102,241,0.1); }
    .head { display: flex; justify-content: space-between; align-items: center; }
    .badge { background: #eef2ff; color: #4338ca; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .material { font-family: monospace; color: #94a3b8; font-size: 11px; }
    .card h2 { margin: 0; font-size: 18px; color: #0f172a; }
    .card p { margin: 0; font-size: 13px; color: #475569; line-height: 1.5; flex: 1; }
    .card p code { background: #f1f5f9; padding: 1px 6px; border-radius: 4px; font-size: 12px; }
    .snippet { background: #0f172a; color: #cbd5e1; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 11px; white-space: pre-wrap; word-break: break-all; }
  `],
})
export class DemoIndexComponent {
  readonly catalog = inject(CatalogService);
}
