import type { Message, WSError } from 'crossws'
import type { Peer, PeerContext } from './common.js'

export type { Message, Peer, PeerContext, WSError }

type MaybePromise<T> = T | Promise<T>

type BasicRequest = {
  url: string
  headers: Headers
}

interface RequestInit {
  method?: string
  headers?: unknown
  body?: unknown
  redirect?: string
  integrity?: string
  signal?: unknown
}

interface ResponseInit {
  readonly status?: number
  readonly statusText?: string
  readonly headers?: unknown
}

export interface Hooks<
  TPlatform = unknown,
  TRequest extends object = any,
  TResponse extends object = any,
> {
  /** Called before a HTTP request is upgraded to a WebSocket connection. */
  upgrade: (
    request: (TRequest | BasicRequest) & {
      context: PeerContext<TPlatform>
    }
  ) => MaybePromise<TResponse | ResponseInit | void>

  /** Called when a message is received from the WebSocket connection. */
  message: (peer: Peer<TPlatform>, message: Message) => MaybePromise<void>

  /** Called when a WebSocket connection is opened. */
  open: (peer: Peer<TPlatform>) => MaybePromise<void>

  /** Called when a WebSocket connection is closed. */
  close: (
    peer: Peer<TPlatform>,
    details: {
      code?: number
      reason?: string
    }
  ) => MaybePromise<void>

  /** Called when an error occurs on the WebSocket connection. */
  error: (peer: Peer<TPlatform>, error: WSError) => MaybePromise<void>
}

export type ResolveHooks<
  TPlatform = unknown,
  TRequest extends object = BasicRequest,
  TResponse extends object = any,
> = (
  info: RequestInit | Peer<TPlatform>
) => MaybePromise<Partial<Hooks<TPlatform, TRequest, TResponse>>>
