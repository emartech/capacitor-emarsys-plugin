import { createGeofenceModule } from '../geofence';

import { createMockBridge } from './mockBridge';
import type { MockedBridge } from './mockBridge';

describe('Emarsys geofence module', () => {
  let bridge: MockedBridge;
  let geofence: ReturnType<typeof createGeofenceModule>;

  beforeEach(() => {
    bridge = createMockBridge();
    geofence = createGeofenceModule(bridge);
  });

  describe('enable', () => {
    it('delegates to the native bridge', async () => {
      await geofence.enable();

      expect(bridge.enableGeofence).toHaveBeenCalledWith();
      expect(bridge.enableGeofence).toHaveBeenCalledTimes(1);
    });

    it('rejects when the native bridge rejects', async () => {
      bridge.enableGeofence.mockRejectedValueOnce(new Error('Enable geofence error'));

      await expect(geofence.enable()).rejects.toThrow('Enable geofence error');
    });
  });

  describe('disable', () => {
    it('delegates to the native bridge', async () => {
      await geofence.disable();

      expect(bridge.disableGeofence).toHaveBeenCalledWith();
      expect(bridge.disableGeofence).toHaveBeenCalledTimes(1);
    });
  });

  describe('isEnabled', () => {
    it('unwraps isEnabled from the native response', async () => {
      bridge.isGeofenceEnabled.mockResolvedValueOnce({ isEnabled: true });

      await expect(geofence.isEnabled()).resolves.toBe(true);
      expect(bridge.isGeofenceEnabled).toHaveBeenCalledTimes(1);
    });

    it('returns false when not enabled', async () => {
      bridge.isGeofenceEnabled.mockResolvedValueOnce({ isEnabled: false });

      await expect(geofence.isEnabled()).resolves.toBe(false);
    });
  });

  describe('getRegisteredGeofences', () => {
    it('unwraps geofences array from the native response', async () => {
      const mockGeofences = [
        {
          id: 'geo1',
          lat: 47.5,
          lon: 19.05,
          radius: 100,
          waitInterval: 0,
          triggers: [{ id: 't1', type: 'ENTER', loiteringDelay: 0, action: { type: 'MEAppEvent', name: 'test' } }],
        },
      ];
      bridge.getRegisteredGeofences.mockResolvedValueOnce({ geofences: mockGeofences });

      const result = await geofence.getRegisteredGeofences();

      expect(result).toEqual(mockGeofences);
      expect(bridge.getRegisteredGeofences).toHaveBeenCalledTimes(1);
    });

    it('returns empty array when no geofences registered', async () => {
      bridge.getRegisteredGeofences.mockResolvedValueOnce({ geofences: [] });

      await expect(geofence.getRegisteredGeofences()).resolves.toEqual([]);
    });
  });

  describe('API surface', () => {
    it('exposes all geofence methods as functions', () => {
      expect(typeof geofence.enable).toBe('function');
      expect(typeof geofence.disable).toBe('function');
      expect(typeof geofence.isEnabled).toBe('function');
      expect(typeof geofence.getRegisteredGeofences).toBe('function');
    });
  });
});
