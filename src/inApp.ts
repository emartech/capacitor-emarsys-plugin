import type { InAppModule } from './definitions';

export function createInAppModule(plugin: {
  pauseInApp(): Promise<void>;
  resumeInApp(): Promise<void>;
  isInAppPaused(): Promise<{ isPaused: boolean }>;
}): InAppModule {
  return {
    pause(): Promise<void> {
      return plugin.pauseInApp();
    },

    resume(): Promise<void> {
      return plugin.resumeInApp();
    },

    async isPaused(): Promise<boolean> {
      const { isPaused } = await plugin.isInAppPaused();
      return isPaused;
    },
  };
}
