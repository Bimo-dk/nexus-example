import { Injectable, Type, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, type Routes } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { loadRemoteModule } from '@angular-architects/native-federation';

/**
 * MINIMAL local replacement for @bimo-dk/nexus-runtime's host stack.
 *
 * The published runtime package (>=0.1.0) is bundled with tsup which does not
 * run Angular's partial compilation. Consumer ngc/AOT can't generate factories
 * for the package's @Injectable services -> "JIT compiler unavailable" at
 * runtime. Inlining the service into the host's source tree lets the host's
 * ngc/AOT process it normally.
 *
 * Once @bimo-dk/nexus-runtime is republished with ng-packagr, delete this file
 * and switch the host back to provideNexusHost + DynamicNexusService.
 */
export interface RemoteRecord {
  name: string;
  url: string;
  routePath: string;
  exposedModule: string;
  enabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class LocalNexusService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly loadedRemotes = signal<RemoteRecord[]>([]);
  readonly failedRemotes = signal<Map<string, string>>(new Map());
  readonly registryOnline = signal<boolean>(true);

  // Compatibility alias so existing demo components keep working
  readonly remotes = computed(() => this.loadedRemotes());

  async initialize(registryUrl: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ remotes: RemoteRecord[] }>(`${registryUrl.replace(/\/$/, '')}/remotes`),
      );
      const enabled = res.remotes.filter((r) => r.enabled);
      this.registryOnline.set(true);
      this.loadedRemotes.set(enabled);
      await this.registerRoutes(enabled);
    } catch (err) {
      this.registryOnline.set(false);
      console.error('[local-nexus] Registry fetch failed:', err instanceof HttpErrorResponse ? err.status : err);
    }
  }

  private async registerRoutes(remotes: RemoteRecord[]): Promise<void> {
    const cache = new Map<string, Type<unknown>>();
    const newRoutes: Routes = [];
    for (const r of remotes) {
      newRoutes.push({
        path: r.routePath,
        loadComponent: async () => {
          if (cache.has(r.name)) return cache.get(r.name)!;
          try {
            const mod = (await loadRemoteModule({ remoteEntry: r.url, exposedModule: r.exposedModule })) as Record<string, unknown>;
            const cmp = (mod['default'] ?? mod[Object.keys(mod)[0]]) as Type<unknown>;
            cache.set(r.name, cmp);
            return cmp;
          } catch (err) {
            this.failedRemotes.update((m) => {
              const next = new Map(m);
              next.set(r.name, err instanceof Error ? err.message : String(err));
              return next;
            });
            throw err;
          }
        },
      });
    }
    const remotePaths = new Set(newRoutes.map((r) => r.path));
    const existing = this.router.config.filter((r) => !remotePaths.has(r.path) && r.path !== '**');
    this.router.resetConfig([...existing, ...newRoutes, { path: '**', redirectTo: 'dashboard' }]);
  }

  async loadExposed(remoteName: string, exposeAs: string): Promise<Type<unknown>> {
    const remote = this.loadedRemotes().find((r) => r.name === remoteName);
    if (!remote) throw new Error(`[local-nexus] Remote "${remoteName}" not found in registry`);
    const moduleName = exposeAs.startsWith('./') ? exposeAs : `./${exposeAs}`;
    const mod = (await loadRemoteModule({ remoteEntry: remote.url, exposedModule: moduleName })) as Record<string, unknown>;
    const cmp = (mod['default'] ?? mod[Object.keys(mod)[0]]) as Type<unknown>;
    if (!cmp) throw new Error(`[local-nexus] No usable export for ${remoteName}/${moduleName}`);
    return cmp;
  }
}
