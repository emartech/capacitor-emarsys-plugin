/**
 * @jest-environment jsdom
 */
import type { InlineInAppEvent } from '../definitions';
import { registerInlineInAppElement, INLINE_IN_APP_TAG } from '../inlineInAppElement';
import type { DOMCustomEvent, InlineInAppBridge } from '../inlineInAppElement';

const loadInlineInApp = jest.fn().mockResolvedValue(undefined);
let emitNative: (event: InlineInAppEvent) => void = () => undefined;

const bridge: InlineInAppBridge = {
  loadInlineInApp: (o) => loadInlineInApp(o),
  addListener: (_eventName, fn) => {
    emitNative = fn;
    return Promise.resolve({ remove: jest.fn() });
  },
};

beforeAll(() => {
  global.ResizeObserver = class {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observe() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disconnect() {}
  } as unknown as typeof ResizeObserver;

  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 10,
    y: 20,
    width: 300,
    height: 125,
    top: 20,
    left: 10,
    right: 310,
    bottom: 145,
    toJSON: () => ({}),
  } as DOMRect);
  registerInlineInAppElement(bridge);
});

beforeEach(() => {
  document.body.innerHTML = '';
  loadInlineInApp.mockClear();
});

function addElement(): HTMLElement & { loadInApp(viewId: string): Promise<void> } {
  const inlineInapp = document.createElement(INLINE_IN_APP_TAG) as HTMLElement & {
    loadInApp(viewId: string): Promise<void>;
  };
  document.body.appendChild(inlineInapp);
  return inlineInapp;
}

describe('emarsys-inline-inapp element', () => {
  it('registers the custom element', () => {
    expect(customElements.get(INLINE_IN_APP_TAG)).toBeDefined();
  });

  it('does not touch the bridge until loadInApp is called', () => {
    addElement();
    expect(loadInlineInApp).not.toHaveBeenCalled();
  });

  it('loadInApp delegates with a generated viewRef, the viewId, and the measured frame', async () => {
    const inlineInapp = addElement();

    await inlineInapp.loadInApp('campaign-1');

    expect(loadInlineInApp).toHaveBeenCalledTimes(1);
    const arg = loadInlineInApp.mock.calls[0][0];
    expect(arg.viewId).toBe('campaign-1');
    expect(arg.viewRef).toMatch(/^inline_\d+$/);
    expect(arg.frame).toEqual({ x: 10, y: 20, width: 300, height: 125 });
  });

  it('passes z-index when set', async () => {
    const inlineInapp = addElement();
    inlineInapp.setAttribute('z-index', '5');

    await inlineInapp.loadInApp('campaign-1');

    expect(loadInlineInApp.mock.calls[0][0].zIndex).toBe(5);
  });

  it('routes a matching native appEvent to a DOM CustomEvent on the element', async () => {
    const inlineInapp = addElement();
    await inlineInapp.loadInApp('campaign-1');
    const viewRef = loadInlineInApp.mock.calls[0][0].viewRef;

    const received: DOMCustomEvent[] = [];
    inlineInapp.addEventListener('emarsys:appevent', (e) => received.push(e as DOMCustomEvent));

    emitNative({ viewRef, type: 'appEvent', name: 'buttonClicked', payload: { id: 42 } });

    expect(received).toHaveLength(1);
    expect(received[0].detail).toEqual({ name: 'buttonClicked', payload: { id: 42 } });
  });

  it('emits completion and close as their own DOM events', async () => {
    const inlineInapp = addElement();
    await inlineInapp.loadInApp('campaign-1');
    const viewRef = loadInlineInApp.mock.calls[0][0].viewRef;

    const completion = jest.fn();
    const close = jest.fn();
    inlineInapp.addEventListener('emarsys:completion', (e) => completion((e as DOMCustomEvent).detail));
    inlineInapp.addEventListener('emarsys:close', (e) => close((e as DOMCustomEvent).detail));

    emitNative({ viewRef, type: 'completion', error: null });
    emitNative({ viewRef, type: 'close' });

    expect(completion).toHaveBeenCalledWith({ error: null });
    expect(close).toHaveBeenCalledWith({});
  });

  it('routes events to the correct element when multiple are mounted', async () => {
    const a = addElement();
    const b = addElement();
    await a.loadInApp('a');
    await b.loadInApp('b');
    const refA = loadInlineInApp.mock.calls[0][0].viewRef;
    const refB = loadInlineInApp.mock.calls[1][0].viewRef;
    expect(refA).not.toBe(refB);

    const aEvents = jest.fn();
    const bEvents = jest.fn();
    a.addEventListener('emarsys:appevent', aEvents);
    b.addEventListener('emarsys:appevent', bEvents);

    emitNative({ viewRef: refB, type: 'appEvent', name: 'onlyB' });

    expect(aEvents).not.toHaveBeenCalled();
    expect(bEvents).toHaveBeenCalledTimes(1);
  });

  it('stops routing events to a detached element', async () => {
    const inlineInapp = addElement();
    await inlineInapp.loadInApp('campaign-1');
    const viewRef = loadInlineInApp.mock.calls[0][0].viewRef;
    const handler = jest.fn();
    inlineInapp.addEventListener('emarsys:appevent', handler);

    inlineInapp.remove();
    emitNative({ viewRef, type: 'appEvent', name: 'afterDetach' });

    expect(handler).not.toHaveBeenCalled();
  });

  it('ignores native events with an unknown viewRef', async () => {
    const inlineInapp = addElement();
    await inlineInapp.loadInApp('campaign-1');
    const handler = jest.fn();
    inlineInapp.addEventListener('emarsys:appevent', handler);

    emitNative({ viewRef: 'inline_does_not_exist', type: 'appEvent', name: 'x' });

    expect(handler).not.toHaveBeenCalled();
  });
});
