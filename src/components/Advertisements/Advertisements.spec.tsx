import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { ApolloProvider } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ORGANIZATION_ADVERTISEMENT_LIST } from '../../GraphQl/Queries/Queries';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { store } from '../../state/store';
import i18nForTest from '../../utils/i18nForTest';
import Advertisement from './Advertisements';
import {
  wait,
  client,
  ORGANIZATIONS_LIST_MOCK,
  ADD_ADVERTISEMENT_MUTATION_MOCK,
  ADVERTISEMENTS_LIST_MOCK,
} from './AdvertisementsMocks';

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

global.URL.createObjectURL = vi.fn(() => 'mocked-url');

const today = new Date();
const tomorrow = today;
tomorrow.setDate(today.getDate() + 1);

describe('Testing Advertisement Component', () => {
  test('for creating new Advertisements', async () => {
    const mocks = [
      ORGANIZATIONS_LIST_MOCK,
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

    await userEvent.click(screen.getByText('Create Advertisement'));
    await userEvent.type(
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
    fireEvent.change(screen.getByLabelText('Select type of Advertisement'), {
      target: { value: 'POPUP' },
    });

    fireEvent.change(screen.getByLabelText('Select Start Date'), {
      target: { value: '2023-01-01' },
    });

    fireEvent.change(screen.getByLabelText('Select End Date'), {
      target: { value: '2023-02-02' },
    });

    await userEvent.click(screen.getByTestId('addonregister'));
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
    await userEvent.click(screen.getByText('Active Campaigns'));

    await wait();
    await userEvent.click(screen.getByText('Completed Campaigns'));
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
                id: '1',
                advertisements: {
                  edges: [
                    {
                      node: {
                        id: '1',
                        name: 'Advertisement1',
                        startAt: '2022-01-01',
                        endAt: '2023-01-01',
                        attachmentUrl: 'http://example1.com',
                      },
                      cursor: 'cursor1',
                    },
                    {
                      node: {
                        id: '2',
                        name: 'Advertisement2',
                        startAt: '2024-02-01',
                        endAt: '2025-02-01',
                        attachmentUrl: 'http://example2.com',
                      },
                      cursor: 'cursor2',
                    },
                    {
                      node: {
                        id: '3',
                        name: 'Advertisement1',
                        startAt: '2022-01-01',
                        endAt: '2023-01-01',
                        attachmentUrl: 'http://example1.com',
                      },
                      cursor: 'cursor3',
                    },
                    {
                      node: {
                        id: '4',
                        name: 'Advertisement2',
                        startAt: '2024-02-01',
                        endAt: '2025-02-01',
                        attachmentUrl: 'http://example2.com',
                      },
                      cursor: 'cursor4',
                    },
                    {
                      node: {
                        id: '5',
                        name: 'Advertisement1',
                        startAt: '2022-01-01',
                        endAt: '2023-01-01',
                        attachmentUrl: 'http://example1.com',
                      },
                      cursor: 'cursor5',
                    },
                    {
                      node: {
                        id: '6',
                        name: 'Advertisement2',
                        startAt: '2024-02-01',
                        endAt: '2025-02-01',
                        attachmentUrl: 'http://example2.com',
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
                id: '1',
                advertisements: {
                  edges: [
                    {
                      node: {
                        id: '7',
                        name: 'Advertisement7',
                        startAt: '2022-01-01',
                        endAt: '2023-01-01',
                        attachmentUrl: 'http://example1.com',
                      },
                      cursor: '5rdiyruyu3hkjkjiwfhwaify',
                    },
                    {
                      node: {
                        id: '8',
                        name: 'Advertisement8',
                        startAt: '2024-02-01',
                        endAt: '2025-02-01',
                        attachmentUrl: 'http://example2.com',
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
                id: '1',
                advertisements: {
                  edges: [
                    {
                      node: {
                        id: '7',
                        name: 'Advertisement7',
                        startAt: '2022-01-01',
                        endAt: '2023-01-01',
                        attachmentUrl: 'http://example1.com',
                      },
                      cursor: '5rdiyruyu3hkjkjiwfhwaify',
                    },
                    {
                      node: {
                        id: '8',
                        name: 'Advertisement8',
                        startAt: '2024-02-01',
                        endAt: '2025-02-01',
                        attachmentUrl: 'http://example2.com',
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
