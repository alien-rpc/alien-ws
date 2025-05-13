# alien-ws/cloudflare-workers

1. Install the dependencies:

```sh
pnpm add alien-ws @hattip/adapter-cloudflare-workers alien-middleware
```

2. Create the adapter and use its handler:

```ts
import { chain } from 'alien-middleware'
import { createWebSocketAdapter } from 'alien-ws/cloudflare-workers'
import cloudflareAdapter from '@hattip/adapter-cloudflare-workers'
import httpHandler from './http-handler.ts'

const ws = createWebSocketAdapter({
  // See https://crossws.unjs.io/guide/hooks
  hooks: { … },
})

export default {
  fetch: cloudflareAdapter(chain().use(ws.handler).use(httpHandler)),
}
```

3. Refer to [this guide](https://crossws.unjs.io/guide/hooks) for the available hooks.

### Peer context

Every hook (except `upgrade`) receives a [peer](https://crossws.unjs.io/guide/peer) as its first argument.

Each peer has a `context` property that contains the Hattip context, which your Hattip middlewares can define new properties on.

The following properties are always available on `peer.context`:

- `url: URL` The URL that facilitated the WebSocket upgrade.
- `env: (name: string) => string` A function to access environment variables in a platform-agnostic way.
- `locals: Record<string, unknown>` A mutable object that can be used to store data for the duration of the WebSocket connection.
- `platform: CloudflareWorkersPlatformInfo`
  - `name: "cloudflare-workers"`
  - `env: unknown` [Bindings](https://developers.cloudflare.com/workers/configuration/bindings) for secrets, [environment variables](https://developers.cloudflare.com/workers/platform/environment-variables), and other resources like KV namespaces, etc.
  - `context: ExecutionContext` The Cloudflare Workers execution context.

### WebSocketAdapter API

The adapter returned by the `createWebSocketAdapter` function has the following properties:

- `peers`: A set of all connected [peers](https://crossws.unjs.io/guide/peer).
- `publish`: A function to publish messages to all connected peers.

The `publish` function accepts the following arguments:

- `topic`: The topic to publish the message to.
- `message`: The message to publish.
- `options`: An object containing the following properties:
  - `compress`: Whether to compress the message.
