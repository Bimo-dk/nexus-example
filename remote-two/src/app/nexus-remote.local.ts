// LOCAL copies of @NexusRemote + @NexusComponent decorators.
// Inlined because we haven't published nexus-build@0.2.0 yet (which exports
// both via package). When published, delete this file and revert imports to
// `import { NexusRemote, NexusComponent } from '@bimo-dk/nexus-build'`.
//
// The build-time scanner (nexus-build CLI) detects @NexusRemote(...) and
// @NexusComponent(...) calls by AST regardless of import source, so federation
// config and catalog manifest still get generated correctly.

const NEXUS_REMOTE_META = Symbol.for('nexus.remote');
const NEXUS_COMPONENT_META = Symbol.for('nexus.component');

export interface NexusRemoteOptions {
  name?: string;
  route?: string;
  exposeAs?: string;
}

export type NexusInputType = 'string' | 'number' | 'boolean' | 'object' | 'array';
export interface NexusInputSpec {
  type: NexusInputType;
  default?: unknown;
  description?: string;
  required?: boolean;
  enum?: string[];
}

export interface NexusComponentOptions {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  icon?: string;
  inputs?: Record<string, NexusInputSpec>;
  experimental?: boolean;
}

export function NexusRemote(options: NexusRemoteOptions = {}): ClassDecorator {
  return ((target: object): void => {
    (target as Record<symbol, unknown>)[NEXUS_REMOTE_META] = options;
  }) as ClassDecorator;
}

export function NexusComponent(options: NexusComponentOptions): ClassDecorator {
  return ((target: object): void => {
    (target as Record<symbol, unknown>)[NEXUS_COMPONENT_META] = options;
  }) as ClassDecorator;
}
