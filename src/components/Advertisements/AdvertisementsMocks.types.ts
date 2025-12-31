/**
 * @file AdvertisementsMocks.types.ts
 * @description Type definitions for advertisement mocks.
 */

import type { DocumentNode } from '@apollo/client';

export type AdvertisementType = 'banner' | 'pop_up' | 'menu';

export interface IAttachment {
  mimeType: string;
  url: string;
  __typename?: string;
}

export interface IAdvertisementNode {
  id: string;
  createdAt: string;
  description: string;
  endAt: string;
  organization: {
    id: string;
    __typename?: string;
  };
  name: string;
  startAt: string;
  type: AdvertisementType;
  attachments: IAttachment[];
  __typename?: string;
}

export interface IPageInfo {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  __typename?: string;
}

export interface IEdge {
  node: IAdvertisementNode;
  __typename?: string;
}

export interface IAdvertisementListMock {
  request: {
    query: DocumentNode;
    variables: {
      id: string;
      first: number;
      after: string | null;
      where: {
        isCompleted: boolean;
      };
    };
  };
  result: {
    data: {
      organization: {
        __typename?: string;
        advertisements: {
          __typename?: string;
          edges: IEdge[];
          pageInfo: IPageInfo;
        };
      };
    };
  };
}

export interface IAdvertisementNodeParams {
  id: string;
  name: string;
  description: string;
  startAt?: string;
  endAt: string;
  type?: AdvertisementType;
  organizationId?: string;
  createdAt?: string;
  attachments?: IAttachment[];
}

export interface IAdvertisementListParams {
  id?: string;
  first?: number;
  after?: string | null;
  isCompleted?: boolean;
  edges?: IEdge[];
  startCursor?: string | null;
  endCursor?: string | null;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface IBaseMutationMock<T = unknown> {
  request: {
    query: DocumentNode;
    variables: T;
  };
  result?: {
    data: unknown;
  };
  error?: Error;
}
