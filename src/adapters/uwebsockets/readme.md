# hattip-ws/uwebsockets

```sh
pnpm add hattip-ws @hattip/adapter-uwebsockets @hattip/compose
```

```ts
import { createServer } from '@hattip/adapter-uwebsockets'
import { createWebSocketAdapter } from 'hattip-ws/uwebsockets'
import httpHandler from './http-handler.ts'

const ws = createWebSocketAdapter({
  // See https://crossws.unjs.io/guide/hooks
  hooks: { … },
})

export default createServer(httpHandler, {
  configureServer: ws.configureServer,
})
```
