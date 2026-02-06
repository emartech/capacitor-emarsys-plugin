export interface EmarsysPlugin {
  trackCustomEvent(options: { eventName: string; eventAttributes: { [key: string]: string } }): Promise<void>;
}
