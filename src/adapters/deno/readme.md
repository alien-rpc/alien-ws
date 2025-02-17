# hattip-ws/deno

1. Install the dependencies:

```sh
deno install npm:hattip-ws npm:@hattip/adapter-deno npm:@hattip/compose
```

2. Create the adapter and use its handler:

```ts
import { compose } from 'npm:@hattip/compose'
import { createWebSocketAdapter } from 'npm:hattip-ws/deno'
import { createServeHandler } from 'npm:@hattip/adapter-deno'
import httpHandler from './http-handler.ts'

const ws = createWebSocketAdapter({
  // See https://crossws.unjs.io/guide/hooks
  hooks: { … },
})

Deno.serve(createServeHandler(compose(ws.handler, httpHandler)))
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
