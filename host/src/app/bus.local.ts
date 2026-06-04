// LOCAL copy of @bimo-dk/nexus-bus (NexusBus service). Delete this file and
// switch imports to `@bimo-dk/nexus-bus` once that package is published to
// GitHub Packages.

import { Injectable } from '@angular/core';
import { Observable, Subject, filter, map } from 'rxjs';

export interface NexusEvent<T = unknown> {
  topic: string;
  payload: T;
  timestamp: string;
  id: string;
  source?: string;
}

interface NexusRequest<T = unknown> extends NexusEvent<T> {
  __kind: 'request';
}

interface NexusResponse<T = unknown> {
  requestId: string;
  payload: T;
  error?: string;
  __kind: 'response';
}

const RESPONSE_TOPIC_PREFIX = '__nexus_response__:';

function makeId(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function topicMatcher(pattern: string): (topic: string) => boolean {
  if (!pattern.includes('*')) return (t) => t === pattern;
  const re = new RegExp(
    '^' +
      pattern.split('**').map((p) => p.split('*').map(escapeRe).join('[^:]*')).join('.*') +
      '$',
  );
  return (t) => re.test(t);
}

function escapeRe(s: string): string {
  return s.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
}

// TEMPORARY WORKAROUND: until @bimo-dk/nexus-bus is published and federation-
// shared, each remote ships its own copy of this file → its own NexusBus class
// → its own DI singleton. To make events actually cross-component, all
// instances delegate to ONE Subject + Map on globalThis.
const g = globalThis as Record<string, unknown>;
if (!g['__nexus_bus_stream__']) g['__nexus_bus_stream__'] = new Subject<NexusEvent<unknown>>();
if (!g['__nexus_bus_responders__']) g['__nexus_bus_responders__'] = new Map<string, (p: unknown, e: NexusRequest<unknown>) => unknown>();
const sharedStream$ = g['__nexus_bus_stream__'] as Subject<NexusEvent<unknown>>;
const sharedResponders = g['__nexus_bus_responders__'] as Map<string, (p: unknown, e: NexusRequest<unknown>) => unknown>;

@Injectable({ providedIn: 'root' })
export class NexusBus {
  private readonly stream$ = sharedStream$;
  private readonly responders = sharedResponders;

  constructor() {
    // Only wire the request dispatcher once per page — otherwise every remote's
    // NexusBus instance would try to respond.
    if (g['__nexus_bus_dispatcher_wired__']) return;
    g['__nexus_bus_dispatcher_wired__'] = true;
    this.stream$
      .pipe(filter((e): e is NexusRequest<unknown> => (e as NexusRequest).__kind === 'request'))
      .subscribe((req) => {
        const handler = this.responders.get(req.topic);
        if (!handler) return;
        Promise.resolve()
          .then(() => handler(req.payload, req))
          .then((res) => this.emitResponse(req.id, res))
          .catch((err: unknown) => this.emitResponse(req.id, undefined, err));
      });
  }

  on<T = unknown>(topic: string): Observable<NexusEvent<T>> {
    const match = topicMatcher(topic);
    return this.stream$.pipe(
      filter((e): e is NexusEvent<T> => match(e.topic) && (e as NexusRequest).__kind !== 'request'),
    );
  }

  onPayload<T = unknown>(topic: string): Observable<T> {
    return this.on<T>(topic).pipe(map((e) => e.payload));
  }

  publish<T = unknown>(topic: string, payload: T, opts: { source?: string } = {}): string {
    const id = makeId();
    this.stream$.next({
      topic, payload, timestamp: new Date().toISOString(), id, source: opts.source,
    });
    return id;
  }

  request<TReq = unknown, TRes = unknown>(
    topic: string,
    payload: TReq = undefined as TReq,
    opts: { source?: string; timeoutMs?: number } = {},
  ): Promise<TRes> {
    const id = makeId();
    const timeoutMs = opts.timeoutMs ?? 5000;
    const responseTopic = `${RESPONSE_TOPIC_PREFIX}${id}`;
    return new Promise<TRes>((resolve, reject) => {
      const timer = setTimeout(() => {
        sub.unsubscribe();
        reject(new Error(`[nexus-bus] request "${topic}" timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      const sub = this.stream$.pipe(filter((e) => e.topic === responseTopic)).subscribe((e) => {
        clearTimeout(timer);
        sub.unsubscribe();
        const res = e.payload as NexusResponse<TRes>;
        if (res.error) reject(new Error(res.error));
        else resolve(res.payload);
      });
      const req: NexusRequest<TReq> = {
        topic, payload, timestamp: new Date().toISOString(), id, source: opts.source, __kind: 'request',
      };
      this.stream$.next(req as NexusEvent<unknown>);
    });
  }

  respond<TReq = unknown, TRes = unknown>(
    topic: string,
    handler: (payload: TReq, event: NexusRequest<TReq>) => TRes | Promise<TRes>,
  ): () => void {
    this.responders.set(topic, handler as (p: unknown, e: NexusRequest<unknown>) => unknown);
    return () => {
      if (this.responders.get(topic) === (handler as (p: unknown, e: NexusRequest<unknown>) => unknown)) {
        this.responders.delete(topic);
      }
    };
  }

  private emitResponse(requestId: string, payload: unknown, error?: unknown): void {
    const res: NexusResponse = {
      requestId, payload,
      error: error instanceof Error ? error.message : error ? String(error) : undefined,
      __kind: 'response',
    };
    this.stream$.next({
      topic: `${RESPONSE_TOPIC_PREFIX}${requestId}`,
      payload: res,
      timestamp: new Date().toISOString(),
      id: makeId(),
    });
  }
}
