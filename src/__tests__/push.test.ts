import { createPushModule } from '../push';

import { createMockBridge } from './mockBridge';
import type { MockedBridge } from './mockBridge';

describe('Emarsys push module', () => {
  let bridge: MockedBridge;
  let push: ReturnType<typeof createPushModule>;

  beforeEach(() => {
    bridge = createMockBridge();
    push = createPushModule(bridge);
  });

  describe('setPushToken', () => {
    it('wraps the token into the native bridge options', async () => {
      const pushToken = 'TEST_PUSH_TOKEN';

      await push.setPushToken(pushToken);

      expect(bridge.setPushToken).toHaveBeenCalledWith({ pushToken });
      expect(bridge.setPushToken).toHaveBeenCalledTimes(1);
    });

    it('rejects when the native bridge rejects', async () => {
      bridge.setPushToken.mockRejectedValueOnce(new Error('Failed to set push token'));

      await expect(push.setPushToken('x')).rejects.toThrow('Failed to set push token');
    });
  });

  describe('clearPushToken', () => {
    it('delegates to the native bridge with no arguments', async () => {
      await push.clearPushToken();

      expect(bridge.clearPushToken).toHaveBeenCalledWith();
      expect(bridge.clearPushToken).toHaveBeenCalledTimes(1);
    });

    it('rejects when the native bridge rejects', async () => {
      bridge.clearPushToken.mockRejectedValueOnce(new Error('Failed to clear push token'));

      await expect(push.clearPushToken()).rejects.toThrow('Failed to clear push token');
    });
  });

  describe('getPushToken', () => {
    it('unwraps the pushToken from the native response', async () => {
      bridge.getPushToken.mockResolvedValueOnce({ pushToken: 'CURRENT_PUSH_TOKEN' });

      const result = await push.getPushToken();

      expect(result).toBe('CURRENT_PUSH_TOKEN');
      expect(bridge.getPushToken).toHaveBeenCalledTimes(1);
    });

    it('rejects when the native bridge rejects', async () => {
      bridge.getPushToken.mockRejectedValueOnce(new Error('Failed to get push token'));

      await expect(push.getPushToken()).rejects.toThrow('Failed to get push token');
    });
  });

  describe('API surface', () => {
    it('exposes all push methods as functions', () => {
      expect(typeof push.setPushToken).toBe('function');
      expect(typeof push.clearPushToken).toBe('function');
      expect(typeof push.getPushToken).toBe('function');
    });
  });
});
