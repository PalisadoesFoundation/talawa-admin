/**
 * @file AdvertisementsMocks.utils.ts
 * @description Utility functions and Apollo Client setup for advertisement mocks.
 */

import { act } from 'react';
import type { DocumentNode } from '@apollo/client';
import { BACKEND_URL } from 'Constant/constant';
import useLocalStorage from 'utils/useLocalstorage';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import type {
  IEdge,
  IAdvertisementNodeParams,
  IAdvertisementListParams,
  IAdvertisementListMock,
  IBaseMutationMock,
} from './AdvertisementsMocks.types';

const httpLink = new HttpLink({
  uri: BACKEND_URL,
});

const { getItem } = useLocalStorage();

const authLink = setContext((_, { headers }) => {
  const token = getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client: ApolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([authLink, httpLink]),
});

export async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

export const createAdvertisementNode = ({
  id,
  name,
  description,
  startAt = new Date('2025-02-02').toISOString(),
  endAt,
  type = 'banner',
  organizationId = '1',
  createdAt = new Date('2025-02-02').toISOString(),
  attachments = [
    {
      mimeType: 'image/jpeg',
      url: 'http://127.0.0.1:4000/objects/01IR2V4ROX1FCZ3EQN518NE37Z',
    },
  ],
}: IAdvertisementNodeParams): IEdge => ({
  node: {
    id,
    __typename: 'Advertisement',
    createdAt,
    description,
    endAt,
    organization: {
      id: organizationId,
      __typename: 'Organization',
    },
    name,
    startAt,
    type,
    attachments: (attachments || []).map((a) => ({
      ...a,
      __typename: 'AdvertisementAttachment',
    })),
  },
  __typename: 'AdvertisementEdge',
});

export const createAdvertisementListMock = ({
  id = '1',
  first = 6,
  after = null,
  isCompleted = false,
  edges = [],
  startCursor = 'cursor-1',
  endCursor = 'cursor-2',
  hasNextPage = true,
  hasPreviousPage = false,
}: IAdvertisementListParams): IAdvertisementListMock => ({
  request: {
    query: ORGANIZATION_ADVERTISEMENT_LIST,
    variables: {
      id,
      first,
      after,
      where: {
        isCompleted,
      },
    },
  },
  result: {
    data: {
      organization: {
        __typename: 'Organization',
        advertisements: {
          __typename: 'AdvertisementConnection',
          edges,
          pageInfo: {
            startCursor,
            endCursor,
            hasNextPage,
            hasPreviousPage,
            __typename: 'PageInfo',
          },
        },
      },
    },
  },
});

export const createBatchNodes = (
  count: number,
  baseName: string,
  description: string,
  endAt: string,
  numbered = false,
): IEdge[] => {
  return Array.from({ length: count }, (_, i) =>
    createAdvertisementNode({
      id: String(i + 1),
      name: `${baseName} ${i + 1}`,
      description: numbered ? `${description} ${i + 1}` : description,
      endAt,
    }),
  );
};

export const createMutationMock = <T>(
  query: DocumentNode,
  variables: T,
  resultData?: unknown,
  error?: Error,
): IBaseMutationMock<T> => {
  const mock: IBaseMutationMock<T> = {
    request: {
      query,
      variables,
    },
  };

  if (error) {
    mock.error = error;
  } else {
    mock.result = {
      data: resultData || {},
    };
  }

  return mock;
};
