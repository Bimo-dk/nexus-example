// LOCAL copy of @bimo-dk/nexus-runtime's USER_CONTEXT primitives. Will be
// replaced by the package import once nexus-runtime@>=0.2.0 is published.

import { InjectionToken, signal, type Signal } from '@angular/core';

export interface UserContext {
  id: string;
  name: string;
  email?: string;
  roles: readonly string[];
  claims?: Readonly<Record<string, unknown>>;
}

export const USER_CONTEXT = new InjectionToken<Signal<UserContext | null>>('USER_CONTEXT');

// TEMPORARY WORKAROUND: until @bimo-dk/nexus-runtime ships USER_CONTEXT and is
// federation-shared, each bundle has its own InjectionToken object identity →
// `inject(USER_CONTEXT)` in a remote can't see what the host provided. We bridge
// via globalThis so a federated remote's `getUserSignal()` returns the same
// signal the host registered.
const g = globalThis as Record<string, unknown>;
const KEY = '__nexus_user_signal__';
const NULL_USER: Signal<UserContext | null> = signal(null).asReadonly();

export function setUserSignal(s: Signal<UserContext | null>): void {
  g[KEY] = s;
}

export function getUserSignal(): Signal<UserContext | null> {
  return (g[KEY] as Signal<UserContext | null> | undefined) ?? NULL_USER;
}

export function userHasAnyRole(user: UserContext | null, required: readonly string[]): boolean {
  if (!user) return false;
  if (required.length === 0) return true;
  return required.some((r) => user.roles.includes(r));
}
