import type { EmarsysPlugin } from '../definitions';

/**
 * A mock of the native Capacitor bridge that `registerPlugin('Emarsys')`
 * returns. Every plugin method is a jest.fn() so tests can assert the public
 * `Emarsys` API delegates to the right native method with the right arguments.
 */
export type MockedBridge = {
  [K in keyof EmarsysPlugin]: jest.Mock;
};

export function createMockBridge(): MockedBridge {
  return {
    setContact: jest.fn().mockResolvedValue(undefined),
    clearContact: jest.fn().mockResolvedValue(undefined),
    trackCustomEvent: jest.fn().mockResolvedValue(undefined),
    setPushToken: jest.fn().mockResolvedValue(undefined),
    clearPushToken: jest.fn().mockResolvedValue(undefined),
    getPushToken: jest.fn().mockResolvedValue({ pushToken: '' }),
    pauseInApp: jest.fn().mockResolvedValue(undefined),
    resumeInApp: jest.fn().mockResolvedValue(undefined),
    isInAppPaused: jest.fn().mockResolvedValue({ isPaused: false }),
    changeApplicationCode: jest.fn().mockResolvedValue(undefined),
    changeMerchantId: jest.fn().mockResolvedValue(undefined),
    getApplicationCode: jest.fn().mockResolvedValue({ applicationCode: '' }),
    getMerchantId: jest.fn().mockResolvedValue({ merchantId: '' }),
    getClientId: jest.fn().mockResolvedValue({ clientId: '' }),
    getLanguageCode: jest.fn().mockResolvedValue({ languageCode: '' }),
    getSdkVersion: jest.fn().mockResolvedValue({ sdkVersion: '' }),
    enableGeofence: jest.fn().mockResolvedValue(undefined),
    disableGeofence: jest.fn().mockResolvedValue(undefined),
    isGeofenceEnabled: jest.fn().mockResolvedValue({ isEnabled: false }),
    getRegisteredGeofences: jest.fn().mockResolvedValue({ geofences: [] }),
    addListener: jest.fn().mockResolvedValue({ remove: jest.fn() }),
  };
}
