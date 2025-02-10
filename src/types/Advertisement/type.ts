import type { User } from '../user';
import type { DefaultConnectionPageInfo } from '../pagination';
import type { URL } from 'url';

export const AdvertisementType = {
  BANNER: 'BANNER',
  MENU: 'MENU',
  POPUP: 'POPUP',
} as const;

type AdvertisementType =
  (typeof AdvertisementType)[keyof typeof AdvertisementType];

export type Advertisement = {
  _id: string;
  createdAt: Date;
  creator?: User; // Optional
  endDate: Date;
  mediaUrl: URL;
  name: string;
  orgId: string;
  startDate: Date;
  type: AdvertisementType;
  updatedAt: Date;
};

export type AdvertisementEdge = {
  cursor?: string; // Optional
  node?: Advertisement; // Optional
};

export type AdvertisementsConnection = {
  edges?: AdvertisementEdge[]; // Optional
  pageInfo?: DefaultConnectionPageInfo; // Optional
  totalCount?: number; // Optional
};

export type CreateAdvertisementInput = {
  endDate: Date;
  name: string;
  organizationId: string;
  startDate: Date;
  type: AdvertisementType;
  mediaFile: string;
};

export type CreateAdvertisementPayload = {
  advertisement?: Advertisement; // Optional
};
