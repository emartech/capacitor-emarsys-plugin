import { registerPlugin } from '@capacitor/core';

import type { EmarsysPlugin } from './definitions';

const Emarsys = registerPlugin<EmarsysPlugin>('Emarsys');

export * from './definitions';
export { Emarsys };
