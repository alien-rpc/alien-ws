/// <reference types="deno/full" />
import type { DenoPlatformInfo } from '@hattip/adapter-deno'
import { RequestContext } from 'alien-middleware'
import crossws, { DenoOptions } from 'crossws/adapters/deno'
import { forwardHattipContext, RequestHandler } from '../../common.js'
import type {
  WebSocketAdapter as Adapter,
  WebSocketAdapterOptions as AdapterOptions,
} from '../../index.js'

export * from '../../core.js'

type PlatformInfo = DenoPlatformInfo<Deno.ServeHandlerInfo>

export interface WebSocketAdapterOptions<
  TEnv extends object = any,
  TProperties extends object = never,
> extends Omit<DenoOptions, keyof AdapterOptions>,
    AdapterOptions<
      RequestContext<TEnv, TProperties, PlatformInfo>,
      Request,
      Response
    > {}

export interface WebSocketAdapter<
  TEnv extends object = any,
  TProperties extends object = never,
> extends Adapter<
    RequestContext<TEnv, TProperties, PlatformInfo>,
    Request,
    Response
  > {
  handler: RequestHandler<TEnv, TProperties, PlatformInfo, Response>
}

/**
 * Call this factory function to get an adapter instance. Then pass its
 * `handler` property into your Deno server like this:
 * ```ts
 * import { compose } from 'npm:alien-middleware'
 * import { createWebSocketAdapter } from 'npm:alien-ws/deno'
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
export function createWebSocketAdapter<
  TEnv extends object = {},
  TProperties extends object = never,
>(
  options?: WebSocketAdapterOptions<TEnv, TProperties>
): WebSocketAdapter<TEnv, TProperties> {
  const { handleUpgrade, ...adapter } = crossws(options as DenoOptions)

  return {
    ...(adapter as WebSocketAdapter<TEnv, TProperties>),
    handler: context => {
      const { request, platform } = context
      if (request.headers.get('upgrade') === 'websocket') {
        forwardHattipContext(request, context)
        return handleUpgrade(request, platform.info as any)
      }
    },
  }
}

export default createWebSocketAdapter
