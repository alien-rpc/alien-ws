# hattip-ws/node

```sh
pnpm add hattip-ws @hattip/adapter-node @hattip/compose
```

```ts
import { createServer } from '@hattip/adapter-node'
import { createWebSocketAdapter } from 'hattip-ws/node'
import httpHandler from './http-handler.ts'

const ws = createWebSocketAdapter({
  // See https://crossws.unjs.io/guide/hooks
  hooks: { … },
})

const server = createServer(httpHandler)
ws.configureServer(server)

export default server
```
