import { Emarsys } from 'capacitor-emarsys-plugin';

import { CONFIG_TAB_HTML, initConfigTab } from './tab-config.js';
import { INAPP_TAB_HTML, initInAppTab } from './tab-inapp.js';
import { PUSH_TAB_HTML, initPushTab } from './tab-push.js';

// ---------------------------------------------------------------------------
// Shell template
// ---------------------------------------------------------------------------

const TEMPLATE = `
<style>
  :host {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #fff;
  }

  .safe-top {
    background: #595959;
    height: env(safe-area-inset-top, 20px);
  }

  .app-title {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    padding: 16px;
    background: #595959;
    color: #fff;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .tab-content {
    flex: 1;
    overflow-y: auto;
  }

  .tab-pane {
    display: none;
    padding: 24px 16px;
    max-width: 420px;
    margin: 0 auto;
  }

  .tab-pane.active {
    display: block;
  }

  .page-title {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 20px 0;
  }

  .btn {
    display: block;
    width: 100%;
    padding: 14px 16px;
    margin-top: 12px;
    background: #595959;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    text-align: left;
    cursor: pointer;
  }

  .btn:active {
    opacity: 0.8;
  }

  .section-separator {
    border: none;
    border-top: 1px solid #ddd;
    margin: 24px 0 0 0;
  }

  .tab-bar {
    display: flex;
    border-top: 1px solid #ddd;
    background: #fff;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    flex-shrink: 0;
  }

  .tab-btn {
    flex: 1;
    padding: 10px 4px 8px;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    background: none;
    border: none;
    border-top: 3px solid transparent;
    color: #999;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tab-btn.active {
    color: #595959;
    border-top-color: #595959;
  }
</style>

<div class="safe-top"></div>
<div class="app-title">Emarsys Capacitor Plugin</div>

<div class="tab-content">
  ${CONFIG_TAB_HTML}
  ${PUSH_TAB_HTML}
  ${INAPP_TAB_HTML}
</div>

<div class="tab-bar">
  <button class="tab-btn active" data-tab="config">Config</button>
  <button class="tab-btn" data-tab="push">Push</button>
  <button class="tab-btn" data-tab="inapp">In-App</button>
</div>
`;

// ---------------------------------------------------------------------------
// Tab navigation
// ---------------------------------------------------------------------------

function initTabs(root) {
  const tabBtns = root.querySelectorAll('.tab-btn');
  const tabPanes = root.querySelectorAll('.tab-pane');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      root.querySelector('#tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ---------------------------------------------------------------------------
// Web component
// ---------------------------------------------------------------------------

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = TEMPLATE;
    }

    connectedCallback() {
      const root = this.shadowRoot;
      initTabs(root);

      Emarsys.addEventListener((event) => {
        console.log('Emarsys event:', event);
        alert('Emarsys Event\n\nName: ' + event.eventName + '\nPayload: ' + JSON.stringify(event.payload, null, 2));
      });

      initConfigTab(root);
      initPushTab(root);
      initInAppTab(root);
    }
  },
);
