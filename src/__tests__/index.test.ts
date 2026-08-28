import type { MockedBridge } from './mockBridge';

jest.mock('@capacitor/core', () => {
  // Build the bridge here so it exists when `../index` calls registerPlugin at
  // module-load time, and stash it on globalThis for the tests to read back.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const bridge = require('./mockBridge').createMockBridge();
  (globalThis as any).__mockBridge = bridge;
  return {
    registerPlugin: jest.fn(() => bridge),
  };
});

// `Emarsys` is built at module-load time from `registerPlugin`, so this import
// must come after the jest.mock call above.
// eslint-disable-next-line import/first, import/order
import { Emarsys } from '../index';

const mockBridge: MockedBridge = (globalThis as any).__mockBridge;

describe('Emarsys core API', () => {
  describe('setContact', () => {
    it('delegates to the native bridge with the given options', async () => {
      const options = { contactFieldId: 123456, contactFieldValue: 'TEST_VALUE' };

      await Emarsys.setContact(options);

      expect(mockBridge.setContact).toHaveBeenCalledWith(options);
      expect(mockBridge.setContact).toHaveBeenCalledTimes(1);
    });

    it('resolves on success', async () => {
      mockBridge.setContact.mockResolvedValueOnce(undefined);

      await expect(Emarsys.setContact({ contactFieldId: 1, contactFieldValue: 'v' })).resolves.toBeUndefined();
    });

    it('rejects when the native bridge rejects', async () => {
      mockBridge.setContact.mockRejectedValueOnce(new Error('Set contact error'));

      await expect(Emarsys.setContact({ contactFieldId: 1, contactFieldValue: 'v' })).rejects.toThrow(
        'Set contact error',
      );
    });
  });

  describe('clearContact', () => {
    it('delegates to the native bridge with no arguments', async () => {
      await Emarsys.clearContact();

      expect(mockBridge.clearContact).toHaveBeenCalledWith();
      expect(mockBridge.clearContact).toHaveBeenCalledTimes(1);
    });

    it('rejects when the native bridge rejects', async () => {
      mockBridge.clearContact.mockRejectedValueOnce(new Error('Clear contact error'));

      await expect(Emarsys.clearContact()).rejects.toThrow('Clear contact error');
    });
  });

  describe('trackCustomEvent', () => {
    it('delegates with event name and attributes', async () => {
      const options = { eventName: 'TEST_NAME', eventAttributes: { key: 'value' } };

      await Emarsys.trackCustomEvent(options);

      expect(mockBridge.trackCustomEvent).toHaveBeenCalledWith(options);
      expect(mockBridge.trackCustomEvent).toHaveBeenCalledTimes(1);
    });

    it('rejects when the native bridge rejects', async () => {
      mockBridge.trackCustomEvent.mockRejectedValueOnce(new Error('Track custom event error'));

      await expect(Emarsys.trackCustomEvent({ eventName: 'x', eventAttributes: {} })).rejects.toThrow(
        'Track custom event error',
      );
    });
  });

  describe('addEventListener', () => {
    it('subscribes to the internal "emarsysEventHandler" event', async () => {
      const listener = jest.fn();

      await Emarsys.addEventListener(listener);

      expect(mockBridge.addListener).toHaveBeenCalledWith('emarsysEventHandler', listener);
      expect(mockBridge.addListener).toHaveBeenCalledTimes(1);
    });

    it('returns the listener handle from the bridge', async () => {
      const handle = { remove: jest.fn() };
      mockBridge.addListener.mockResolvedValueOnce(handle);

      await expect(Emarsys.addEventListener(jest.fn())).resolves.toBe(handle);
    });
  });

  describe('API surface', () => {
    it('exposes the expected methods and modules', () => {
      expect(typeof Emarsys.setContact).toBe('function');
      expect(typeof Emarsys.clearContact).toBe('function');
      expect(typeof Emarsys.trackCustomEvent).toBe('function');
      expect(typeof Emarsys.addEventListener).toBe('function');

      expect(typeof Emarsys.push.setPushToken).toBe('function');
      expect(typeof Emarsys.push.clearPushToken).toBe('function');
      expect(typeof Emarsys.push.getPushToken).toBe('function');

      expect(typeof Emarsys.inApp.pause).toBe('function');
      expect(typeof Emarsys.inApp.resume).toBe('function');
      expect(typeof Emarsys.inApp.isPaused).toBe('function');

      expect(typeof Emarsys.config.changeApplicationCode).toBe('function');
      expect(typeof Emarsys.config.changeMerchantId).toBe('function');
      expect(typeof Emarsys.config.getApplicationCode).toBe('function');
      expect(typeof Emarsys.config.getMerchantId).toBe('function');
      expect(typeof Emarsys.config.getClientId).toBe('function');
      expect(typeof Emarsys.config.getLanguageCode).toBe('function');
      expect(typeof Emarsys.config.getSdkVersion).toBe('function');

      expect(typeof Emarsys.geofence.enable).toBe('function');
      expect(typeof Emarsys.geofence.disable).toBe('function');
      expect(typeof Emarsys.geofence.isEnabled).toBe('function');
      expect(typeof Emarsys.geofence.getRegisteredGeofences).toBe('function');
    });
  });
});
