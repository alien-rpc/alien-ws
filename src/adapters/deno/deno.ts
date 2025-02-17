/// <reference types="deno/ns" />
import { DenoPlatformInfo } from '@hattip/adapter-deno'
import { RequestHandler } from '@hattip/compose'
import crossws, { DenoAdapter, DenoOptions } from 'crossws/adapters/deno'

export interface WebSocketAdapterOptions extends DenoOptions {}

export interface WebSocketAdapter extends Omit<DenoAdapter, 'handleUpgrade'> {
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
  const { handleUpgrade, ...context } = crossws(options)

  return {
    ...context,
    handler: ({ request, platform, next }) => {
      if (request.headers.get('upgrade') === 'websocket') {
        return handleUpgrade(request, platform.info as any)
      }
      return next()
    },
  }
}

export default createWebSocketAdapter
