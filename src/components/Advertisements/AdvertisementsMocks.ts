/**
 * AdvertisementsMocks module is responsible for providing the necessary mock data,
 * Apollo Client configuration, and utilities for testing the Advertisements component.
 * It simulates various backend responses to facilitate isolated frontend testing.
 *
 * @remarks
 * - Configures a mock `ApolloClient` with `authLink` to simulate bearer token headers.
 * - Defines `dateConstants` to ensure consistent date assertions across timezones.
 * - Provides tailored mock scenarios: Active/Completed lists, Infinite Scrolling, and Error states.
 * - Includes mutation mocks for Creating, Updating, and Deleting advertisements.
 * - Uses `act` wrappers in utility functions to handle async React state updates.
 *
 * @example
 * ```tsx
 * import { getActiveAdvertisementMocks } from './AdvertisementsMocks';
 * import { MockedProvider } from '@apollo/client/testing';
 *
 * render(
 * <MockedProvider mocks={getActiveAdvertisementMocks}>
 * <Advertisements />
 * </MockedProvider>
 * );
 * ```
 *
 * @file AdvertisementsMocks.ts
 * @category Mocks
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
import {
  ADD_ADVERTISEMENT_MUTATION,
  DELETE_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';

type AdvertisementType = 'banner' | 'pop_up' | 'menu';

interface IAttachment {
  mimeType: string;
  url: string;
  __typename?: string;
}

interface IAdvertisementNode {
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

interface IPageInfo {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  __typename?: string;
}

interface IEdge {
  node: IAdvertisementNode;
  __typename?: string;
}

interface IAdvertisementListMock {
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

interface IAdvertisementNodeParams {
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

interface IAdvertisementListParams {
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

interface IBaseMutationMock<T = unknown> {
  request: {
    query: DocumentNode;
    variables: T;
  };
  result?: {
    data: unknown;
  };
  error?: Error;
}

export const dateConstants = {
  create: {
    startAtISO: '2024-12-31T18:30:00.000Z',
    endAtISO: '2030-02-01T18:30:00.000Z',
    startAtCalledWith: '2024-12-31T00:00:00.000Z',
    endAtCalledWith: '2030-02-01T00:00:00.000Z',
    startISOReceived: '2024-12-30T18:30:00.000Z',
    endISOReceived: '2030-01-31T18:30:00.000Z',
    endBeforeStartISO: '2010-02-01T18:30:00.000Z',
    endBeforeStartCalledWith: '2010-02-01T00:00:00.000Z',
    endBeforeStartISOReceived: '2010-01-31T18:30:00.000Z',
  },
  update: {
    startAtISO: '2024-12-31T18:30:00.000Z',
    endAtISO: '2030-02-01T18:30:00.000Z',
    startAtCalledWith: '2024-12-31T00:00:00.000Z',
    endAtCalledWith: '2030-02-01T00:00:00.000Z',
    startISOReceived: '2024-12-30T18:30:00.000Z',
    endISOReceived: '2030-01-31T18:30:00.000Z',
    endBeforeStartISO: '2010-02-01T18:30:00.000Z',
    endBeforeStartCalledWith: '2010-02-01T00:00:00.000Z',
    endBeforeStartISOReceived: '2010-01-31T18:30:00.000Z',
  },
};

export const { create: createDates, update: updateDates } = dateConstants;

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

const createAdvertisementNode = ({
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

const createAdvertisementListMock = ({
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
          } as IPageInfo,
        },
      },
    },
  },
});

const createBatchNodes = (
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

const createMutationMock = <T>(
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

export const emptyMocks: IAdvertisementListMock[] = [
  createAdvertisementListMock({
    isCompleted: false,
    edges: [],
    hasNextPage: false,
    endCursor: null,
  }),
  createAdvertisementListMock({
    isCompleted: true,
    edges: [],
    hasNextPage: false,
    endCursor: null,
  }),
];

const completedAdNode = createAdvertisementNode({
  id: '1',
  name: 'Cookie shop',
  description: 'this is a completed advertisement',
  endAt: new Date().toISOString(),
});

const activeAdNode = createAdvertisementNode({
  id: '2',
  name: 'Cookie shop',
  description: 'this is an active advertisement',
  endAt: new Date('2030-01-01').toISOString(),
});

export const getCompletedAdvertisementMocks: IAdvertisementListMock[] = [
  createAdvertisementListMock({ isCompleted: true, edges: [completedAdNode] }),
  createAdvertisementListMock({ isCompleted: true, edges: [completedAdNode] }),
  createAdvertisementListMock({ isCompleted: false, edges: [] }),
  createAdvertisementListMock({ isCompleted: false, edges: [] }),
];

export const getActiveAdvertisementMocks: IAdvertisementListMock[] = [
  createAdvertisementListMock({ isCompleted: false, edges: [activeAdNode] }),
  createAdvertisementListMock({ isCompleted: false, edges: [activeAdNode] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
];

export const deleteAdvertisementMocks = [
  createAdvertisementListMock({ isCompleted: true, edges: [completedAdNode] }),
  createAdvertisementListMock({ isCompleted: true, edges: [completedAdNode] }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [],
    hasNextPage: false,
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [],
    hasNextPage: false,
  }),
  createMutationMock(
    DELETE_ADVERTISEMENT_MUTATION,
    { id: '1' },
    { deleteAdvertisement: { id: '1' } },
  ),
];

export const initialArchivedData: IAdvertisementListMock[] = [
  createAdvertisementListMock({
    isCompleted: false,
    edges: [],
    hasNextPage: false,
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [],
    hasNextPage: false,
  }),
  createAdvertisementListMock({
    isCompleted: true,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is an active advertisement',
      new Date('2025-02-03').toISOString(),
    ),
  }),
  createAdvertisementListMock({
    isCompleted: true,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is an active advertisement',
      new Date('2025-02-03').toISOString(),
    ),
  }),
  createAdvertisementListMock({
    isCompleted: true,
    after: 'cursor-2',
    edges: [
      createAdvertisementNode({
        id: '121',
        name: 'Cookie shop infinite 1',
        description: 'this is an infinitely scrolled archived advertisement',
        endAt: new Date('2025-02-03').toISOString(),
      }),
    ],
    startCursor: 'cursor-2',
    endCursor: 'cursor-3',
    hasNextPage: false,
    hasPreviousPage: true,
  }),
];

export const initialActiveData: IAdvertisementListMock[] = [
  createAdvertisementListMock({
    isCompleted: true,
    edges: [],
    hasNextPage: false,
  }),
  createAdvertisementListMock({
    isCompleted: true,
    edges: [],
    hasNextPage: false,
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is an active advertisement',
      new Date('2030-02-03').toISOString(),
    ),
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is an active advertisement',
      new Date('2030-02-03').toISOString(),
    ),
  }),
  createAdvertisementListMock({
    isCompleted: false,
    after: 'cursor-2',
    edges: [
      createAdvertisementNode({
        id: '121',
        name: 'Cookie shop infinite 1',
        description: 'this is an infinitely scrolled active advertisement',
        endAt: new Date('2030-02-03').toISOString(),
      }),
    ],
    startCursor: 'cursor-2',
    endCursor: 'cursor-3',
    hasNextPage: false,
    hasPreviousPage: true,
  }),
];

export const filterActiveAdvertisementData: IAdvertisementListMock[] = [
  createAdvertisementListMock({
    isCompleted: false,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is an active advertisement',
      new Date('2030-01-01').toISOString(),
      true,
    ),
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is an active advertisement',
      new Date('2030-01-01').toISOString(),
      true,
    ),
  }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
];

export const filterCompletedAdvertisementData: IAdvertisementListMock[] = [
  createAdvertisementListMock({
    isCompleted: true,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is a completed advertisement',
      new Date().toISOString(),
      true,
    ),
  }),
  createAdvertisementListMock({
    isCompleted: true,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is a completed advertisement',
      new Date().toISOString(),
      true,
    ),
  }),
  createAdvertisementListMock({ isCompleted: false, edges: [] }),
  createAdvertisementListMock({ isCompleted: false, edges: [] }),
];

export const createAdvertisement = [
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      name: 'Ad1',
      type: 'banner',
      startAt: createDates.startAtCalledWith,
      endAt: createDates.endAtCalledWith,
    },
    { createAdvertisement: { id: '123' } },
  ),
  createAdvertisementListMock({
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is a new advertisement created for testing.',
        startAt: createDates.startAtISO,
        endAt: createDates.endAtISO,
      }),
    ],
  }),
  createAdvertisementListMock({
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is a new advertisement created for testing.',
        startAt: createDates.startAtISO,
        endAt: createDates.endAtISO,
      }),
    ],
  }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
];

export const createAdvertisementWithoutName = [
  ...getActiveAdvertisementMocks,
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      type: 'banner',
      startAt: createDates.startAtCalledWith,
      endAt: createDates.endAtCalledWith,
    },
    { createAdvertisement: { id: '123' } },
  ),
];

export const createAdvertisementWithEndDateBeforeStart = [
  ...getActiveAdvertisementMocks,
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      type: 'banner',
      startAt: createDates.startAtCalledWith,
      endAt: createDates.endBeforeStartCalledWith,
    },
    { createAdvertisement: { id: '123' } },
  ),
];

export const createAdvertisementError = [
  ...getActiveAdvertisementMocks,
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      type: 'banner',
      startAt: createDates.startAtCalledWith,
      endAt: createDates.endAtCalledWith,
    },
    undefined,
    new Error('An unknown error occurred'),
  ),
];

export const updateAdMocks = [
  // First pair: completed query fires first in component
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is a new advertisement created for testing.',
        startAt: updateDates.startAtISO,
        endAt: updateDates.endAtISO,
      }),
    ],
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is a new advertisement created for testing.',
        startAt: updateDates.startAtISO,
        endAt: updateDates.endAtISO,
      }),
    ],
  }),
  // Second pair for refetch after update
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is a new advertisement created for testing.',
        startAt: updateDates.startAtISO,
        endAt: updateDates.endAtISO,
      }),
    ],
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is a new advertisement created for testing.',
        startAt: updateDates.startAtISO,
        endAt: updateDates.endAtISO,
      }),
    ],
  }),
  createMutationMock(
    UPDATE_ADVERTISEMENT_MUTATION,
    {
      id: '1',
      description: 'This is an updated advertisement',
      startAt: updateDates.startAtCalledWith,
      endAt: updateDates.endAtCalledWith,
    },
    { updateAdvertisement: { id: '1' } },
  ),
  // Third pair after mutation completes
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is an updated advertisement',
        startAt: updateDates.startAtISO,
        endAt: updateDates.endAtISO,
      }),
    ],
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is an updated advertisement',
        startAt: updateDates.startAtISO,
        endAt: updateDates.endAtISO,
      }),
    ],
  }),
];

export const fetchErrorMocks = [
  createMutationMock(
    ORGANIZATION_ADVERTISEMENT_LIST,
    { id: '1', first: 6, after: null, where: { isCompleted: false } },
    undefined,
    new Error('Failed to fetch advertisements'),
  ),
  createMutationMock(
    ORGANIZATION_ADVERTISEMENT_LIST,
    { id: '1', first: 6, after: null, where: { isCompleted: true } },
    undefined,
    new Error('Failed to fetch advertisements'),
  ),
];
