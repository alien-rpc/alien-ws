# alien-ws/node

1. Install the dependencies:

```sh
pnpm add alien-ws @hattip/adapter-node alien-middleware
```

2. Create the adapter and use its handler and `configureServer` method:

```ts
import { chain } from 'alien-middleware'
import { createServer } from '@hattip/adapter-node'
import { createWebSocketAdapter } from 'alien-ws/node'
import httpHandler from './http-handler.ts'

const ws = createWebSocketAdapter({
  // See https://crossws.unjs.io/guide/hooks
  hooks: { … },
})

const server = createServer(chain().use(httpHandler).use(ws.handler))
ws.configureServer(server)

export default server
```

3. Refer to [this guide](https://crossws.unjs.io/guide/hooks) for the available hooks.

### Peer context

Every hook (except `upgrade`) receives a [peer](https://crossws.unjs.io/guide/peer) as its first argument.

Each peer has a `context` property that contains the Hattip context, which your Hattip middlewares can define new properties on.

The following properties are always available on `peer.context`:

- `url: URL` The URL that facilitated the WebSocket upgrade.
- `env: (name: string) => string` A function to access environment variables in a platform-agnostic way.
- `locals: Record<string, unknown>` A mutable object that can be used to store data for the duration of the WebSocket connection.
- `platform: NodePlatformInfo`
  - `name: "node"`
  - `request: http.IncomingMessage` The Node.js HTTP request object.
  - `response: http.ServerResponse` The Node.js HTTP response object.

### WebSocketAdapter API

The adapter returned by the `createWebSocketAdapter` function has the following properties:

- `peers`: A set of all connected [peers](https://crossws.unjs.io/guide/peer).
- `publish`: A function to publish messages to all connected peers.

The `publish` function accepts the following arguments:

- `topic`: The topic to publish the message to.
- `message`: The message to publish.
- `options`: An object containing the following properties:
  - `compress`: Whether to compress the message.
