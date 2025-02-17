import { UWebSocketAdapterOptions } from '@hattip/adapter-uwebsockets'
import crossws, { UWSOptions } from 'crossws/adapters/uws'
import type {
  WebSocketAdapter as Adapter,
  WebSocketAdapterOptions as AdapterOptions,
} from '../../index.js'

export * from '../../core.js'

export interface WebSocketAdapterOptions
  extends Omit<UWSOptions, keyof AdapterOptions>,
    AdapterOptions {}

export interface WebSocketAdapter extends Adapter {
  configureServer: UWebSocketAdapterOptions['configureServer']
}

/**
 * Call this factory function to get an adapter instance. Then pass its
 * `websocket` property into your UWS app like this:
 *
 * ```ts
 * import { createServer } from '@hattip/adapter-uwebsockets'
 * import { createWebSocketAdapter } from 'hattip-ws/uwebsockets'
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
export function createWebSocketAdapter(
  options?: WebSocketAdapterOptions
): WebSocketAdapter {
  const { websocket, ...adapter } = crossws(options as any)

  return {
    ...(adapter as WebSocketAdapter),
    configureServer(app) {
      app.ws('/*', websocket)
    },
  }
}
