/// <reference types="@cloudflare/workers-types" />
import type { CloudflareWorkersPlatformInfo } from '@hattip/adapter-cloudflare-workers'
import type { RequestHandler } from '@hattip/compose'
import crossws, { CloudflareOptions } from 'crossws/adapters/cloudflare'
import type {
  WebSocketAdapter as Adapter,
  WebSocketAdapterOptions as AdapterOptions,
} from '../../index.js'

import { forwardHattipContext } from '../../common.js'

export * from '../../core.js'

export interface WebSocketAdapterOptions
  extends Omit<CloudflareOptions, keyof AdapterOptions>,
    AdapterOptions {}

export interface WebSocketAdapter extends Adapter {
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
  const { handleUpgrade, ...adapter } = crossws(options as any)

  return {
    ...(adapter as WebSocketAdapter),
    handler: context => {
      const { request, platform, next } = context
      if (request.headers.get('upgrade') === 'websocket') {
        forwardHattipContext(request as any, context)
        return handleUpgrade(request, platform.env, platform.context) as any
      }
      return next()
    },
  }
}
