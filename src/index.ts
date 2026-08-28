import { registerPlugin } from '@capacitor/core';

import { createConfigModule } from './config';
import type { EmarsysApi, EmarsysPlugin } from './definitions';
import { createGeofenceModule } from './geofence';
import { createInAppModule } from './inApp';
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
};

export * from './definitions';
export { Emarsys };
