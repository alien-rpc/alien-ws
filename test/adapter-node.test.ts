import { createServer, NodePlatformInfo } from '@hattip/adapter-node'
import { chain } from 'alien-middleware'
import * as http from 'node:http'
import { AddressInfo } from 'node:net'
import {
  createWebSocketAdapter,
  Message,
  Peer,
} from '../src/adapters/node/node.js'
import { RequestHandler } from '../src/common.js'

let server: http.Server
afterEach(() => {
  server?.close()
})

type NodeHandler = RequestHandler<{}, never, NodePlatformInfo, Response>

test('node adapter', async () => {
  const handler = vi.fn<NodeHandler>()

  const onOpen = vi.fn()
  const onMessage = vi.fn()
  const onClose = vi.fn()

  const wss = createWebSocketAdapter({
    hooks: {
      open: onOpen,
      message: onMessage,
      close: onClose,
    },
  })

  server = createServer(
    chain<{}, {}, NodePlatformInfo>().use(handler).use(wss.handler)
  )
  wss.configureServer(server)

  await new Promise<void>(resolve => server.listen(resolve))

  const addr = server.address() as AddressInfo
  const ws = new WebSocket(`ws://localhost:${addr.port}`)

  await new Promise<Event>(resolve => {
    ws.onopen = resolve
  })

  expect(onOpen).toHaveBeenCalled()

  const PeerContext = {
    env: expect.any(Function),
    platform: {
      name: 'node',
      request: expect.any(http.IncomingMessage),
      response: expect.any(http.ServerResponse),
    },
    url: expect.any(URL),
    locals: expect.any(Object),
  }

  const Peer = {
    context: PeerContext,
  }

  const peer = onOpen.mock.calls[0][0] as [Peer<NodePlatformInfo>]
  expect(peer).toMatchObject(Peer)

  ws.send('hello')
  await new Promise<void>(resolve => {
    onMessage.mockImplementationOnce(resolve)
  })

  expect(onMessage).toHaveBeenCalledWith(peer, expect.any(Object))

  const message = onMessage.mock.calls[0][1] as Message
  expect(message.text()).toBe('hello')

  ws.close()
  await new Promise<void>(resolve => {
    onClose.mockImplementationOnce(resolve)
  })

  expect(onClose).toHaveBeenCalledWith(peer, {
    code: 1005,
    reason: '',
  })
})
