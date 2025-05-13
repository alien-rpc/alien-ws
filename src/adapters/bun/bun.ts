/// <reference types="bun" />
import type { BunPlatformInfo } from '@hattip/adapter-bun'
import { RequestContext } from 'alien-middleware'
import crossws, { BunAdapter, BunOptions } from 'crossws/adapters/bun'
import { forwardHattipContext, RequestHandler } from '../../common.js'
import type {
  WebSocketAdapter as Adapter,
  WebSocketAdapterOptions as AdapterOptions,
} from '../../index.js'

export * from '../../core.js'

export interface WebSocketAdapterOptions<
  TEnv extends object = any,
  TProperties extends object = never,
> extends Omit<BunOptions, keyof AdapterOptions>,
    AdapterOptions<
      RequestContext<TEnv, TProperties, BunPlatformInfo>,
      Request,
      Response
    > {}

export interface WebSocketAdapter<
  TEnv extends object = any,
  TProperties extends object = never,
> extends Adapter<RequestContext<TEnv, TProperties, BunPlatformInfo>> {
  handler: RequestHandler<TEnv, TProperties, BunPlatformInfo, Response>
  websocket: BunAdapter['websocket']
}

/**
 * Call this factory function to get an adapter instance. Then pass its
 * `handler` and `websocket` properties into your Bun server like this:
 *
 * ```ts
 * import { compose } from 'alien-middleware'
 * import { createWebSocketAdapter } from 'alien-ws/bun'
 * import bunAdapter from '@hattip/adapter-bun'
 * import httpHandler from './http-handler.ts'
 *
 * const ws = createWebSocketAdapter({
 *   hooks: { … },
 * })
 *
 * export default bunAdapter(compose(ws.handler, httpHandler), {
 *   websocket: ws.websocket,
 * })
 * ```
 */
export function createWebSocketAdapter<
  TEnv extends object = {},
  TProperties extends object = never,
>(
  options?: WebSocketAdapterOptions<TEnv, TProperties>
): WebSocketAdapter<TEnv, TProperties> {
  const { handleUpgrade, ...adapter } = crossws(options as BunOptions)

  return {
    ...(adapter as WebSocketAdapter<TEnv, TProperties>),
    handler: context => {
      const { request, platform } = context
      if (request.headers.get('upgrade') === 'websocket') {
        forwardHattipContext(request, context)
        return handleUpgrade(request, platform.server)
      }
    },
  }
}

export default createWebSocketAdapter
