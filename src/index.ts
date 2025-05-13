import { Hooks, Peer, ResolveHooks } from './core.js'

export * from './core.js'

export interface WebSocketAdapterOptions<
  TContext extends object = any,
  TRequest extends object = any,
  TResponse extends object = any,
> {
  /**
   * Provide lifecycle hooks that are specific to each WebSocket
   * connection.
   */
  resolve?: ResolveHooks<TContext, TRequest, TResponse>
  /**
   * Hook into the lifecycle of every WebSocket connection.
   */
  hooks?: Partial<Hooks<TContext, TRequest, TResponse>>
}

export interface WebSocketAdapter<
  TContext extends object = any,
  TRequest extends object = any,
  TResponse extends object = any,
> {
  /** Doesn't exist at runtime. Used for type inference. */
  readonly $WebSocketAdapter?: {
    context: TContext
    request: TRequest
    response: TResponse
  }
  readonly peers: Set<Peer<TContext>>
  readonly publish: Peer<TContext>['publish']
}

export type WebSocketAdapterFactory<
  TContext extends object = any,
  TRequest extends object = any,
  TResponse extends object = any,
> = (
  options?: WebSocketAdapterOptions<TContext, TRequest, TResponse>
) => WebSocketAdapter<TContext, TRequest, TResponse>

/**
 * Extract the `Hooks` type from a `WebSocketAdapter` instance.
 */
export type ExtractHooks<TAdapter extends WebSocketAdapter> =
  TAdapter['$WebSocketAdapter'] extends
    | {
        context: infer TContext extends object
        request: infer TRequest extends object
        response: infer TResponse extends object
      }
    | undefined
    ? Hooks<TContext, TRequest, TResponse>
    : never
