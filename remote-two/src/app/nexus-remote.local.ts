// LOCAL fixed copy of @NexusRemote decorator.
// Inlined here because @bimo-dk/nexus-build@0.1.1 returned the class from its
// decorator, which made Angular's ngc treat it as replaced and strip ivy
// metadata (-> "JIT compiler unavailable" at render time).
//
// nexus-build@0.1.2 ships the fix — once that version is installed in this
// remote, delete this file and revert imports to `@bimo-dk/nexus-build`.
//
// The build-time scanner (nexus-build CLI) detects @NexusRemote(...) calls by
// AST regardless of import source, so federation.config.json keeps working.

const NEXUS_REMOTE_META = Symbol.for('nexus.remote');

export interface NexusRemoteOptions {
  name?: string;
  route?: string;
  exposeAs?: string;
}

export function NexusRemote(options: NexusRemoteOptions = {}): ClassDecorator {
  return ((target: object): void => {
    (target as Record<symbol, unknown>)[NEXUS_REMOTE_META] = options;
  }) as ClassDecorator;
}
