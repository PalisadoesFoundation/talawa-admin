import { act } from 'react';
import type { NormalizedCacheObject, DocumentNode } from '@apollo/client';
import { BACKEND_URL } from 'Constant/constant';
import useLocalStorage from 'utils/useLocalstorage';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import {
  ADD_ADVERTISEMENT_MUTATION,
  DELETE_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';

type AdvertisementType = 'banner' | 'pop_up' | 'menu';

interface Attachment {
  mimeType: string;
  url: string;
}

interface AdvertisementNode {
  id: string;
  createdAt: string;
  description: string;
  endAt: string;
  organization: {
    id: string;
  };
  name: string;
  startAt: string;
  type: AdvertisementType;
  attachments: Attachment[];
}

interface PageInfo {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface Edge {
  node: AdvertisementNode;
}

interface AdvertisementListMock {
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
        advertisements: {
          edges: Edge[];
          pageInfo: PageInfo;
        };
      };
    };
  };
}

interface AdvertisementNodeParams {
  id: string;
  name: string;
  description: string;
  startAt?: string;
  endAt: string;
  type?: AdvertisementType;
  organizationId?: string;
  createdAt?: string;
  attachments?: Attachment[];
}

interface AdvertisementListParams {
  id?: string;
  first?: number;
  after?: string | null;
  isCompleted?: boolean;
  edges?: Edge[];
  startCursor?: string | null;
  endCursor?: string | null;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

interface BaseMutationMock<T = any> {
  request: {
    query: DocumentNode;
    variables: T;
  };
  result?: {
    data: any;
  };
  error?: Error;
}

const { getItem } = useLocalStorage();
export const mockFileForAdvertisementScreen = new File(
  ['dummy content'],
  'test.png',
  { type: 'image/png' },
);

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

export const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: { authorization: 'Bearer ' + getItem('token') || '' },
});

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
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
}: AdvertisementNodeParams): Edge => ({
  node: {
    id,
    createdAt,
    description,
    endAt,
    organization: {
      id: organizationId,
    },
    name,
    startAt,
    type,
    attachments,
  },
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
}: AdvertisementListParams): AdvertisementListMock => ({
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
        advertisements: {
          edges,
          pageInfo: {
            startCursor,
            endCursor,
            hasNextPage,
            hasPreviousPage,
          },
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
): Edge[] => {
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
  resultData?: any,
  error?: Error,
): BaseMutationMock<T> => {
  const mock: BaseMutationMock<T> = {
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

export const emptyMocks: AdvertisementListMock[] = [
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

export const getCompletedAdvertisementMocks: AdvertisementListMock[] = [
  createAdvertisementListMock({ isCompleted: true, edges: [completedAdNode] }),
  createAdvertisementListMock({ isCompleted: false, edges: [] }),
];

export const getActiveAdvertisementMocks: AdvertisementListMock[] = [
  createAdvertisementListMock({ isCompleted: false, edges: [activeAdNode] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
];

export const createAdSuccessMock = [
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      name: 'Ad1',
      type: 'banner',
      startAt: '2022-12-31T18:30:00.000Z',
      endAt: '2023-01-31T18:30:00.000Z',
      attachments: [mockFileForAdvertisementScreen],
      description: 'this advertisement is created by admin',
    },
    { createAdvertisement: { id: '1' } },
  ),
];

export const deleteAdvertisementMocks = [
  createAdvertisementListMock({ isCompleted: true, edges: [completedAdNode] }),
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

export const infiniteScrollMocks: AdvertisementListMock[] = [
  createAdvertisementListMock({
    isCompleted: true,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'First Ad',
        description: 'First batch advertisement',
        endAt: new Date().toISOString(),
      }),
    ],
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [],
    hasNextPage: false,
    endCursor: null,
    startCursor: null,
  }),
  createAdvertisementListMock({
    isCompleted: true,
    after: 'cursor-2',
    edges: [
      createAdvertisementNode({
        id: '2',
        name: 'Second Ad',
        description: 'Second batch advertisement',
        endAt: new Date().toISOString(),
        createdAt: new Date('2025-02-03').toISOString(),
        type: 'pop_up',
      }),
    ],
    startCursor: 'cursor-2',
    endCursor: 'cursor-3',
    hasNextPage: false,
    hasPreviousPage: true,
  }),
  createAdvertisementListMock({
    isCompleted: false,
    after: 'cursor-2',
    edges: [],
    startCursor: null,
    endCursor: null,
    hasNextPage: false,
    hasPreviousPage: false,
  }),
];

export const initialArchivedData: AdvertisementListMock[] = [
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

export const initialActiveData: AdvertisementListMock[] = [
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

export const filterActiveAdvertisementData: AdvertisementListMock[] = [
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
];

export const filterCompletedAdvertisementData: AdvertisementListMock[] = [
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
];

export const createAdvertisement = [
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      name: 'Ad1',
      type: 'banner',
      startAt: createDates.startISOReceived,
      endAt: createDates.endISOReceived,
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
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
];

export const createAdvertisementWithoutName = [
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      type: 'banner',
      startAt: createDates.startISOReceived,
      endAt: createDates.endISOReceived,
    },
    { createAdvertisement: { id: '123' } },
  ),
];

export const createAdvertisementWithEndDateBeforeStart = [
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      type: 'banner',
      startAt: createDates.startISOReceived,
      endAt: createDates.endBeforeStartISOReceived,
    },
    { createAdvertisement: { id: '123' } },
  ),
];

export const createAdvertisementError = [
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      type: 'banner',
      startAt: createDates.startISOReceived,
      endAt: createDates.endISOReceived,
    },
    undefined,
    new Error('An unknown error occurred'),
  ),
];

export const updateAdMocks = [
  createAdvertisementListMock({
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
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createMutationMock(
    UPDATE_ADVERTISEMENT_MUTATION,
    {
      id: '1',
      description: 'This is an updated advertisement',
      startAt: updateDates.startISOReceived,
      endAt: updateDates.endISOReceived,
    },
    { updateAdvertisement: { id: '1' } },
  ),
  createAdvertisementListMock({
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
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
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
