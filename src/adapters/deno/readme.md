# hattip-ws/deno

```sh
deno install npm:hattip-ws npm:@hattip/adapter-deno npm:@hattip/compose
```

```ts
import { compose } from '@hattip/compose'
import { createWebSocketAdapter } from 'hattip-ws/deno'
import { createServeHandler } from '@hattip/adapter-deno'
import httpHandler from './http-handler.ts'

const ws = createWebSocketAdapter({
  // See https://crossws.unjs.io/guide/hooks
  hooks: { … },
})

Deno.serve(createServeHandler(compose(ws.handler, httpHandler)))
```
