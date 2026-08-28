import type { PluginListenerHandle } from '@capacitor/core';

import type { Geofence } from './types/Geofence';

export type { Geofence, GeofenceTrigger } from './types/Geofence';

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

  changeApplicationCode(options: { applicationCode: string }): Promise<void>;
  changeMerchantId(options: { merchantId: string }): Promise<void>;
  getApplicationCode(): Promise<{ applicationCode: string }>;
  getMerchantId(): Promise<{ merchantId: string }>;
  getClientId(): Promise<{ clientId: string }>;
  getLanguageCode(): Promise<{ languageCode: string }>;
  getSdkVersion(): Promise<{ sdkVersion: string }>;

  enableGeofence(): Promise<void>;
  disableGeofence(): Promise<void>;
  isGeofenceEnabled(): Promise<{ isEnabled: boolean }>;
  getRegisteredGeofences(): Promise<{ geofences: Geofence[] }>;

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

export interface ConfigModule {
  changeApplicationCode(applicationCode: string): Promise<void>;
  changeMerchantId(merchantId: string): Promise<void>;
  getApplicationCode(): Promise<string>;
  getMerchantId(): Promise<string>;
  getClientId(): Promise<string>;
  getLanguageCode(): Promise<string>;
  getSdkVersion(): Promise<string>;
}

export interface GeofenceModule {
  enable(): Promise<void>;
  disable(): Promise<void>;
  isEnabled(): Promise<boolean>;
  getRegisteredGeofences(): Promise<Geofence[]>;
}

export interface EmarsysApi {
  setContact(options: { contactFieldId: number; contactFieldValue: string }): Promise<void>;
  clearContact(): Promise<void>;
  trackCustomEvent(options: { eventName: string; eventAttributes: { [key: string]: string } }): Promise<void>;

  addEventListener(listener: EmarsysEventListener): Promise<PluginListenerHandle>;

  push: PushModule;
  inApp: InAppModule;
  config: ConfigModule;
  geofence: GeofenceModule;
}
