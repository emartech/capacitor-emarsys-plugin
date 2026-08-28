import { Emarsys } from 'capacitor-emarsys-plugin';

export const PUSH_TAB_HTML = `
  <div class="tab-pane" id="tab-push">
    <h1 class="page-title">Push</h1>
    <button class="btn" id="set-push-token">Set Push Token</button>
    <button class="btn" id="clear-push-token">Clear Push Token</button>
    <button class="btn" id="get-push-token">Get Push Token</button>
  </div>
`;

export function initPushTab(root) {
  root.querySelector('#set-push-token').addEventListener('click', async () => {
    try {
      await Emarsys.push.setPushToken('c4e8c9d2a1b3f5e7091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f70');
      alert('Set Push Token\n\nSuccess');
    } catch (e) {
      alert('Set Push Token\n\n' + e.message);
    }
  });

  root.querySelector('#clear-push-token').addEventListener('click', async () => {
    try {
      await Emarsys.push.clearPushToken();
      alert('Clear Push Token\n\nSuccess');
    } catch (e) {
      alert('Clear Push Token\n\n' + e.message);
    }
  });

  root.querySelector('#get-push-token').addEventListener('click', async () => {
    try {
      const token = await Emarsys.push.getPushToken();
      alert('Get Push Token\n\n' + (token || '(none)'));
    } catch (e) {
      alert('Get Push Token\n\n' + e.message);
    }
  });
}
