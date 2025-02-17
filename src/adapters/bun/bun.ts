import { BunPlatformInfo } from '@hattip/adapter-bun'
import { RequestHandler } from '@hattip/compose'
import crossws, { BunAdapter, BunOptions } from 'crossws/adapters/bun'

export * from '../../core.js'

export interface WebSocketAdapterOptions extends BunOptions {}

export interface WebSocketAdapter extends Omit<BunAdapter, 'handleUpgrade'> {
  handler: RequestHandler<BunPlatformInfo>
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
  const { handleUpgrade, ...context } = crossws(options)

  return {
    ...context,
    handler: ({ request, platform, next }) => {
      if (request.headers.get('upgrade') === 'websocket') {
        return handleUpgrade(request, platform.server)
      }
      return next()
    },
  }
}

export default createWebSocketAdapter
