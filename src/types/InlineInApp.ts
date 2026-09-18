export interface InlineInAppRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InlineInAppEvent {
  viewRef: string;
  type: 'appEvent' | 'completion' | 'close';
  name?: string;
  payload?: Record<string, unknown>;
  error?: string | null;
}

export type InlineInAppEventListener = (event: InlineInAppEvent) => void;
