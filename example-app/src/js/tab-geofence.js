import { Emarsys } from 'capacitor-emarsys-plugin';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export const GEOFENCE_TAB_HTML = `
  <div class="tab-pane" id="tab-geofence">
    <h1 class="page-title">Geofence</h1>
    <button class="btn" id="enable-geofence">Enable</button>
    <button class="btn" id="disable-geofence">Disable</button>
    <button class="btn" id="is-geofence-enabled">Is Enabled?</button>
    <button class="btn" id="get-registered-geofences">Get Registered Geofences</button>
    <button class="btn" id="request-location-permission">Request Location Permission</button>
  </div>
`;

export function initGeofenceTab(root) {
  root.querySelector('#enable-geofence').addEventListener('click', async () => {
    try {
      await Emarsys.geofence.enable();
      alert('Enable Geofence\n\nSuccess');
    } catch (e) {
      alert('Enable Geofence\n\n' + e.message);
    }
  });

  root.querySelector('#disable-geofence').addEventListener('click', async () => {
    try {
      await Emarsys.geofence.disable();
      alert('Disable Geofence\n\nSuccess');
    } catch (e) {
      alert('Disable Geofence\n\n' + e.message);
    }
  });

  root.querySelector('#is-geofence-enabled').addEventListener('click', async () => {
    try {
      const result = await Emarsys.geofence.isEnabled();
      alert('Is Geofence Enabled?\n\n' + result);
    } catch (e) {
      alert('Is Geofence Enabled?\n\n' + e.message);
    }
  });

  root.querySelector('#get-registered-geofences').addEventListener('click', async () => {
    try {
      const geofences = await Emarsys.geofence.getRegisteredGeofences();
      alert('Registered Geofences\n\n' + JSON.stringify(geofences, null, 2));
    } catch (e) {
      alert('Get Registered Geofences\n\n' + e.message);
    }
  });

  root.querySelector('#request-location-permission').addEventListener('click', async () => {
    try {
      if (Capacitor.getPlatform() === 'android') {
        // Use @capacitor/geolocation which handles the full Android permission
        // flow including background location ("Allow all the time").
        const status = await Geolocation.requestPermissions({ permissions: ['location', 'coarseLocation'] });
        alert('Request Location Permission\n\n' + JSON.stringify(status));
      } else {
        // iOS: delegate to the Emarsys SDK's requestAlwaysAuthorization
        await Emarsys.geofence.requestLocationPermission();
        alert('Request Location Permission\n\nSuccess');
      }
    } catch (e) {
      alert('Request Location Permission\n\n' + e.message);
    }
  });
}
