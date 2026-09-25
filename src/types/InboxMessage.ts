export interface InboxAction {
  id: string;
  title: string;
  type: string;
  name?: string;
  payload?: Record<string, unknown>;
  url?: string;
}

export interface InboxMessage {
  id: string;
  campaignId: string;
  collapseId?: string;
  title: string;
  body: string;
  imageUrl?: string;
  imageAltText?: string;
  receivedAt: number;
  updatedAt?: number;
  expiresAt?: number;
  tags?: string[];
  properties?: Record<string, string>;
  actions?: InboxAction[];
}
