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

  pauseInApp(): Promise<void>;
  resumeInApp(): Promise<void>;
  isInAppPaused(): Promise<{ isPaused: boolean }>;

  // Auto-implemented by Capacitor's CAPPlugin; declared here for typing only.
  addListener(eventName: 'emarsysEventHandler', listenerFunc: EmarsysEventListener): Promise<PluginListenerHandle>;
}

export interface PushModule {
  setPushToken(pushToken: string): Promise<void>;
  clearPushToken(): Promise<void>;
  getPushToken(): Promise<string>;
}

export interface InAppModule {
  pause(): Promise<void>;
  resume(): Promise<void>;
  isPaused(): Promise<boolean>;
}

export interface EmarsysApi {
  setContact(options: { contactFieldId: number; contactFieldValue: string }): Promise<void>;
  clearContact(): Promise<void>;
  trackCustomEvent(options: { eventName: string; eventAttributes: { [key: string]: string } }): Promise<void>;

  addEventListener(listener: EmarsysEventListener): Promise<PluginListenerHandle>;

  push: PushModule;
  inApp: InAppModule;
}
