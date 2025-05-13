/// <reference types="@cloudflare/workers-types" />
import type { CloudflareWorkersPlatformInfo } from '@hattip/adapter-cloudflare-workers'
import crossws, { CloudflareOptions } from 'crossws/adapters/cloudflare'
import type {
  WebSocketAdapter as Adapter,
  WebSocketAdapterOptions as AdapterOptions,
} from '../../index.js'

import { RequestContext } from 'alien-middleware'
import { forwardHattipContext, RequestHandler } from '../../common.js'

export * from '../../core.js'

export interface WebSocketAdapterOptions<
  TEnv extends object = any,
  TProperties extends object = never,
> extends Omit<CloudflareOptions, keyof AdapterOptions>,
    AdapterOptions<
      RequestContext<TEnv, TProperties, CloudflareWorkersPlatformInfo>,
      Request,
      Response
    > {}

export interface WebSocketAdapter<
  TEnv extends object = any,
  TProperties extends object = never,
> extends Adapter<
    RequestContext<TEnv, TProperties, CloudflareWorkersPlatformInfo>
  > {
  handler: RequestHandler<
    TEnv,
    TProperties,
    CloudflareWorkersPlatformInfo,
    Response
  >
}

/**
 * Call this factory function to get an adapter instance. Then pass its
 * `handler` property into your Cloudflare Workers app like this:
 *
 * ```ts
 * import { compose } from 'alien-middleware'
 * import { createWebSocketAdapter } from 'alien-ws/cloudflare-workers'
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
export function createWebSocketAdapter<
  TEnv extends object = {},
  TProperties extends object = never,
>(
  options?: WebSocketAdapterOptions<TEnv, TProperties>
): WebSocketAdapter<TEnv, TProperties> {
  const { handleUpgrade, ...adapter } = crossws(options as CloudflareOptions)

  return {
    ...(adapter as WebSocketAdapter<TEnv, TProperties>),
    handler: context => {
      const { request, platform } = context
      if (request.headers.get('upgrade') === 'websocket') {
        forwardHattipContext(request, context)
        return handleUpgrade(
          request as any,
          platform.env,
          platform.context
        ) as any
      }
    },
  }
}
