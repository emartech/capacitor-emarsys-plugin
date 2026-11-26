import type { PluginListenerHandle } from '@capacitor/core';

import type { InlineInAppEvent, InlineInAppRect } from './definitions';

declare class ResizeObserver {
  constructor(callback: (entries: ResizeObserverEntry[]) => void);
  observe(target: Element): void;
  disconnect(): void;
}
declare interface ResizeObserverEntry {
  readonly contentRect: DOMRectReadOnly;
}

/** Alias for the DOM CustomEvent constructor — avoids confusion with Emarsys custom events. */
export const DOMCustomEvent = CustomEvent;
export type DOMCustomEvent<T = unknown> = CustomEvent<T>;

export interface InlineInAppBridge {
  loadInlineInApp(options: { viewRef: string; viewId: string; frame: InlineInAppRect; zIndex?: number }): Promise<void>;
  addListener(
    eventName: 'emarsysInlineInAppHandler',
    listenerFunc: (event: InlineInAppEvent) => void,
  ): Promise<PluginListenerHandle>;
}

export const INLINE_IN_APP_TAG = 'emarsys-inline-inapp';

let viewRefCounter = 0;

function nextViewRef(): string {
  viewRefCounter += 1;
  return `inline_${viewRefCounter}`;
}

export function registerInlineInAppElement(bridge: InlineInAppBridge): void {
  if (typeof customElements === 'undefined') {
    return;
  }
  if (customElements.get(INLINE_IN_APP_TAG)) {
    return;
  }

  const registry = new Map<string, EmarsysInlineInAppElement>();

  bridge.addListener('emarsysInlineInAppHandler', (event: InlineInAppEvent) => {
    const element = registry.get(event.viewRef);
    if (!element) return;
    element.handleNativeEvent(event);
  });

  class EmarsysInlineInAppElement extends HTMLElement {
    private readonly viewRef = nextViewRef();
    private lastViewId: string | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private lastHidden = false;

    connectedCallback(): void {
      registry.set(this.viewRef, this);
      this.resizeObserver = new ResizeObserver(() => this.updateFrame());
      this.resizeObserver.observe(this);
      window.addEventListener('scroll', this.handleScroll, { capture: true, passive: true });
      window.addEventListener('resize', this.handleScroll);
    }

    disconnectedCallback(): void {
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      window.removeEventListener('scroll', this.handleScroll, { capture: true } as EventListenerOptions);
      window.removeEventListener('resize', this.handleScroll);
      registry.delete(this.viewRef);
    }

    async loadInApp(viewId: string): Promise<void> {
      this.lastViewId = viewId;
      this.lastHidden = false;
      await bridge.loadInlineInApp({
        viewRef: this.viewRef,
        viewId,
        frame: this.measureFrame(),
        zIndex: this.zIndex(),
      });
    }

    handleNativeEvent(event: InlineInAppEvent): void {
      if (event.type === 'appEvent') {
        this.dispatchEvent(
          new DOMCustomEvent('emarsys:appevent', { detail: { name: event.name, payload: event.payload } }),
        );
      } else if (event.type === 'completion') {
        this.dispatchEvent(new DOMCustomEvent('emarsys:completion', { detail: { error: event.error ?? null } }));
      } else if (event.type === 'close') {
        this.dispatchEvent(new DOMCustomEvent('emarsys:close', { detail: {} }));
      }
    }

    private handleScroll = (): void => this.updateFrame();

    private updateFrame(): void {
      if (this.lastViewId === null) return;
      const rect = this.getBoundingClientRect();
      const isHidden = rect.width === 0 || rect.height === 0;
      if (isHidden && !this.lastHidden) {
        this.lastHidden = true;
        bridge.loadInlineInApp({
          viewRef: this.viewRef,
          viewId: this.lastViewId,
          frame: { x: 0, y: 0, width: 0, height: 0 },
        });
      } else if (!isHidden) {
        this.lastHidden = false;
        bridge.loadInlineInApp({
          viewRef: this.viewRef,
          viewId: this.lastViewId,
          frame: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
        });
      }
    }

    private zIndex(): number | undefined {
      const raw = this.getAttribute('z-index');
      if (raw === null) return undefined;
      const parsed = Number(raw);
      return Number.isNaN(parsed) ? undefined : parsed;
    }

    private measureFrame(): InlineInAppRect {
      const rect = this.getBoundingClientRect();
      return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    }
  }

  customElements.define(INLINE_IN_APP_TAG, EmarsysInlineInAppElement);
}
