import { Emarsys } from 'capacitor-emarsys-plugin';

export const CONFIG_TAB_HTML = `
  <div class="tab-pane active" id="tab-config">
    <h1 class="page-title">Contact</h1>
    <button class="btn" id="set-contact">Set Contact</button>
    <button class="btn" id="clear-contact">Clear Contact</button>

    <hr class="section-separator" />
    <h1 class="page-title" style="margin-top:20px">Event Tracking</h1>
    <button class="btn" id="track-custom-event">Track Custom Event</button>

    <hr class="section-separator" />
    <h1 class="page-title" style="margin-top:20px">Config</h1>
    <button class="btn" id="change-app-code">Change Application Code</button>
    <button class="btn" id="change-merchant-id">Change Merchant ID</button>
    <button class="btn" id="get-app-code">Get Application Code</button>
    <button class="btn" id="get-merchant-id">Get Merchant ID</button>
    <button class="btn" id="get-client-id">Get Client ID</button>
    <button class="btn" id="get-language-code">Get Language Code</button>
    <button class="btn" id="get-sdk-version">Get SDK Version</button>
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

  root.querySelector('#change-app-code').addEventListener('click', async () => {
    try {
      await Emarsys.config.changeApplicationCode('EMS08-CD6F6');
      alert('Change Application Code\n\nSuccess');
    } catch (e) {
      alert('Change Application Code\n\n' + e.message);
    }
  });

  root.querySelector('#change-merchant-id').addEventListener('click', async () => {
    try {
      await Emarsys.config.changeMerchantId('testMerchantId');
      alert('Change Merchant ID\n\nSuccess');
    } catch (e) {
      alert('Change Merchant ID\n\n' + e.message);
    }
  });

  root.querySelector('#get-app-code').addEventListener('click', async () => {
    try {
      const result = await Emarsys.config.getApplicationCode();
      alert('Get Application Code\n\n' + result);
    } catch (e) {
      alert('Get Application Code\n\n' + e.message);
    }
  });

  root.querySelector('#get-merchant-id').addEventListener('click', async () => {
    try {
      const result = await Emarsys.config.getMerchantId();
      alert('Get Merchant ID\n\n' + result);
    } catch (e) {
      alert('Get Merchant ID\n\n' + e.message);
    }
  });

  root.querySelector('#get-client-id').addEventListener('click', async () => {
    try {
      const result = await Emarsys.config.getClientId();
      alert('Get Client ID\n\n' + result);
    } catch (e) {
      alert('Get Client ID\n\n' + e.message);
    }
  });

  root.querySelector('#get-language-code').addEventListener('click', async () => {
    try {
      const result = await Emarsys.config.getLanguageCode();
      alert('Get Language Code\n\n' + result);
    } catch (e) {
      alert('Get Language Code\n\n' + e.message);
    }
  });

  root.querySelector('#get-sdk-version').addEventListener('click', async () => {
    try {
      const result = await Emarsys.config.getSdkVersion();
      alert('Get SDK Version\n\n' + result);
    } catch (e) {
      alert('Get SDK Version\n\n' + e.message);
    }
  });
}
