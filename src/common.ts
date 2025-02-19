import type { RequestContext } from '@hattip/compose'
import * as crossws from 'crossws'
import type { Hooks, ResolveHooks } from './core.js'
import type { WebSocketAdapterOptions } from './index.js'

// Override the `context` property to be typed as `PeerContext`.
export interface Peer<P = unknown> extends crossws.Peer {
  context: PeerContext<P> & Record<string, unknown>
}

/**
 * Hattip context available through the `peer.context` property.
 */
export type PeerContext<P = unknown> = Omit<
  RequestContext<P>,
  (typeof ignoredContextKeys)[number]
>

const ignoredContextKeys = [
  'handleError',
  'ip',
  'method',
  'next',
  'passThrough',
  'waitUntil',
] as const

export function forwardHattipContext(target: any, source: RequestContext) {
  const context: Record<string, unknown> = target.context ?? {}
  for (const name of Object.getOwnPropertyNames(source)) {
    if (!ignoredContextKeys.includes(name as any)) {
      Object.defineProperty(
        context,
        name,
        Object.getOwnPropertyDescriptor(source, name)!
      )
    }
  }
  if (!target.context) {
    Object.defineProperty(target, 'context', {
      enumerable: true,
      value: context,
    })
  }
}

export function interceptUpgrade(
  options: WebSocketAdapterOptions<any> | undefined,
  onUpgrade: Hooks['upgrade']
) {
  if (options?.resolve) {
    return {
      resolve: interceptResolveHooks(options.resolve, hooks => ({
        ...hooks,
        upgrade: hooks.upgrade
          ? mergeUpgradeHooks(hooks.upgrade, onUpgrade)
          : onUpgrade,
      })),
    }
  }
  const hooks = options?.hooks
  return {
    hooks: {
      ...hooks,
      upgrade: hooks?.upgrade
        ? mergeUpgradeHooks(hooks.upgrade, onUpgrade)
        : onUpgrade,
    },
  }
}

function interceptResolveHooks(
  resolve: ResolveHooks,
  intercept: (hooks: Partial<Hooks>) => Partial<Hooks>
): ResolveHooks {
  return info => {
    const result = resolve(info)
    if (result instanceof Promise) {
      return result.then(resolvedHooks => intercept(resolvedHooks))
    }
    return intercept(result)
  }
}

/**
 * The `right` hook's result takes precedence.
 */
function mergeUpgradeHooks(
  left: Hooks['upgrade'],
  right: Hooks['upgrade']
): Hooks['upgrade'] {
  return request => {
    const result = right(request)
    if (result instanceof Promise) {
      return result.then(result => {
        if (result !== undefined) {
          return result
        }
        return left(request)
      })
    }
    if (result !== undefined) {
      return result
    }
    return left(request)
  }
}
