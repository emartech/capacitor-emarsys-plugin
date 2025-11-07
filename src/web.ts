import { WebPlugin } from '@capacitor/core';

import type { examplePlugin } from './definitions';

export class exampleWeb extends WebPlugin implements examplePlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
