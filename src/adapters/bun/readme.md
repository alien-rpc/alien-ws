# hattip-ws/bun

```sh
pnpm add hattip-ws @hattip/adapter-bun @hattip/compose
```

```ts
import { compose } from '@hattip/compose'
import { createWebSocketAdapter } from 'hattip-ws/bun'
import bunAdapter from '@hattip/adapter-bun'
import httpHandler from './http-handler.ts'

const ws = createWebSocketAdapter({
  // See https://crossws.unjs.io/guide/hooks
  hooks: { … },
})

export default bunAdapter(compose(ws.handler, httpHandler), {
  websocket: ws.websocket,
})
```
