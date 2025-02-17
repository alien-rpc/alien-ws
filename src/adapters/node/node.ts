/// <reference types="node" />
import type { NodePlatformInfo } from '@hattip/adapter-node'
import type { RequestContext, RequestHandler } from '@hattip/compose'
import crossws, { NodeAdapter, NodeOptions } from 'crossws/adapters/node'
import * as http from 'node:http'
import { forwardHattipContext, interceptUpgrade } from '../../common.js'
import type {
  WebSocketAdapter as Adapter,
  WebSocketAdapterOptions as AdapterOptions,
} from '../../index.js'

export * from '../../core.js'

export interface WebSocketAdapterOptions
  extends Omit<NodeOptions, keyof AdapterOptions>,
    AdapterOptions<NodePlatformInfo> {}

export interface WebSocketAdapter extends Adapter<NodePlatformInfo> {
  handler: RequestHandler<NodePlatformInfo>
  configureServer: (server: http.Server) => void
  closeAll: NodeAdapter['closeAll']
}

/**
 * Call this factory function to get an adapter instance. Then call its
 * `configureServer` method with your HTTP server like this:
 * ```ts
 * import { compose } from '@hattip/compose'
 * import { createServer } from '@hattip/adapter-node'
 * import { createWebSocketAdapter } from 'hattip-ws/node'
 * import httpHandler from './http-handler.ts'
 *
 * const ws = createWebSocketAdapter({
 *   hooks: { … },
 * })
 *
 * const server = createServer(compose(httpHandler, ws.handler))
 * ws.configureServer(server)
 * ```
 */
export function createWebSocketAdapter(
  options?: WebSocketAdapterOptions
): WebSocketAdapter {
  const upgradeRequests = new WeakMap<http.IncomingMessage, Buffer>()
  let upgradedContext: RequestContext | undefined

  const { handleUpgrade, ...adapter } = crossws(
    interceptUpgrade(options, request => {
      forwardHattipContext(request, upgradedContext!)
      upgradedContext = undefined
    }) as any
  )

  return {
    ...(adapter as WebSocketAdapter),
    handler: context => {
      const { request } = context.platform
      const head = upgradeRequests.get(request)
      if (head) {
        upgradeRequests.delete(request)
        upgradedContext = context
        return handleUpgrade(request, request.socket, head)
      }
      return context.next()
    },
    configureServer(server) {
      server.on('upgrade', (request, _socket, head) => {
        if (request.headers.upgrade === 'websocket') {
          upgradeRequests.set(request, head)

          // Forward the upgrade request to the Hattip handler.
          const response = new http.ServerResponse(request)
          server.emit('request', request, response)
        }
      })
    },
  }
}
