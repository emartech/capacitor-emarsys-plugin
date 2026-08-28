import type { Geofence, GeofenceModule } from './definitions';

export function createGeofenceModule(plugin: {
  enableGeofence(): Promise<void>;
  disableGeofence(): Promise<void>;
  isGeofenceEnabled(): Promise<{ isEnabled: boolean }>;
  getRegisteredGeofences(): Promise<{ geofences: Geofence[] }>;
}): GeofenceModule {
  return {
    enable: () => plugin.enableGeofence(),
    disable: () => plugin.disableGeofence(),
    async isEnabled() {
      const { isEnabled } = await plugin.isGeofenceEnabled();
      return isEnabled;
    },
    async getRegisteredGeofences() {
      const { geofences } = await plugin.getRegisteredGeofences();
      return geofences;
    },
  };
}
