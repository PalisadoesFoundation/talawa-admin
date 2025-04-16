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
import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_ADVERTISEMENT_LIST,
} from 'GraphQl/Queries/Queries';
import {
  ADD_ADVERTISEMENT_MUTATION,
  DELETE_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';

const { getItem } = useLocalStorage();

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

export const mockFileForAdvertisementScreen = new File(
  ['dummy content'],
  'test.png',
  { type: 'image/png' },
);
export const createAdSuccessMock = [
  {
    request: {
      query: ADD_ADVERTISEMENT_MUTATION,
      variables: {
        organizationId: '1',
        name: 'Ad1',
        type: 'banner',
        startAt: '2022-12-31T18:30:00.000Z',
        endAt: '2023-01-31T18:30:00.000Z',
        attachments: [mockFileForAdvertisementScreen],
        description: 'this advertisement is created by admin',
      },
    },
    result: {
      data: {
        createAdvertisement: {
          id: '1',
        },
      },
    },
  },
];
export const getCompletedAdvertisementMocks = [
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: null,
        where: {
          isCompleted: true,
        },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [
              {
                node: {
                  id: '1',
                  createdAt: new Date('2025-02-02').toISOString(),
                  description: 'this is an active advertisement',
                  endAt: new Date().toISOString(),
                  organization: {
                    id: '1',
                  },
                  name: 'Cookie shop',
                  startAt: new Date('2025-02-02').toISOString(),
                  type: 'banner',
                  attachments: [
                    {
                      mimeType: 'image/jpeg',
                      url: 'http://127.0.0.1:4000/objects/01IR2V4ROX1FCZ3EQN518NE37Z',
                    },
                  ],
                },
              },
            ],
            pageInfo: {
              startCursor: 'cursor-1',
              endCursor: 'cursor-2',
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: null,
        where: {
          isCompleted: false,
        },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [],
            pageInfo: {
              startCursor: 'cursor-1',
              endCursor: 'cursor-2',
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
];
export const getActiveAdvertisementMocks = [
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: null,
        where: {
          isCompleted: false,
        },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [
              {
                node: {
                  id: '2',
                  createdAt: new Date('2025-02-02').toISOString(),
                  description: 'this is a completed advertisement',
                  endAt: new Date('2030-01-01').toISOString(),
                  organization: {
                    id: '1',
                  },
                  name: 'Cookie shop',
                  startAt: new Date('2025-02-02').toISOString(),
                  type: 'banner',
                  attachments: [
                    {
                      mimeType: 'image/jpeg',
                      url: 'http://127.0.0.1:4000/objects/01IR2V4ROX1FCZ3EQN518NE37Z',
                    },
                  ],
                },
              },
            ],
            pageInfo: {
              startCursor: 'cursor-1',
              endCursor: 'cursor-2',
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: null,
        where: {
          isCompleted: false,
        },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [],
            pageInfo: {
              startCursor: 'cursor-1',
              endCursor: 'cursor-2',
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
];
export const deleteAdvertisementMocks = [
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: null,
        where: {
          isCompleted: true,
        },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [
              {
                node: {
                  id: '1',
                  createdAt: new Date('2025-02-02').toISOString(),
                  description: 'this advertisement is created by admin',
                  endAt: new Date().toISOString(),
                  organization: {
                    id: '1',
                  },
                  name: 'Cookie shop',
                  startAt: new Date('2025-02-02').toISOString(),
                  type: 'banner',
                  attachments: [
                    {
                      mimeType: 'image/jpeg',
                      url: 'http://127.0.0.1:4000/objects/01IR2V4ROX1FCZ3EQN518NE37Z',
                    },
                  ],
                },
              },
            ],
            pageInfo: {
              startCursor: 'cursor-1',
              endCursor: 'cursor-2',
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: null,
        where: {
          isCompleted: false,
        },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [],
            pageInfo: {
              startCursor: 'cursor-1',
              endCursor: 'cursor-2',
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: DELETE_ADVERTISEMENT_MUTATION,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        deleteAdvertisement: {
          id: '1',
        },
      },
    },
  },
];
export const updateAddSuccess = [
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: null,
        where: {
          isCompleted: true,
        },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [
              {
                node: {
                  id: '1',
                  createdAt: new Date('2025-02-02').toISOString(),
                  description: 'this advertisement is created by admin',
                  endAt: new Date().toISOString(),
                  organization: {
                    id: '1',
                  },
                  name: 'Cookie shop',
                  startAt: new Date('2025-02-02').toISOString(),
                  type: 'banner',
                  attachments: [
                    {
                      mimeType: 'image/jpeg',
                      url: 'http://127.0.0.1:4000/objects/01IR2V4ROX1FCZ3EQN518NE37Z',
                    },
                  ],
                },
              },
            ],
            pageInfo: {
              startCursor: 'cursor-1',
              endCursor: 'cursor-2',
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ADVERTISEMENT_MUTATION,
      variables: {
        id: '1',
        attachments: [],
        endAt: new Date().toISOString(),
        startAt: new Date('2025-02-02').toISOString(),
        description: 'this advertisement is edited by admin',
      },
    },
    result: {
      data: {
        createAdvertisement: {
          id: '1',
        },
      },
    },
  },
];
export const infiniteScrollMocks = [
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: null,
        where: {
          isCompleted: true,
        },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [
              {
                node: {
                  id: '1',
                  createdAt: new Date('2025-02-02').toISOString(),
                  description: 'First batch advertisement',
                  endAt: new Date().toISOString(),
                  organization: {
                    id: '1',
                  },
                  name: 'First Ad',
                  startAt: new Date('2025-02-02').toISOString(),
                  type: 'banner',
                  attachments: [
                    {
                      mimeType: 'image/jpeg',
                      url: 'http://127.0.0.1:4000/objects/01IR2V4ROX1FCZ3EQN518NE37Z',
                    },
                  ],
                },
              },
            ],
            pageInfo: {
              startCursor: 'cursor-1',
              endCursor: 'cursor-2',
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: null,
        where: {
          isCompleted: false,
        },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [],
            pageInfo: {
              startCursor: null,
              endCursor: null,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: 'cursor-2',
        where: {
          isCompleted: true,
        },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [
              {
                node: {
                  id: '2',
                  createdAt: new Date('2025-02-03').toISOString(),
                  description: 'Second batch advertisement',
                  endAt: new Date().toISOString(),
                  organization: {
                    id: '1',
                  },
                  name: 'Second Ad',
                  startAt: new Date('2025-02-03').toISOString(),
                  type: 'pop_up',
                  attachments: [
                    {
                      mimeType: 'image/jpeg',
                      url: 'http://127.0.0.1:4000/objects/01IR2V4ROX1FCZ3EQN518NE37Z',
                    },
                  ],
                },
              },
            ],
            pageInfo: {
              startCursor: 'cursor-2',
              endCursor: 'cursor-3',
              hasNextPage: false,
              hasPreviousPage: true,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: 'cursor-2',
        where: {
          isCompleted: false,
        },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [],
            pageInfo: {
              startCursor: null,
              endCursor: null,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
];
export const emptyMocks = [
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        after: null,
        first: 6,
        where: { isCompleted: false },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        after: null,
        first: 6,
        where: { isCompleted: true },
      },
    },
    result: {
      data: {
        organization: {
          advertisements: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
          },
        },
      },
    },
  },
];
