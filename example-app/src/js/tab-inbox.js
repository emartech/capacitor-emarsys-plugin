import { Emarsys } from 'capacitor-emarsys-plugin';

export const INBOX_TAB_HTML = `
  <div class="tab-pane" id="tab-inbox">
    <h1 class="page-title">Inbox</h1>
    <button class="btn" id="fetch-inbox-messages">Fetch Messages</button>
    <button class="btn" id="add-inbox-tag">Add Tag</button>
    <button class="btn" id="remove-inbox-tag">Remove Tag</button>
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

  root.querySelector('#add-inbox-tag').addEventListener('click', async () => {
    try {
      const messageId = "26411830216";
      const tag = 'seen';
      await Emarsys.inbox.addTag(tag, messageId);
      alert('Add Tag\n\nSuccess');
    } catch (e) {
      alert('Add Tag\n\n' + e.message);
    }
  });

  root.querySelector('#remove-inbox-tag').addEventListener('click', async () => {
    try {
      const messageId = "26411830216";
      const tag = 'seen';
      await Emarsys.inbox.removeTag(tag, messageId);
      alert('Remove Tag\n\nSuccess');
    } catch (e) {
      alert('Remove Tag\n\n' + e.message);
    }
  });
}
