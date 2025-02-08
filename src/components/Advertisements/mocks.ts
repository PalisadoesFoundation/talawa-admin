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
  PLUGIN_GET,
  ORGANIZATION_ADVERTISEMENT_LIST,
} from '../../GraphQl/Queries/Queries';
import { ADD_ADVERTISEMENT_MUTATION } from '../../GraphQl/Mutations/mutations';

const { getItem } = useLocalStorage();

export const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + getItem('token') || '',
  },
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

type AdvertisementNode = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  mediaUrl: string;
};

type PageInfo = {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type AdvertisementResponse = {
  organizations: {
    _id: string;
    advertisements: {
      edges: { node: AdvertisementNode; cursor: string }[];
      pageInfo: PageInfo;
      totalCount: number;
    };
  }[];
};

type MockRequest = {
  request: {
    query: DocumentNode;
    variables: Record<string, unknown>;
  };
  result: {
    data: AdvertisementResponse;
  };
};

const createMock = (variables: Record<string, unknown>): MockRequest => ({
  request: {
    query: ORGANIZATION_ADVERTISEMENT_LIST,
    variables,
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
                cursor: 'cursor1',
              },
              {
                node: {
                  _id: '2',
                  name: 'Advertisement2',
                  startDate: '2024-02-01',
                  endDate: '2025-02-01',
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

export const PLUGIN_GET_MOCK = {
  request: {
    query: PLUGIN_GET,
  },
  result: {
    data: {
      getPlugins: [
        {
          _id: '6581be50e88e74003aab436c',
          pluginName: 'Chats',
          pluginCreatedBy: 'Talawa Team',
          pluginDesc:
            'User can share messages with other users in a chat user interface.',
          uninstalledOrgs: [
            '62ccfccd3eb7fd2a30f41601',
            '62ccfccd3eb7fd2a30f41601',
          ],
          pluginInstallStatus: true,
          __typename: 'Plugin',
        },
      ],
    },
    loading: false,
  },
};

export const ADD_ADVERTISEMENT_MUTATION_MOCK = {
  request: {
    query: ADD_ADVERTISEMENT_MUTATION,
    variables: {
      organizationId: '1',
      name: 'Cookie Shop',
      file: 'data:image/png;base64,bWVkaWEgY29udGVudA==',
      type: 'POPUP',
      startDate: '2023-01-01',
      endDate: '2023-02-02',
    },
  },
  result: {
    data: {
      createAdvertisement: {
        _id: '65844efc814dd4003db811c4',
        advertisement: null,
        __typename: 'Advertisement',
      },
    },
  },
};

export const ORGANIZATIONS_LIST_MOCK = {
  request: {
    query: ORGANIZATIONS_LIST,
    variables: {
      id: '1',
    },
  },
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
        type: 'BANNER',
        startDate: '2023-01-01',
        endDate: '2023-02-01',
        file: 'data:image/png;base64,bWVkaWEgY29udGVudA==',
      },
    },
    result: {
      data: {
        createAdvertisement: {
          _id: '1',
          advertisement: null,
          __typename: 'Advertisement',
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
      },
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
