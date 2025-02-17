/// <reference types="@cloudflare/workers-types" />
import { CloudflareWorkersPlatformInfo } from '@hattip/adapter-cloudflare-workers'
import { RequestHandler } from '@hattip/compose'
import crossws, {
  CloudflareAdapter,
  CloudflareOptions,
} from 'crossws/adapters/cloudflare'

export interface WebSocketAdapterOptions extends CloudflareOptions {}

export interface WebSocketAdapter
  extends Omit<CloudflareAdapter, 'handleUpgrade'> {
  handler: RequestHandler<CloudflareWorkersPlatformInfo>
}

/**
 * Call this factory function to get an adapter instance. Then pass its
 * `handler` property into your Cloudflare Workers app like this:
 *
 * ```ts
 * import { compose } from '@hattip/compose'
 * import { createWebSocketAdapter } from 'hattip-ws/cloudflare-workers'
 * import cloudflareAdapter from '@hattip/adapter-cloudflare-workers'
 * import httpHandler from './http-handler.ts'
 *
 * const ws = createWebSocketAdapter({
 *   hooks: { … },
 * })
 *
 * export default {
 *   fetch: cloudflareAdapter(compose(ws.handler, httpHandler)),
 * }
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
        return handleUpgrade(request, platform.env, platform.context) as any
      }
      return next()
    },
  }
}
