import type { InboxMessage, InboxModule } from './definitions';

export function createInboxModule(plugin: {
  fetchInboxMessages(): Promise<{ messages: InboxMessage[] }>;
  addInboxTag(options: { tag: string; messageId: string }): Promise<void>;
  removeInboxTag(options: { tag: string; messageId: string }): Promise<void>;
}): InboxModule {
  return {
    async fetchMessages() {
      const { messages } = await plugin.fetchInboxMessages();
      return messages;
    },
    addTag: (tag, messageId) => plugin.addInboxTag({ tag, messageId }),
    removeTag: (tag, messageId) => plugin.removeInboxTag({ tag, messageId }),
  };
}
