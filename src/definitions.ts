import type { PluginListenerHandle } from '@capacitor/core';

export interface EmarsysEvent {
  eventName: string;
  payload: Record<string, unknown>;
}

export type EmarsysEventListener = (event: EmarsysEvent) => void;

export interface EmarsysPlugin {
  setContact(options: { contactFieldId: number; contactFieldValue: string }): Promise<void>;
  clearContact(): Promise<void>;
  trackCustomEvent(options: { eventName: string; eventAttributes: { [key: string]: string } }): Promise<void>;

  setPushToken(options: { pushToken: string }): Promise<void>;
  clearPushToken(): Promise<void>;
  getPushToken(): Promise<{ pushToken: string }>;

  // Auto-implemented by Capacitor's CAPPlugin; declared here for typing only.
  addListener(eventName: 'emarsysEventHandler', listenerFunc: EmarsysEventListener): Promise<PluginListenerHandle>;
}

export interface PushModule {
  setPushToken(pushToken: string): Promise<void>;
  clearPushToken(): Promise<void>;
  getPushToken(): Promise<string>;
}
export interface EmarsysApi {
  setContact(options: { contactFieldId: number; contactFieldValue: string }): Promise<void>;
  clearContact(): Promise<void>;
  trackCustomEvent(options: { eventName: string; eventAttributes: { [key: string]: string } }): Promise<void>;

  addEventListener(listener: EmarsysEventListener): Promise<PluginListenerHandle>;

  push: PushModule;
}
