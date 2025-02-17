# hattip-ws/cloudflare-workers

```sh
pnpm add hattip-ws @hattip/adapter-cloudflare-workers @hattip/compose
```

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
