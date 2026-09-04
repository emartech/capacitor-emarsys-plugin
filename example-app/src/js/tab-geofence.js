import { Emarsys } from 'capacitor-emarsys-plugin';

export const GEOFENCE_TAB_HTML = `
  <div class="tab-pane" id="tab-geofence">
    <h1 class="page-title">Geofence</h1>
    <button class="btn" id="enable-geofence">Enable</button>
    <button class="btn" id="disable-geofence">Disable</button>
    <button class="btn" id="is-geofence-enabled">Is Enabled?</button>
    <button class="btn" id="get-registered-geofences">Get Registered Geofences</button>
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

}
