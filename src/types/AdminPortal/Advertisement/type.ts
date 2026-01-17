import type { User } from '../../shared-components/User/type';
import type { DefaultConnectionPageInfo } from 'types/AdminPortal/pagination';

// enum of the type of advertisements
export enum AdvertisementType {
  Banner = 'banner',
  Menu = 'menu',
  Popup = 'pop_up',
}

// advertisement type
export type Advertisement = {
  id: string;
  createdAt: Date;
  description?: string;
  creator?: User;
  organization: {
    id: string;
  };
  endAt: Date;
  name: string;
  orgId: string;
  startAt: Date;
  type: AdvertisementType;
  updatedAt: Date;
  attachments?: AdvertisementAttachment[];
};

// Advertisement Attachment Type
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

export type CreateAdvertisementInput = {
  name: string;
  description?: string;
  type: AdvertisementType;
  organizationId: string;
  startAt: Date;
  endAt: Date;
  attachments: File[];
};

export type CreateAdvertisementPayload = {
  advertisement?: Advertisement;
};
