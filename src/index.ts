import { Hooks, Peer, ResolveHooks } from './core.js'

export * from './core.js'

export interface WebSocketAdapterOptions<
  TContext extends object = any,
  TRequest extends object = any,
  TResponse extends object = any,
> {
  resolve?: ResolveHooks<TContext, TRequest, TResponse>
  hooks?: Partial<Hooks<TContext, TRequest, TResponse>>
}

export interface WebSocketAdapter<TContext extends object = any> {
  readonly peers: Set<Peer<TContext>>
  readonly publish: Peer<TContext>['publish']
}

export type WebSocketAdapterFactory<TContext extends object = any> = (
  options?: WebSocketAdapterOptions<TContext>
) => WebSocketAdapter<TContext>
