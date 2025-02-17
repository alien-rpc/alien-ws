# hattip-ws/node

1. Install the dependencies:

```sh
pnpm add hattip-ws @hattip/adapter-node @hattip/compose
```

2. Create the adapter and use its handler and `configureServer` method:

```ts
import { compose } from '@hattip/compose'
import { createServer } from '@hattip/adapter-node'
import { createWebSocketAdapter } from 'hattip-ws/node'
import httpHandler from './http-handler.ts'

const ws = createWebSocketAdapter({
  // See https://crossws.unjs.io/guide/hooks
  hooks: { … },
})

const server = createServer(compose(httpHandler, ws.handler))
ws.configureServer(server)

export default server
```

3. Refer to [this guide](https://crossws.unjs.io/guide/hooks) for the available hooks.

### WebSocketAdapter API

The adapter returned by the `createWebSocketAdapter` function has the following properties:

- `peers`: A set of all connected [peers](https://crossws.unjs.io/guide/peer).
- `publish`: A function to publish messages to all connected peers.

The `publish` function accepts the following arguments:

- `topic`: The topic to publish the message to.
- `message`: The message to publish.
- `options`: An object containing the following properties:
  - `compress`: Whether to compress the message.
