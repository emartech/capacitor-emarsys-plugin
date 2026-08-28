import { createInAppModule } from '../inApp';

import { createMockBridge } from './mockBridge';
import type { MockedBridge } from './mockBridge';

describe('Emarsys inApp module', () => {
  let bridge: MockedBridge;
  let inApp: ReturnType<typeof createInAppModule>;

  beforeEach(() => {
    bridge = createMockBridge();
    inApp = createInAppModule(bridge);
  });

  describe('pause', () => {
    it('delegates to the native bridge', async () => {
      await inApp.pause();

      expect(bridge.pauseInApp).toHaveBeenCalledWith();
      expect(bridge.pauseInApp).toHaveBeenCalledTimes(1);
    });

    it('rejects when the native bridge rejects', async () => {
      bridge.pauseInApp.mockRejectedValueOnce(new Error('Failed to pause'));

      await expect(inApp.pause()).rejects.toThrow('Failed to pause');
    });
  });

  describe('resume', () => {
    it('delegates to the native bridge', async () => {
      await inApp.resume();

      expect(bridge.resumeInApp).toHaveBeenCalledWith();
      expect(bridge.resumeInApp).toHaveBeenCalledTimes(1);
    });

    it('rejects when the native bridge rejects', async () => {
      bridge.resumeInApp.mockRejectedValueOnce(new Error('Failed to resume'));

      await expect(inApp.resume()).rejects.toThrow('Failed to resume');
    });
  });

  describe('isPaused', () => {
    it('unwraps the isPaused boolean from the native response', async () => {
      bridge.isInAppPaused.mockResolvedValueOnce({ isPaused: true });

      const result = await inApp.isPaused();

      expect(result).toBe(true);
      expect(bridge.isInAppPaused).toHaveBeenCalledTimes(1);
    });

    it('returns false when not paused', async () => {
      bridge.isInAppPaused.mockResolvedValueOnce({ isPaused: false });

      await expect(inApp.isPaused()).resolves.toBe(false);
    });

    it('rejects when the native bridge rejects', async () => {
      bridge.isInAppPaused.mockRejectedValueOnce(new Error('Failed to get isPaused'));

      await expect(inApp.isPaused()).rejects.toThrow('Failed to get isPaused');
    });
  });

  describe('API surface', () => {
    it('exposes all inApp methods as functions', () => {
      expect(typeof inApp.pause).toBe('function');
      expect(typeof inApp.resume).toBe('function');
      expect(typeof inApp.isPaused).toBe('function');
    });
  });
});
