import { Emarsys } from 'capacitor-emarsys-plugin';

export const INBOX_TAB_HTML = `
  <div class="tab-pane" id="tab-inbox">
    <h1 class="page-title">Inbox</h1>
    <button class="btn" id="fetch-inbox-messages">Fetch Messages</button>
  </div>
`;

export function initInboxTab(root) {
  root.querySelector('#fetch-inbox-messages').addEventListener('click', async () => {
    try {
      const messages = await Emarsys.inbox.fetchMessages();
      alert('Fetch Messages\n\n' + JSON.stringify(messages, null, 2));
    } catch (e) {
      alert('Fetch Messages\n\n' + e.message);
    }
  });

}
