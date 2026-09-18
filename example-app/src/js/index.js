import { Emarsys } from 'capacitor-emarsys-plugin';

import { CONFIG_TAB_HTML, initConfigTab } from './tab-config.js';
import { GEOFENCE_TAB_HTML, initGeofenceTab } from './tab-geofence.js';
import { INAPP_TAB_HTML, initInAppTab } from './tab-inapp.js';
import { PUSH_TAB_HTML, initPushTab } from './tab-push.js';

// Inject tab content
document.querySelector('.tab-content').innerHTML =
  CONFIG_TAB_HTML + PUSH_TAB_HTML + INAPP_TAB_HTML + GEOFENCE_TAB_HTML;

// Tab navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabBtns.forEach((b) => b.classList.remove('active'));
    tabPanes.forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// Emarsys event listener
Emarsys.addEventListener((event) => {
  console.log('Emarsys event:', event);
  alert('Emarsys Event\n\nName: ' + event.eventName + '\nPayload: ' + JSON.stringify(event.payload, null, 2));
});

// Init tabs
initConfigTab(document);
initPushTab(document);
initInAppTab(document);
initGeofenceTab(document);
