import { Injectable, Type, inject } from '@angular/core';
import { LocalNexusService } from '../local-nexus.service';

/**
 * Cached loader for arbitrary exposed modules on a registered remote.
 * Thin wrapper over LocalNexusService.loadExposed with per-(remote,expose) caching.
 *
 * Previously imported DynamicNexusService from @bimo-dk/nexus-runtime, but that
 * package is bundled with tsup (no Angular partial compilation) which makes
 * Angular's AOT pipeline fall back to JIT at runtime ("JIT compiler unavailable").
 * LocalNexusService is inlined into the host so the host's ngc handles it.
 */
@Injectable({ providedIn: 'root' })
export class ComponentLoaderService {
  private readonly nexus = inject(LocalNexusService);
  private readonly cache = new Map<string, Promise<Type<unknown>>>();

  loadComponent(remoteName: string, exposeAs: string): Promise<Type<unknown>> {
    const key = `${remoteName}::${exposeAs}`;
    const existing = this.cache.get(key);
    if (existing) return existing;
    const promise = this.nexus.loadExposed(remoteName, exposeAs);
    this.cache.set(key, promise);
    return promise;
  }
}
