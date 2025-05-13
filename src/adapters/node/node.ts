/// <reference types="node" />
import type { NodePlatformInfo } from '@hattip/adapter-node'
import { RequestContext } from 'alien-middleware'
import crossws, { NodeAdapter, NodeOptions } from 'crossws/adapters/node'
import * as http from 'node:http'
import {
  forwardHattipContext,
  interceptUpgrade,
  RequestHandler,
} from '../../common.js'
import type {
  WebSocketAdapter as Adapter,
  WebSocketAdapterOptions as AdapterOptions,
} from '../../index.js'

export * from '../../core.js'

export interface WebSocketAdapterOptions<
  TEnv extends object = any,
  TProperties extends object = never,
> extends Omit<NodeOptions, keyof AdapterOptions>,
    AdapterOptions<
      RequestContext<TEnv, TProperties, NodePlatformInfo>,
      Request,
      Response
    > {}

export interface WebSocketAdapter<
  TEnv extends object = any,
  TProperties extends object = never,
> extends Adapter<RequestContext<TEnv, TProperties, NodePlatformInfo>> {
  handler: RequestHandler<TEnv, TProperties, NodePlatformInfo, Response>
  configureServer: (server: http.Server) => void
  closeAll: NodeAdapter['closeAll']
}

/**
 * Call this factory function to get an adapter instance. Then call its
 * `configureServer` method with your HTTP server like this:
 * ```ts
 * import { compose } from 'alien-middleware'
 * import { createServer } from '@hattip/adapter-node'
 * import { createWebSocketAdapter } from 'alien-ws/node'
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
export function createWebSocketAdapter<
  TEnv extends object = {},
  TProperties extends object = never,
>(
  options?: WebSocketAdapterOptions<TEnv, TProperties>
): WebSocketAdapter<TEnv, TProperties> {
  const upgradeRequests = new WeakMap<http.IncomingMessage, Buffer>()
  let upgradedContext: RequestContext | undefined

  const { handleUpgrade, ...adapter } = crossws(
    interceptUpgrade(options, request => {
      forwardHattipContext(request, upgradedContext!)
      upgradedContext = undefined
    }) as NodeOptions
  )

  return {
    ...(adapter as WebSocketAdapter<TEnv, TProperties>),
    handler: context => {
      const { request } = context.platform
      const head = upgradeRequests.get(request)
      if (head) {
        upgradeRequests.delete(request)
        upgradedContext = context
        return handleUpgrade(request, request.socket, head)
      }
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
