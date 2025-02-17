/// <reference types="node" />
import crossws, { NodeAdapter, NodeOptions } from 'crossws/adapters/node'
import * as http from 'node:http'

export * from '../../core.js'

export interface WebSocketAdapterOptions extends NodeOptions {}

export interface WebSocketAdapter extends Omit<NodeAdapter, 'handleUpgrade'> {
  configureServer: (server: http.Server) => void
}

/**
 * Call this factory function to get an adapter instance. Then call its
 * `configureServer` method with your HTTP server like this:
 * ```ts
 * import { createServer } from '@hattip/adapter-node'
 * import { createWebSocketAdapter } from 'hattip-ws/node'
 * import httpHandler from './http-handler.ts'
 *
 * const ws = createWebSocketAdapter({
 *   hooks: { … },
 * })
 *
 * const server = createServer(httpHandler)
 * ws.configureServer(server)
 * ```
 */
export function createWebSocketAdapter(
  options?: WebSocketAdapterOptions
): WebSocketAdapter {
  const { handleUpgrade, ...context } = crossws(options)

  return {
    ...context,
    configureServer(server) {
      server.on('upgrade', (request, socket, head) => {
        if (request.headers.upgrade === 'websocket') {
          handleUpgrade(request, socket, head)
        }
      })
    },
  }
}
