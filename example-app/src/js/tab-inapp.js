import { Emarsys } from 'capacitor-emarsys-plugin';

export const INAPP_TAB_HTML = `
  <div class="tab-pane" id="tab-inapp">
    <h1 class="page-title">In-App</h1>
    <button class="btn" id="pause-inapp">Pause</button>
    <button class="btn" id="resume-inapp">Resume</button>
    <button class="btn" id="is-inapp-paused">Is Paused?</button>
    <button class="btn" id="load-inline-inapp">Load Inline In-App</button>
    <emarsys-inline-inapp id="inline-view" style="display:block;width:100%;height:0;"></emarsys-inline-inapp>
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

  const inlineView = root.querySelector('#inline-view');

  inlineView.addEventListener('emarsys:completion', (e) => {
    if (e.detail.error) {
      inlineView.style.height = '0';
      alert('Inline In-App\n\nCompletion error: ' + e.detail.error);
    }
  });

  inlineView.addEventListener('emarsys:close', () => {
    console.log("close inline")
    inlineView.style.height = '0';
  });

  inlineView.addEventListener('emarsys:appevent', (e) => {
    alert('Inline In-App\n\nApp event: ' + e.detail.name + '\nPayload: ' + JSON.stringify(e.detail.payload, null, 2));
  });

  root.querySelector('#load-inline-inapp').addEventListener('click', async () => {
    try {
      inlineView.style.height = '125px';
      await inlineView.loadInApp('view-id');
    } catch (e) {
      inlineView.style.height = '0';
      alert('Load Inline In-App\n\n' + e.message);
    }
  });
}
