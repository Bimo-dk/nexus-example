import {
  ChangeDetectionStrategy,
  Component,
  Type,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ComponentLoaderService } from './component-loader.local';

/**
 * LOCAL copy of `<nexus-component>` — the simplest possible way to render
 * a federated component. Drop the tag anywhere in a template:
 *
 *   <nexus-component remote="remoteOne" expose="MetricCard" />
 *
 * With inputs:
 *
 *   <nexus-component
 *     remote="remoteOne"
 *     expose="MetricCard"
 *     [inputs]="{ label: 'Active users', value: '12k' }" />
 *
 * The tag handles fetching, caching, loading state and errors so consumers
 * don't have to touch loadRemoteModule, NgComponentOutlet, or signals.
 *
 * This will move into `@bimo-dk/nexus-runtime` (>=0.2.0) — once that ships
 * delete this file and `import { NexusComponent } from '@bimo-dk/nexus-runtime'`.
 */
@Component({
  selector: 'nexus-component',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (state()) {
      @case ('loaded') {
        <ng-container *ngComponentOutlet="loaded()!; inputs: inputs()" />
      }
      @case ('error') {
        <div class="nx-error">⚠ Failed to load {{ remote() }}/{{ expose() }}: {{ error() }}</div>
      }
      @default {
        <div class="nx-loading">Loading {{ expose() }}...</div>
      }
    }
  `,
  styles: [`
    :host { display: block; }
    .nx-loading { padding: 16px; text-align: center; color: #94a3b8; font-size: 13px; font-style: italic; }
    .nx-error { padding: 12px; background: #fee2e2; color: #991b1b; border-radius: 6px; font-size: 12px; font-family: monospace; }
  `],
})
export class NexusComponent {
  private readonly loader = inject(ComponentLoaderService);

  readonly remote = input.required<string>();
  readonly expose = input.required<string>();
  readonly inputs = input<Record<string, unknown>>({});

  readonly loaded = signal<Type<unknown> | null>(null);
  readonly error = signal<string | null>(null);
  readonly state = computed<'loading' | 'loaded' | 'error'>(() => {
    if (this.error()) return 'error';
    if (this.loaded()) return 'loaded';
    return 'loading';
  });

  constructor() {
    effect(() => {
      const r = this.remote();
      const e = this.expose();
      this.fetch(r, e);
    });
  }

  private async fetch(remote: string, expose: string): Promise<void> {
    this.loaded.set(null);
    this.error.set(null);
    try {
      const cmp = await this.loader.loadComponent(remote, expose);
      this.loaded.set(cmp);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    }
  }
}
