import type { InboxMessage, InboxModule } from './definitions';

export function createInboxModule(plugin: {
  fetchInboxMessages(): Promise<{ messages: InboxMessage[] }>;
}): InboxModule {
  return {
    async fetchMessages() {
      const { messages } = await plugin.fetchInboxMessages();
      return messages;
    },
  };
}
