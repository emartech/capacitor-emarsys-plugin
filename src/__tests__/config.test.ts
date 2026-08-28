import { createConfigModule } from '../config';

import { createMockBridge } from './mockBridge';
import type { MockedBridge } from './mockBridge';

describe('Emarsys config module', () => {
  let bridge: MockedBridge;
  let config: ReturnType<typeof createConfigModule>;

  beforeEach(() => {
    bridge = createMockBridge();
    config = createConfigModule(bridge);
  });

  describe('changeApplicationCode', () => {
    it('wraps the code into native bridge options', async () => {
      await config.changeApplicationCode('EMS08-CD6F6');

      expect(bridge.changeApplicationCode).toHaveBeenCalledWith({ applicationCode: 'EMS08-CD6F6' });
      expect(bridge.changeApplicationCode).toHaveBeenCalledTimes(1);
    });

    it('rejects when the native bridge rejects', async () => {
      bridge.changeApplicationCode.mockRejectedValueOnce(new Error('Failed to change application code'));

      await expect(config.changeApplicationCode('x')).rejects.toThrow('Failed to change application code');
    });
  });

  describe('changeMerchantId', () => {
    it('wraps the merchantId into native bridge options', async () => {
      await config.changeMerchantId('testMerchantId');

      expect(bridge.changeMerchantId).toHaveBeenCalledWith({ merchantId: 'testMerchantId' });
      expect(bridge.changeMerchantId).toHaveBeenCalledTimes(1);
    });

    it('rejects when the native bridge rejects', async () => {
      bridge.changeMerchantId.mockRejectedValueOnce(new Error('Failed to change merchant id'));

      await expect(config.changeMerchantId('x')).rejects.toThrow('Failed to change merchant id');
    });
  });

  describe('getApplicationCode', () => {
    it('unwraps applicationCode from the native response', async () => {
      bridge.getApplicationCode.mockResolvedValueOnce({ applicationCode: 'EMS08-CD6F6' });

      await expect(config.getApplicationCode()).resolves.toBe('EMS08-CD6F6');
      expect(bridge.getApplicationCode).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMerchantId', () => {
    it('unwraps merchantId from the native response', async () => {
      bridge.getMerchantId.mockResolvedValueOnce({ merchantId: 'testMerchantId' });

      await expect(config.getMerchantId()).resolves.toBe('testMerchantId');
    });
  });

  describe('getClientId', () => {
    it('unwraps clientId from the native response', async () => {
      bridge.getClientId.mockResolvedValueOnce({ clientId: 'abc123' });

      await expect(config.getClientId()).resolves.toBe('abc123');
    });
  });

  describe('getLanguageCode', () => {
    it('unwraps languageCode from the native response', async () => {
      bridge.getLanguageCode.mockResolvedValueOnce({ languageCode: 'en' });

      await expect(config.getLanguageCode()).resolves.toBe('en');
    });
  });

  describe('getSdkVersion', () => {
    it('unwraps sdkVersion from the native response', async () => {
      bridge.getSdkVersion.mockResolvedValueOnce({ sdkVersion: '3.11.3' });

      await expect(config.getSdkVersion()).resolves.toBe('3.11.3');
    });
  });

  describe('API surface', () => {
    it('exposes all config methods as functions', () => {
      expect(typeof config.changeApplicationCode).toBe('function');
      expect(typeof config.changeMerchantId).toBe('function');
      expect(typeof config.getApplicationCode).toBe('function');
      expect(typeof config.getMerchantId).toBe('function');
      expect(typeof config.getClientId).toBe('function');
      expect(typeof config.getLanguageCode).toBe('function');
      expect(typeof config.getSdkVersion).toBe('function');
    });
  });
});
