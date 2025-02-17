import { AdapterInstance, AdapterOptions } from 'crossws'

export * from './core.js'

export interface WebSocketAdapterOptions extends AdapterOptions {}

export interface WebSocketAdapter extends AdapterInstance {}

export type WebSocketAdapterFactory = (
  options?: WebSocketAdapterOptions
) => WebSocketAdapter
