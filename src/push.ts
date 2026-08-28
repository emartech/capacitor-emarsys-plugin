import type { EmarsysPlugin, PushModule } from './definitions';

export function createPushModule(plugin: EmarsysPlugin): PushModule {
  return {
    setPushToken(pushToken: string): Promise<void> {
      return plugin.setPushToken({ pushToken });
    },

    clearPushToken(): Promise<void> {
      return plugin.clearPushToken();
    },

    async getPushToken(): Promise<string> {
      const { pushToken } = await plugin.getPushToken();
      return pushToken;
    },
  };
}
