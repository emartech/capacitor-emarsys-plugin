import { Emarsys } from 'capacitor-emarsys-plugin';

export const INAPP_TAB_HTML = `
  <div class="tab-pane" id="tab-inapp">
    <h1 class="page-title">In-App</h1>
    <button class="btn" id="pause-inapp">Pause</button>
    <button class="btn" id="resume-inapp">Resume</button>
    <button class="btn" id="is-inapp-paused">Is Paused?</button>
  </div>
`;

export function initInAppTab(root) {
  root.querySelector('#pause-inapp').addEventListener('click', async () => {
    try {
      await Emarsys.inApp.pause();
      alert('Pause\n\nSuccess');
    } catch (e) {
      alert('Pause\n\n' + e.message);
    }
  });

  root.querySelector('#resume-inapp').addEventListener('click', async () => {
    try {
      await Emarsys.inApp.resume();
      alert('Resume\n\nSuccess');
    } catch (e) {
      alert('Resume\n\n' + e.message);
    }
  });

  root.querySelector('#is-inapp-paused').addEventListener('click', async () => {
    try {
      const paused = await Emarsys.inApp.isPaused();
      alert('Is Paused?\n\n' + paused);
    } catch (e) {
      alert('Is Paused?\n\n' + e.message);
    }
  });
}
