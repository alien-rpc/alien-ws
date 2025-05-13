# alien-ws/bun

1. Install the dependencies:

```sh
bun add alien-ws @hattip/adapter-bun alien-middleware
```

2. Create the adapter and use its handler and `websocket` property:

```ts
import { chain } from 'alien-middleware'
import { createWebSocketAdapter } from 'alien-ws/bun'
import bunAdapter from '@hattip/adapter-bun'
import httpHandler from './http-handler.ts'

const ws = createWebSocketAdapter({
  // See https://crossws.unjs.io/guide/hooks
  hooks: { … },
})

export default bunAdapter(chain().use(ws.handler).use(httpHandler), {
  websocket: ws.websocket,
})
```

3. Refer to [this guide](https://crossws.unjs.io/guide/hooks) for the available hooks.

### Peer context

Every hook (except `upgrade`) receives a [peer](https://crossws.unjs.io/guide/peer) as its first argument.

Each peer has a `context` property that contains the Hattip context, which your Hattip middlewares can define new properties on.

The following properties are always available on `peer.context`:

- `url: URL` The URL that facilitated the WebSocket upgrade.
- `env: (name: string) => string` A function to access environment variables in a platform-agnostic way.
- `locals: Record<string, unknown>` A mutable object that can be used to store data for the duration of the WebSocket connection.
- `platform: BunPlatformInfo`
  - `name: "bun"`
  - `server: Server` The Bun server instance.

### WebSocketAdapter API

The adapter returned by the `createWebSocketAdapter` function has the following properties:

- `peers`: A set of all connected [peers](https://crossws.unjs.io/guide/peer).
- `publish`: A function to publish messages to all connected peers.

The `publish` function accepts the following arguments:

- `topic`: The topic to publish the message to.
- `message`: The message to publish.
- `options`: An object containing the following properties:
  - `compress`: Whether to compress the message.
