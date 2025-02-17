import { Hooks, Peer, ResolveHooks } from './core.js'

export * from './core.js'

export interface WebSocketAdapterOptions<P = unknown> {
  resolve?: ResolveHooks<P>
  hooks?: Partial<Hooks<P>>
}

export interface WebSocketAdapter<P = unknown> {
  readonly peers: Set<Peer<P>>
  readonly publish: Peer<P>['publish']
}

export type WebSocketAdapterFactory<P = unknown> = (
  options?: WebSocketAdapterOptions<P>
) => WebSocketAdapter<P>
