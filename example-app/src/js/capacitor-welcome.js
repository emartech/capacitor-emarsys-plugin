import { SplashScreen } from '@capacitor/splash-screen';
import { Camera } from '@capacitor/camera';
import { Emarsys } from 'capacitor-emarsys-plugin';

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();

      SplashScreen.hide();

      const root = this.attachShadow({ mode: 'open' });

      root.innerHTML = `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        display: block;
        width: 100%;
        height: 100%;
      }
      h1, h2, h3, h4, h5 {
        text-transform: uppercase;
      }
      .button {
        display: inline-block;
        padding: 10px;
        background-color: #73B5F6;
        color: #fff;
        font-size: 0.9em;
        border: 0;
        border-radius: 3px;
        text-decoration: none;
        cursor: pointer;
      }
      main {
        padding: 15px;
        padding-top: 60px;
      }
      main hr { height: 1px; background-color: #eee; border: 0; }
      main h1 {
        font-size: 1.4em;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 20px;
      }
      main h2 {
        font-size: 1.1em;
      }
      main h3 {
        font-size: 0.9em;
      }
      main p {
        color: #333;
      }
      main pre {
        white-space: pre-line;
      }
    </style>
    <div>
      <main>
        <h1>Emarsys Plugin Demo</h1>
        <button class="button" id="set-contact-button">Set Contact</button>
        <button class="button" id="clear-contact-button">Clear Contact</button>
        <button class="button" id="track-custom-event-button">Track Custom Event</button>

        <h2>Push</h2>
        <button class="button" id="set-push-token-button">Set Push Token</button>
        <button class="button" id="clear-push-token-button">Clear Push Token</button>
        <button class="button" id="get-push-token-button">Get Push Token</button>
      </main>
    </div>
    `;
    }

    connectedCallback() {
      const self = this;

      self.shadowRoot.querySelector('#set-contact-button').addEventListener('click', async function (e) {
        try {
          await Emarsys.setContact({
            contactFieldId: 3,
            contactFieldValue: "demoapp@emarsys.com"
          });
          console.log('Set contact success!');
          alert('Set contact success!');
        } catch (error) {
          console.error('Set contact error:', error);
          alert('Set contact error: ' + error);
        }
      });

      self.shadowRoot.querySelector('#clear-contact-button').addEventListener('click', async function (e) {
        try {
          await Emarsys.clearContact();
          console.log('Clear contact success!');
          alert('Clear contact success!');
        } catch (error) {
          console.error('Clear contact error:', error);
          alert('Clear contact error: ' + error);
        }
      });

      self.shadowRoot.querySelector('#track-custom-event-button').addEventListener('click', async function (e) {
        try {
          await Emarsys.trackCustomEvent({
            eventName: 'track_custom_event',
            eventAttributes: {
              'timestamp': new Date().toISOString(),
              'source': 'demo_app'
            }
          });
          console.log('Track custom event success!');
          alert('Event tracked successfully!');
        } catch (error) {
          console.error('Track custom event error:', error);
          alert('Track custom event error: ' + error);
        }
      });

      self.shadowRoot.querySelector('#set-push-token-button').addEventListener('click', async function () {
        try {
          await Emarsys.push.setPushToken('c4e8c9d2a1b3f5e7091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f70');
          console.log('Set push token success!');
          alert('Set push token success!');
        } catch (error) {
          console.error('Set push token error:', error.message || error);
          alert('Set push token error: ' + (error.message || error));
        }
      });

      self.shadowRoot.querySelector('#clear-push-token-button').addEventListener('click', async function () {
        try {
          await Emarsys.push.clearPushToken();
          console.log('Clear push token success!');
          alert('Clear push token success!');
        } catch (error) {
          console.error('Clear push token error:', error.message || error);
          alert('Clear push token error: ' + (error.message || error));
        }
      });

      self.shadowRoot.querySelector('#get-push-token-button').addEventListener('click', async function () {
        try {
          const pushToken = await Emarsys.push.getPushToken();
          console.log('Get push token success:', pushToken);
          alert('Push token: ' + (pushToken || '(none)'));
        } catch (error) {
          console.error('Get push token error:', error.message || error);
          alert('Get push token error: ' + (error.message || error));
        }
      });

    }
  },
);

window.customElements.define(
  'capacitor-welcome-titlebar',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 15px 15px 15px 15px;
        text-align: center;
        background-color: #73B5F6;
      }
      ::slotted(h1) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 0.9em;
        font-weight: 600;
        color: #fff;
      }
    </style>
    <slot></slot>
    `;
    }
  },
);
