export interface EmarsysPlugin {
  setContact(options: { contactFieldId: number; contactFieldValue: string }): Promise<void>;
  trackCustomEvent(options: { eventName: string; eventAttributes: { [key: string]: string } }): Promise<void>;
}
