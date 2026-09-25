import { registerPlugin } from '@capacitor/core';

import { createConfigModule } from './config';
import type { EmarsysApi, EmarsysPlugin } from './definitions';
import { createGeofenceModule } from './geofence';
import { createInAppModule } from './inApp';
import { createInboxModule } from './inbox';
import { createPushModule } from './push';

const EmarsysPluginInstance = registerPlugin<EmarsysPlugin>('Emarsys');

const Emarsys: EmarsysApi = {
  setContact: (options) => EmarsysPluginInstance.setContact(options),
  clearContact: () => EmarsysPluginInstance.clearContact(),
  trackCustomEvent: (options) => EmarsysPluginInstance.trackCustomEvent(options),

  addEventListener: (listener) => EmarsysPluginInstance.addListener('emarsysEventHandler', listener),

  push: createPushModule(EmarsysPluginInstance),
  inApp: createInAppModule(EmarsysPluginInstance),
  config: createConfigModule(EmarsysPluginInstance),
  geofence: createGeofenceModule(EmarsysPluginInstance),
  inbox: createInboxModule(EmarsysPluginInstance),
};

// TODO: extract values from package.json
void EmarsysPluginInstance.trackCustomEvent({
  eventName: 'wrapper:init',
  eventAttributes: { type: 'capacitor', version: '0.1.0', frameworkVersion: '8.5.0' },
}).catch(() => {
  /* ignore */
});

export * from './definitions';
export { Emarsys };
