import { registerPlugin } from '@capacitor/core';

import type { EmarsysApi, EmarsysPlugin } from './definitions';
import { createInAppModule } from './inApp';
import { createPushModule } from './push';

// The native bridge. `registerPlugin` returns a Proxy whose every property
// access is turned into a native method call, so we cannot attach module
// namespaces (e.g. `push`) directly onto it — the Proxy would shadow them.
const EmarsysPluginInstance = registerPlugin<EmarsysPlugin>('Emarsys');

// The public API: core methods delegate to the native bridge, and each
// feature is exposed through its own module (mirroring the RN SDK structure).
const Emarsys: EmarsysApi = {
  setContact: (options) => EmarsysPluginInstance.setContact(options),
  clearContact: () => EmarsysPluginInstance.clearContact(),
  trackCustomEvent: (options) => EmarsysPluginInstance.trackCustomEvent(options),

  addEventListener: (listener) => EmarsysPluginInstance.addListener('emarsysEventHandler', listener),

  push: createPushModule(EmarsysPluginInstance),
  inApp: createInAppModule(EmarsysPluginInstance),
};

export * from './definitions';
export { Emarsys };
