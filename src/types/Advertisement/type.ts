import type { User } from '../User/type';
import type { DefaultConnectionPageInfo } from '../pagination';
import type { URL } from 'url';

export const AdvertisementType = {
  banner: 'banner',
  menu: 'menu',
  popup: 'popup',
} as const;

type AdvertisementType =
  (typeof AdvertisementType)[keyof typeof AdvertisementType];

export type Advertisement = {
  id: string;
  createdAt: Date;
  creator?: User;
  endAt: Date;
  attachmentUrl: URL;
  name: string;
  orgId: string;
  startAt: Date;
  type: AdvertisementType;
  updatedAt: Date;
  attachments?: AdvertisementAttachment[];
};

// Advertisement Attachment
export type AdvertisementAttachment = {
  url: string;
  mimeType: string;
};

export type AdvertisementEdge = {
  cursor?: string;
  node?: Advertisement;
};

export type AdvertisementsConnection = {
  edges?: AdvertisementEdge[];
  pageInfo?: DefaultConnectionPageInfo;
  totalCount?: number;
};

// Create Advertisement Input
export type CreateAdvertisementInput = {
  name: string;
  type: AdvertisementType;
  organizationId: string;
  startAt: Date;
  endAt: Date;
  mediaFile: string;
  attachments: File[];
};

export type CreateAdvertisementPayload = {
  advertisement?: Advertisement;
};
