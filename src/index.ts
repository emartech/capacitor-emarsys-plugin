import { registerPlugin } from '@capacitor/core';

import type { EmarsysPlugin } from './definitions';

const Emarsys = registerPlugin<EmarsysPlugin>('Emarsys', {
  web: () => import('./web').then((m) => new m.EmarsysWeb()),
});

export * from './definitions';
export { Emarsys };
