export interface EmarsysPlugin {
  setContact(options: { contactFieldId: number; contactFieldValue: string }): Promise<void>;
  clearContact(): Promise<void>;
  trackCustomEvent(options: { eventName: string; eventAttributes: { [key: string]: string } }): Promise<void>;

  setPushToken(options: { pushToken: string }): Promise<void>;
  clearPushToken(): Promise<void>;
  getPushToken(): Promise<{ pushToken: string }>;
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

  push: PushModule;
}
