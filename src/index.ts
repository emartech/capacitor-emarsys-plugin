import { registerPlugin } from '@capacitor/core';

import type { examplePlugin } from './definitions';

const example = registerPlugin<examplePlugin>('example', {
  web: () => import('./web').then((m) => new m.exampleWeb()),
});

export * from './definitions';
export { example };
