import { Hooks, Peer, ResolveHooks } from './core.js'

export * from './core.js'

export interface WebSocketAdapterOptions<
  TPlatform = unknown,
  TRequest extends object = any,
  TResponse extends object = any,
> {
  resolve?: ResolveHooks<TPlatform, TRequest, TResponse>
  hooks?: Partial<Hooks<TPlatform, TRequest, TResponse>>
}

export interface WebSocketAdapter<P = unknown> {
  readonly peers: Set<Peer<P>>
  readonly publish: Peer<P>['publish']
}

export type WebSocketAdapterFactory<P = unknown> = (
  options?: WebSocketAdapterOptions<P>
) => WebSocketAdapter<P>
