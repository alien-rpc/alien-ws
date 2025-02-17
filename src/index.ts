import { AdapterInstance, AdapterOptions } from 'crossws'

export interface WebSocketAdapterOptions extends AdapterOptions {}

export interface WebSocketAdapter extends AdapterInstance {}

export type WebSocketAdapterFactory = (
  options?: WebSocketAdapterOptions
) => WebSocketAdapter
