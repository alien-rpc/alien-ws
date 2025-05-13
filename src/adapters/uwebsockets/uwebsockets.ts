/// <reference types="uws" />
import type {
  UWebSocketAdapterOptions,
  UWebSocketPlatformInfo,
} from '@hattip/adapter-uwebsockets'
import { RequestContext } from 'alien-middleware'
import crossws, { UWSOptions } from 'crossws/adapters/uws'
import type {
  WebSocketAdapter as Adapter,
  WebSocketAdapterOptions as AdapterOptions,
} from '../../index.js'

export * from '../../core.js'

type HttpRequest = UWebSocketPlatformInfo['request']
type HttpResponse = UWebSocketPlatformInfo['response']

export interface WebSocketAdapterOptions<
  TEnv extends object = any,
  TProperties extends object = never,
> extends Omit<UWSOptions, keyof AdapterOptions>,
    AdapterOptions<
      RequestContext<TEnv, TProperties, UWebSocketPlatformInfo>,
      HttpRequest,
      HttpResponse
    > {}

export interface WebSocketAdapter<
  TEnv extends object = any,
  TProperties extends object = never,
> extends Adapter<
    RequestContext<TEnv, TProperties, UWebSocketPlatformInfo>,
    HttpRequest,
    HttpResponse
  > {
  configureServer: UWebSocketAdapterOptions['configureServer']
}

/**
 * Call this factory function to get an adapter instance. Then pass its
 * `websocket` property into your UWS app like this:
 *
 * ```ts
 * import { createServer } from '@hattip/adapter-uwebsockets'
 * import { createWebSocketAdapter } from 'alien-ws/uwebsockets'
 * import httpHandler from './http-handler.ts'
 *
 * const ws = createWebSocketAdapter({
 *   hooks: { … },
 * })
 *
 * export default createServer(httpHandler, {
 *   configureServer: ws.configureServer,
 * })
 * ```
 */
export function createWebSocketAdapter<
  TEnv extends object = any,
  TProperties extends object = never,
>(
  options?: WebSocketAdapterOptions<TEnv, TProperties>
): WebSocketAdapter<TEnv, TProperties> {
  const { websocket, ...adapter } = crossws(options as UWSOptions)

  return {
    ...(adapter as WebSocketAdapter<TEnv, TProperties>),
    configureServer(app) {
      app.ws('/*', websocket)
    },
  }
}
