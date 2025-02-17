/// <reference types="bun" />
import type { BunPlatformInfo } from '@hattip/adapter-bun'
import type { RequestHandler } from '@hattip/compose'
import crossws, { BunAdapter, BunOptions } from 'crossws/adapters/bun'
import { forwardHattipContext } from '../../common.js'
import type {
  WebSocketAdapter as Adapter,
  WebSocketAdapterOptions as AdapterOptions,
} from '../../index.js'

export * from '../../core.js'

export interface WebSocketAdapterOptions
  extends Omit<BunOptions, keyof AdapterOptions>,
    AdapterOptions<BunPlatformInfo, Request, Response> {}

export interface WebSocketAdapter extends Adapter<BunPlatformInfo> {
  handler: RequestHandler<BunPlatformInfo>
  websocket: BunAdapter['websocket']
}

/**
 * Call this factory function to get an adapter instance. Then pass its
 * `handler` and `websocket` properties into your Bun server like this:
 *
 * ```ts
 * import { compose } from '@hattip/compose'
 * import { createWebSocketAdapter } from 'hattip-ws/bun'
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
export function createWebSocketAdapter(
  options?: WebSocketAdapterOptions
): WebSocketAdapter {
  const { handleUpgrade, ...adapter } = crossws(options as any)

  return {
    ...(adapter as WebSocketAdapter),
    handler: context => {
      const { request, platform, next } = context
      if (request.headers.get('upgrade') === 'websocket') {
        forwardHattipContext(request, context)
        return handleUpgrade(request, platform.server)
      }
      return next()
    },
  }
}

export default createWebSocketAdapter
