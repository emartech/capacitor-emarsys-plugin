import { Emarsys } from 'capacitor-emarsys-plugin';

import { initConfigTab } from './tab-config.js';
import { initGeofenceTab } from './tab-geofence.js';
import { initInAppTab } from './tab-inapp.js';
import { initPushTab } from './tab-push.js';

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
