# hattip-ws/cloudflare-workers

1. Install the dependencies:

```sh
pnpm add hattip-ws @hattip/adapter-cloudflare-workers @hattip/compose
```

2. Create the adapter and use its handler:

```ts
import { compose } from '@hattip/compose'
import { createWebSocketAdapter } from 'hattip-ws/cloudflare-workers'
import cloudflareAdapter from '@hattip/adapter-cloudflare-workers'
import httpHandler from './http-handler.ts'

const ws = createWebSocketAdapter({
  // See https://crossws.unjs.io/guide/hooks
  hooks: { … },
})

export default {
  fetch: cloudflareAdapter(compose(ws.handler, httpHandler)),
}
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
