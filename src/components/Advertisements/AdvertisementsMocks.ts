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

type VariablesType =
  | { id: string; first: number; after: null }
  | { id: string; first: number; after: null; before: null; last: null };

type MockRequest = {
  request: { query: DocumentNode; variables: VariablesType };
  result: {
    data: {
      organizations: {
        _id: string;
        advertisements: {
          edges: {
            node: {
              _id: string;
              name: string;
              startDate: string;
              endDate: string;
              mediaUrl: string;
            };
            cursor: string;
          }[];
          pageInfo: {
            startCursor: string;
            endCursor: string;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
          };
          totalCount: number;
        };
      }[];
    };
  };
};

const createMock = (variables: VariablesType): MockRequest => ({
  request: { query: ORGANIZATION_ADVERTISEMENT_LIST, variables },
  result: {
    data: {
      organizations: [
        {
          _id: '1',
          advertisements: {
            edges: [
              {
                node: {
                  _id: '1',
                  name: 'Advertisement1',
                  startDate: '2022-01-01',
                  endDate: '2023-01-01',
                  mediaUrl: 'http://example1.com',
                },
                cursor: 'cursor1',
              },
              {
                node: {
                  _id: '2',
                  name: 'Advertisement2',
                  startDate: '2021-02-01',
                  endDate: '2035-02-01',
                  mediaUrl: 'http://example2.com',
                },
                cursor: 'cursor2',
              },
            ],
            pageInfo: {
              startCursor: 'cursor1',
              endCursor: 'cursor2',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 2,
          },
        },
      ],
    },
  },
});

export const ADVERTISEMENTS_LIST_MOCK: MockRequest[] = [
  ...Array(4).fill(createMock({ id: '1', first: 6, after: null })),
  ...Array(4).fill(
    createMock({ id: '1', first: 6, after: null, before: null, last: null }),
  ),
];

export const ORGANIZATIONS_LIST_MOCK = {
  request: { query: ORGANIZATIONS_LIST, variables: { id: '1' } },
  result: {
    data: {
      organizations: [
        {
          _id: '1',
          image: '',
          creator: {
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
          },
          name: 'name',
          description: 'description',
          userRegistrationRequired: true,

          visibleInSearch: true,
          address: {
            city: 'Kingston',
            countryCode: 'JM',
            dependentLocality: 'Sample Dependent Locality',
            line1: '123 Jamaica Street',
            line2: 'Apartment 456',
            postalCode: 'JM12345',
            sortingCode: 'ABC-123',
            state: 'Kingston Parish',
          },
          members: {
            _id: 'id',
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
          },
          admins: {
            _id: 'id',
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
          },
          membershipRequests: {
            _id: 'id',
            user: {
              firstName: 'firstName',
              lastName: 'lastName',
              email: 'email',
            },
          },
          blockedUsers: {
            _id: 'id',
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
          },
        },
      ],
    },
  },
};

export const REGISTER_MOCKS = [
  {
    request: {
      query: ADD_ADVERTISEMENT_MUTATION,
      variables: {
        organizationId: '1',
        name: 'Ad1',
        type: 'banner',
        startAt: '2022-12-31T18:30:00.000Z',
        endAt: '2023-01-31T18:30:00.000Z',
        attachments: [expect.any(File)],
        description: 'advertisement',
      },
    },
    result: {
      data: {
        createAdvertisement: {
          id: 'demo-id',
          __typename: 'advertisement',
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: { id: '1', first: 6, after: null },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
            advertisements: {
              edges: [
                {
                  node: {
                    _id: '1',
                    name: 'Advertisement1',
                    startDate: '2022-01-01',
                    endDate: '2023-01-01',
                    mediaUrl: 'http://example1.com',
                  },
                  cursor: '5rdiyr3iwfhwaify',
                },
                {
                  node: {
                    _id: '2',
                    name: 'Advertisement2',
                    startDate: '2024-02-01',
                    endDate: '2025-02-01',
                    mediaUrl: 'http://example2.com',
                  },
                  cursor: '5rdiyr3iwfhwaify',
                },
              ],
              pageInfo: {
                startCursor: 'erdftgyhujkerty',
                endCursor: 'edrftgyhujikl',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 2,
            },
          },
        ],
      },
    },
  },
];

// ----------------- mocks ------------------
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
export const getAdvertisementMocks = [
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
