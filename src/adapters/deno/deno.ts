/// <reference types="deno/ns" />
import type { DenoPlatformInfo } from '@hattip/adapter-deno'
import type { RequestHandler } from '@hattip/compose'
import crossws, { DenoOptions } from 'crossws/adapters/deno'
import { forwardHattipContext } from '../../common.js'
import type {
  WebSocketAdapter as Adapter,
  WebSocketAdapterOptions as AdapterOptions,
} from '../../index.js'

export * from '../../core.js'

export interface WebSocketAdapterOptions
  extends Omit<DenoOptions, keyof AdapterOptions>,
    AdapterOptions {}

export interface WebSocketAdapter extends Adapter {
  handler: RequestHandler<DenoPlatformInfo<Deno.ServeHandlerInfo>>
}

/**
 * Call this factory function to get an adapter instance. Then pass its
 * `handler` property into your Deno server like this:
 * ```ts
 * import { compose } from 'npm:@hattip/compose'
 * import { createWebSocketAdapter } from 'npm:hattip-ws/deno'
 * import { createServeHandler } from 'npm:@hattip/adapter-deno'
 * import httpHandler from './http-handler.ts'
 *
 * const ws = createWebSocketAdapter({
 *   hooks: { … },
 * })
 *
 * Deno.serve(createServeHandler(compose(ws.handler, httpHandler)))
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
        return handleUpgrade(request, platform.info as any)
      }
      return next()
    },
  }
}

export default createWebSocketAdapter
