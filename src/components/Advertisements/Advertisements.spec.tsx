import React, { act } from 'react';
import { describe, test, expect, vi } from 'vitest';

import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';

import { fireEvent, render, screen } from '@testing-library/react';

import type { DocumentNode, NormalizedCacheObject } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import { BACKEND_URL } from 'Constant/constant';

import { ADD_ADVERTISEMENT_MUTATION } from '../../GraphQl/Mutations/mutations';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_ADVERTISEMENT_LIST,
  PLUGIN_GET,
} from '../../GraphQl/Queries/Queries';

import { I18nextProvider } from 'react-i18next';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { store } from '../../state/store';
import i18nForTest from '../../utils/i18nForTest';
import useLocalStorage from '../../utils/useLocalstorage';
import Advertisement from './Advertisements';

const { getItem } = useLocalStorage();

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + getItem('token') || '',
  },
});

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

vi.mock('components/AddOn/support/services/Plugin.helper', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({
    fetchInstalled: vi.fn().mockResolvedValue([]),
    fetchStore: vi.fn().mockResolvedValue([]),
  })),
}));
let mockID: string | undefined = '1';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: mockID }),
  };
});

const today = new Date();
const tomorrow = today;
tomorrow.setDate(today.getDate() + 1);

const ADVERTISEMENTS_LIST_MOCK: {
  request:
    | {
        query: DocumentNode;
        variables: { id: string; first: number; after: null };
      }
    | {
        query: DocumentNode;
        variables: {
          id: string;
          first: number;
          after: null;
          before: null;
          last: null;
        };
      };
  result:
    | {
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
      }
    | {
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
}[] = [];

for (let i = 0; i < 4; i++) {
  ADVERTISEMENTS_LIST_MOCK.push({
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
  ADVERTISEMENTS_LIST_MOCK.push({
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 6,
        after: null,
        before: null,
        last: null,
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
}

const PLUGIN_GET_MOCK = {
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

const ADD_ADVERTISEMENT_MUTATION_MOCK = {
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

const ORGANIZATIONS_LIST_MOCK = {
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

describe('Testing Advertisement Component', () => {
  test('for creating new Advertisements', async () => {
    const mocks = [
      ORGANIZATIONS_LIST_MOCK,
      PLUGIN_GET_MOCK,
      ADD_ADVERTISEMENT_MUTATION_MOCK,
      ...ADVERTISEMENTS_LIST_MOCK,
    ];

    render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Advertisement />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByText('Create Advertisement'));
    userEvent.type(
      screen.getByLabelText('Enter name of Advertisement'),
      'Cookie Shop',
    );
    const mediaFile = new File(['media content'], 'test.png', {
      type: 'image/png',
    });

    const mediaInput = screen.getByTestId('advertisementMedia');
    fireEvent.change(mediaInput, {
      target: {
        files: [mediaFile],
      },
    });
    const mediaPreview = await screen.findByTestId('mediaPreview');
    expect(mediaPreview).toBeInTheDocument();
    userEvent.selectOptions(
      screen.getByLabelText('Select type of Advertisement'),
      'POPUP',
    );
    userEvent.type(screen.getByLabelText('Select Start Date'), '2023-01-01');
    userEvent.type(screen.getByLabelText('Select End Date'), '2023-02-02');

    userEvent.click(screen.getByTestId('addonregister'));
    expect(
      await screen.findByText('Advertisement created successfully.'),
    ).toBeInTheDocument();
  });

  test('for the working of the tabs', async () => {
    const mocks = [
      ORGANIZATIONS_LIST_MOCK,
      PLUGIN_GET_MOCK,
      ADD_ADVERTISEMENT_MUTATION_MOCK,
      ...ADVERTISEMENTS_LIST_MOCK,
    ];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    userEvent.click(screen.getByText('Active Campaigns'));

    await wait();
    userEvent.click(screen.getByText('Completed Campaigns'));
  });

  test('if the component renders correctly and ads are correctly categorized date wise', async () => {
    mockID = '1';
    const mocks = [...ADVERTISEMENTS_LIST_MOCK];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    const date = await screen.findAllByTestId('Ad_end_date');
    const dateString = date[0].innerHTML;
    const dateMatch = dateString.match(
      /\b(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s+(\d{4})\b/,
    );
    let dateObject = new Date();
    if (dateMatch) {
      const monthName = dateMatch[1];
      const day = parseInt(dateMatch[2], 10);
      const year = parseInt(dateMatch[3], 10);
      const monthIndex =
        'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(monthName) / 3;

      dateObject = new Date(year, monthIndex, day);
    }
    console.log(dateObject);
    expect(dateObject.getTime()).toBeLessThan(new Date().getTime());
  });

  test('delete ad', async () => {
    mockID = '1';
    const mocks = [...ADVERTISEMENTS_LIST_MOCK];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    const moreiconbtn = await screen.findAllByTestId('moreiconbtn');
    fireEvent.click(moreiconbtn[1]);
    const deleteBtn = await screen.findByTestId('deletebtn');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);
  });

  test('infinite scroll', async () => {
    mockID = '1';
    const mocks = [
      ...ADVERTISEMENTS_LIST_MOCK,
      {
        request: {
          query: ORGANIZATION_ADVERTISEMENT_LIST,
          variables: {
            id: '1',
            first: 2,
            after: null,
            last: null,
            before: null,
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
                    {
                      node: {
                        _id: '3',
                        name: 'Advertisement1',
                        startDate: '2022-01-01',
                        endDate: '2023-01-01',
                        mediaUrl: 'http://example1.com',
                      },
                      cursor: 'cursor3',
                    },
                    {
                      node: {
                        _id: '4',
                        name: 'Advertisement2',
                        startDate: '2024-02-01',
                        endDate: '2025-02-01',
                        mediaUrl: 'http://example2.com',
                      },
                      cursor: 'cursor4',
                    },
                    {
                      node: {
                        _id: '5',
                        name: 'Advertisement1',
                        startDate: '2022-01-01',
                        endDate: '2023-01-01',
                        mediaUrl: 'http://example1.com',
                      },
                      cursor: 'cursor5',
                    },
                    {
                      node: {
                        _id: '6',
                        name: 'Advertisement2',
                        startDate: '2024-02-01',
                        endDate: '2025-02-01',
                        mediaUrl: 'http://example2.com',
                      },
                      cursor: 'cursor6',
                    },
                  ],
                  pageInfo: {
                    startCursor: 'cursor1',
                    endCursor: 'cursor6',
                    hasNextPage: true,
                    hasPreviousPage: false,
                  },
                  totalCount: 8,
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_ADVERTISEMENT_LIST,
          variables: {
            id: '1',
            first: 6,
            after: 'cursor6',
            last: null,
            before: null,
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
                        _id: '7',
                        name: 'Advertisement7',
                        startDate: '2022-01-01',
                        endDate: '2023-01-01',
                        mediaUrl: 'http://example1.com',
                      },
                      cursor: '5rdiyruyu3hkjkjiwfhwaify',
                    },
                    {
                      node: {
                        _id: '8',
                        name: 'Advertisement8',
                        startDate: '2024-02-01',
                        endDate: '2025-02-01',
                        mediaUrl: 'http://example2.com',
                      },
                      cursor: '5rdiyrhgkjkjjyg3iwfhwaify',
                    },
                  ],
                  pageInfo: {
                    startCursor: '5rdiyruyu3hkjkjiwfhwaify',
                    endCursor: '5rdiyrhgkjkjjyg3iwfhwaify',
                    hasNextPage: false,
                    hasPreviousPage: true,
                  },
                  totalCount: 8,
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_ADVERTISEMENT_LIST,
          variables: {
            id: '1',
            first: 6,
            after: 'cursor2',
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
                        _id: '7',
                        name: 'Advertisement7',
                        startDate: '2022-01-01',
                        endDate: '2023-01-01',
                        mediaUrl: 'http://example1.com',
                      },
                      cursor: '5rdiyruyu3hkjkjiwfhwaify',
                    },
                    {
                      node: {
                        _id: '8',
                        name: 'Advertisement8',
                        startDate: '2024-02-01',
                        endDate: '2025-02-01',
                        mediaUrl: 'http://example2.com',
                      },
                      cursor: '5rdiyrhgkjkjjyg3iwfhwaify',
                    },
                  ],
                  pageInfo: {
                    startCursor: '5rdiyruyu3hkjkjiwfhwaify',
                    endCursor: '5rdiyrhgkjkjjyg3iwfhwaify',
                    hasNextPage: false,
                    hasPreviousPage: true,
                  },
                  totalCount: 8,
                },
              },
            ],
          },
        },
      },
    ];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    let moreiconbtn = await screen.findAllByTestId('moreiconbtn');
    console.log('before scroll', moreiconbtn);
    fireEvent.scroll(window, { target: { scrollY: 500 } });
    moreiconbtn = await screen.findAllByTestId('moreiconbtn');
    console.log('after scroll', moreiconbtn);
  });
});
