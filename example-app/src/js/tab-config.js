import { Emarsys } from 'capacitor-emarsys-plugin';

export const CONFIG_TAB_HTML = `
  <div class="tab-pane active" id="tab-config">
    <h1 class="page-title">Contact</h1>
    <button class="btn" id="set-contact">Set Contact</button>
    <button class="btn" id="clear-contact">Clear Contact</button>

    <hr class="section-separator" />
    <h1 class="page-title" style="margin-top:20px">Event Tracking</h1>
    <button class="btn" id="track-custom-event">Track Custom Event</button>
  </div>
`;

export function initConfigTab(root) {
  root.querySelector('#set-contact').addEventListener('click', async () => {
    try {
      await Emarsys.setContact({ contactFieldId: 3, contactFieldValue: 'demoapp@emarsys.com' });
      alert('Set Contact\n\nSuccess');
    } catch (e) {
      alert('Set Contact\n\n' + e.message);
    }
  });

  root.querySelector('#clear-contact').addEventListener('click', async () => {
    try {
      await Emarsys.clearContact();
      alert('Clear Contact\n\nSuccess');
    } catch (e) {
      alert('Clear Contact\n\n' + e.message);
    }
  });

  root.querySelector('#track-custom-event').addEventListener('click', async () => {
    try {
      await Emarsys.trackCustomEvent({
        eventName: 'test_event',
        eventAttributes: { timestamp: new Date().toISOString(), source: 'demo_app' },
      });
      alert('Track Custom Event\n\nSuccess');
    } catch (e) {
      alert('Track Custom Event\n\n' + e.message);
    }
  });
}
