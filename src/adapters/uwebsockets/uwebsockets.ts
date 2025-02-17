import { UWebSocketAdapterOptions } from '@hattip/adapter-uwebsockets'
import crossws, { UWSAdapter, UWSOptions } from 'crossws/adapters/uws'

export interface WebSocketAdapterOptions extends UWSOptions {
  /**
   * The path to the WebSocket endpoint.
   *
   * @default "/*"
   */
  path?: string
}

export interface WebSocketAdapter extends Omit<UWSAdapter, 'websocket'> {
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
  const ws = crossws(options)

  return {
    ...ws,
    configureServer(app) {
      app.ws(options?.path ?? '/*', ws.websocket)
    },
  }
}
