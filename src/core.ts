import { Message, WSError } from 'crossws'
import { Peer, PeerContext } from './common.js'

export { Message, Peer, PeerContext, WSError }

type MaybePromise<T> = T | Promise<T>

type UpgradeRequest =
  | Request
  | {
      url: string
      headers: Headers
    }

export interface Hooks<P = unknown> {
  /** Called before a HTTP request is upgraded to a WebSocket connection. */
  upgrade: (
    request: UpgradeRequest & {
      context: PeerContext<P>
    }
  ) => MaybePromise<Response | ResponseInit | void>

  /** Called when a message is received from the WebSocket connection. */
  message: (peer: Peer<P>, message: Message) => MaybePromise<void>

  /** Called when a WebSocket connection is opened. */
  open: (peer: Peer<P>) => MaybePromise<void>

  /** Called when a WebSocket connection is closed. */
  close: (
    peer: Peer<P>,
    details: {
      code?: number
      reason?: string
    }
  ) => MaybePromise<void>

  /** Called when an error occurs on the WebSocket connection. */
  error: (peer: Peer<P>, error: WSError) => MaybePromise<void>
}

export type ResolveHooks<P = unknown> = (
  info: RequestInit | Peer<P>
) => Partial<Hooks<P>> | Promise<Partial<Hooks<P>>>
