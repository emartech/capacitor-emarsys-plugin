import { createInboxModule } from '../inbox';

import { createMockBridge } from './mockBridge';
import type { MockedBridge } from './mockBridge';

describe('Emarsys inbox module', () => {
  let bridge: MockedBridge;
  let inbox: ReturnType<typeof createInboxModule>;

  beforeEach(() => {
    bridge = createMockBridge();
    inbox = createInboxModule(bridge);
  });

  describe('fetchMessages', () => {
    it('unwraps the messages array from the native response', async () => {
      const mockMessages = [
        {
          id: 'msg1',
          campaignId: 'campaign1',
          title: 'Title',
          body: 'Body',
          receivedAt: 1700000000000,
          tags: ['seen'],
          properties: { key: 'value' },
          actions: [{ id: 'a1', title: 'Open', type: 'MEAppEvent', name: 'test', payload: { k: 'v' } }],
        },
      ];
      bridge.fetchInboxMessages.mockResolvedValueOnce({ messages: mockMessages });

      const result = await inbox.fetchMessages();

      expect(result).toEqual(mockMessages);
      expect(bridge.fetchInboxMessages).toHaveBeenCalledTimes(1);
    });

    it('returns an empty array when there are no messages', async () => {
      bridge.fetchInboxMessages.mockResolvedValueOnce({ messages: [] });

      await expect(inbox.fetchMessages()).resolves.toEqual([]);
    });

    it('rejects when the native bridge rejects', async () => {
      bridge.fetchInboxMessages.mockRejectedValueOnce(new Error('Fetch inbox messages error'));

      await expect(inbox.fetchMessages()).rejects.toThrow('Fetch inbox messages error');
    });
  });
  describe('API surface', () => {
    it('exposes all inbox methods as functions', () => {
      expect(typeof inbox.fetchMessages).toBe('function');
    });
  });
});
