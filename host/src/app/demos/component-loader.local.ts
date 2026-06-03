import { Injectable, Type, inject } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { DynamicNexusService } from '@bimo-dk/nexus-runtime';

/**
 * LOCAL copy of the helper for loading arbitrary exposed modules.
 *
 * The intent is to consume this from `@bimo-dk/nexus-runtime`, but it ships
 * here until that package's next version is published (the runtime upstream
 * exports it as ComponentLoaderService in >=0.2.0). When the upstream version
 * is available, replace imports with:
 *
 *   import { ComponentLoaderService } from '@bimo-dk/nexus-runtime';
 *
 * and delete this file.
 */
@Injectable({ providedIn: 'root' })
export class ComponentLoaderService {
  private readonly nexus = inject(DynamicNexusService);
  private readonly cache = new Map<string, Promise<Type<unknown>>>();

  loadComponent(remoteName: string, exposeAs: string): Promise<Type<unknown>> {
    const key = `${remoteName}::${exposeAs}`;
    const existing = this.cache.get(key);
    if (existing) return existing;

    const remote = this.nexus.loadedRemotes().find((r) => r.name === remoteName);
    if (!remote) {
      return Promise.reject(new Error(`[nexus] Remote "${remoteName}" not loaded (not in registry?)`));
    }

    const moduleName = exposeAs.startsWith('./') ? exposeAs : `./${exposeAs}`;
    const promise = loadRemoteModule({ remoteEntry: remote.url, exposedModule: moduleName }).then(
      (mod: Record<string, unknown>) => {
        const cmp = (mod['default'] ?? mod[Object.keys(mod)[0]]) as Type<unknown>;
        if (!cmp) throw new Error(`[nexus] Module "${moduleName}" on "${remoteName}" exposed nothing usable`);
        return cmp;
      },
    );
    this.cache.set(key, promise);
    return promise;
  }
}
