import { Injectable, computed, inject, signal } from '@angular/core';
import { LocalNexusService } from '../local-nexus.service';

// LOCAL mirror of CatalogService from @bimo-dk/nexus-runtime@0.2.0.
// Once that version is published, replace this file with:
//   import { CatalogService } from '@bimo-dk/nexus-runtime';

export type CatalogInputType = 'string' | 'number' | 'boolean' | 'object' | 'array';

export interface CatalogInputSpec {
  type: CatalogInputType;
  default?: unknown;
  description?: string;
  required?: boolean;
  enum?: string[];
}

export interface CatalogEntry {
  remote: string;
  expose: string;
  className: string;
  title: string;
  description?: string;
  category?: string;
  tags: string[];
  icon?: string;
  inputs: Record<string, CatalogInputSpec>;
  experimental: boolean;
}

interface CatalogManifest {
  remote: string;
  generatedAt: string;
  entries: CatalogEntry[];
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly nexus = inject(LocalNexusService);

  readonly entries = signal<CatalogEntry[]>([]);
  readonly loading = signal<boolean>(false);
  readonly errors = signal<Map<string, string>>(new Map());

  readonly categories = computed<string[]>(() => {
    const set = new Set<string>();
    for (const e of this.entries()) if (e.category) set.add(e.category);
    return Array.from(set).sort();
  });

  readonly tags = computed<string[]>(() => {
    const set = new Set<string>();
    for (const e of this.entries()) for (const t of e.tags) set.add(t);
    return Array.from(set).sort();
  });

  async refresh(): Promise<void> {
    this.loading.set(true);
    const errors = new Map<string, string>();
    const collected: CatalogEntry[] = [];
    const remotes = this.nexus.loadedRemotes();

    await Promise.all(remotes.map(async (r) => {
      const url = r.url.replace(/\/remoteEntry\.json([?#].*)?$/, '/catalog.json');
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) { errors.set(r.name, `HTTP ${res.status}`); return; }
        const manifest = (await res.json()) as CatalogManifest;
        for (const entry of manifest.entries) collected.push({ ...entry, remote: r.name });
      } catch (err) {
        errors.set(r.name, err instanceof Error ? err.message : String(err));
      }
    }));

    this.entries.set(collected);
    this.errors.set(errors);
    this.loading.set(false);
  }

  filter(opts: { query?: string; category?: string; tag?: string; remote?: string }): CatalogEntry[] {
    const q = opts.query?.toLowerCase().trim();
    return this.entries().filter((e) => {
      if (opts.remote && e.remote !== opts.remote) return false;
      if (opts.category && e.category !== opts.category) return false;
      if (opts.tag && !e.tags.includes(opts.tag)) return false;
      if (q) {
        const hay = `${e.title} ${e.description ?? ''} ${e.tags.join(' ')} ${e.expose}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }
}
