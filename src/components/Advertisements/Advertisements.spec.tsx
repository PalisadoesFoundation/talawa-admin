import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { ApolloProvider } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { store } from '../../state/store';
import i18nForTest from '../../utils/i18nForTest';
import Advertisement from './Advertisements';
import {
  wait,
  client,
  getCompletedAdvertisementMocks,
  getActiveAdvertisementMocks,
  deleteAdvertisementMocks,
} from './AdvertisementsMocks';
import i18n from '../../utils/i18nForTest';
import {
  ADD_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/AdvertisementMutations';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/AdvertisementQueries';

vi.mock('components/AddOn/support/services/Plugin.helper', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({
    fetchInstalled: vi.fn().mockResolvedValue([]),
    fetchStore: vi.fn().mockResolvedValue([]),
  })),
}));

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.advertisement ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

let mockID: string | undefined = '1';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useParams: () => ({ orgId: mockID }) };
});

const today = new Date();
const tomorrow = today;
tomorrow.setDate(today.getDate() + 1);

global.URL.createObjectURL = vi.fn(() => 'mocked-url');

describe('Testing Advertisement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('render spinner while loading', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={getCompletedAdvertisementMocks}
                addTypename={false}
              >
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('switches between tabs', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={getCompletedAdvertisementMocks}
                addTypename={false}
              >
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      /Completed Campaigns/i,
    );

    const activeTab = screen.getByRole('tab', { name: /Active Campaigns/i });
    fireEvent.click(activeTab);

    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      /Active Campaigns/i,
    );

    const archivedTab = screen.getByRole('tab', { name: /Active Campaigns/i });
    fireEvent.click(archivedTab);

    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      /Active Campaigns/i,
    );
  });

  it('render active advertisement after loading', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={getCompletedAdvertisementMocks}
                addTypename={false}
              >
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.getByTestId('AdEntry')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(screen.getByTestId('Ad_name')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_name')).toHaveTextContent('Cookie shop');
    expect(screen.getByTestId('Ad_desc')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_desc')).toHaveTextContent(
      'this is an active advertisement',
    );
    expect(screen.getByTestId('media')).toBeInTheDocument();
    expect(screen.getByTestId('moreiconbtn')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('moreiconbtn'));
    expect(screen.getByTestId('deletebtn')).toBeInTheDocument();
    expect(screen.getByTestId('editBtn')).toBeInTheDocument();
  });

  it('render completed advertisement after loading', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={getActiveAdvertisementMocks}
                addTypename={false}
              >
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.getByTestId('AdEntry')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(screen.getByTestId('Ad_name')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_name')).toHaveTextContent('Cookie shop');
    expect(screen.getByTestId('Ad_desc')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_desc')).toHaveTextContent(
      'this is a completed advertisement',
    );
    expect(screen.getByTestId('media')).toBeInTheDocument();
    expect(screen.getByTestId('moreiconbtn')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('moreiconbtn'));
    expect(screen.getByTestId('deletebtn')).toBeInTheDocument();
    expect(screen.getByTestId('editBtn')).toBeInTheDocument();
  });

  it('create advertisement', async () => {
    const toastSuccessSpy = vi.spyOn(toast, 'success');
    const startAtISO = '2024-12-31T18:30:00.000Z';
    const endAtISO = '2030-02-01T18:30:00.000Z';
    const startISOReceived = '2024-12-30T18:30:00.000Z';
    const endISOReceived = '2030-01-31T18:30:00.000Z';
    const createAdvertisement = [
      {
        request: {
          query: ADD_ADVERTISEMENT_MUTATION,
          variables: {
            organizationId: '1',
            name: 'Ad1',
            type: 'banner',
            startAt: startISOReceived,
            endAt: endISOReceived,
          },
        },
        result: {
          data: {
            createAdvertisement: {
              id: '123',
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
                edges: [
                  {
                    node: {
                      id: '1',
                      createdAt: new Date().toISOString(),
                      description:
                        'This is a new advertisement created for testing.',
                      endAt: endAtISO,
                      organization: {
                        id: '1',
                      },
                      name: 'Ad1',
                      startAt: startAtISO,
                      type: 'banner',
                      attachments: [],
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
              isCompleted: true,
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
    ];
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={createAdvertisement} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(
      screen.getByText(translations.createAdvertisement),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(translations.createAdvertisement));
    });

    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rname), {
        target: { value: 'Ad1' },
      });
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: startAtISO.split('T')[0] },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: endAtISO.split('T')[0] },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      startAtISO.split('T')[0],
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      endAtISO.split('T')[0],
    );

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    await waitFor(
      () => {
        expect(toastSuccessSpy).toHaveBeenCalledWith(
          'Advertisement created successfully.',
        );
      },
      { timeout: 3000 },
    );
    vi.useRealTimers();
  });

  it('creating advertisement without name should throw an error', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');
    const startAtISO = '2024-12-31T18:30:00.000Z';
    const endAtISO = '2030-02-01T18:30:00.000Z';
    const startISOReceived = '2024-12-30T18:30:00.000Z';
    const endISOReceived = '2030-01-31T18:30:00.000Z';
    const createAdvertisement = [
      {
        request: {
          query: ADD_ADVERTISEMENT_MUTATION,
          variables: {
            organizationId: '1',
            type: 'banner',
            startAt: startISOReceived,
            endAt: endISOReceived,
          },
        },
        result: {
          data: {
            createAdvertisement: {
              id: '123',
            },
          },
        },
      },
    ];
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={createAdvertisement} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(
      screen.getByText(translations.createAdvertisement),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(translations.createAdvertisement));
    });

    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: startAtISO.split('T')[0] },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: endAtISO.split('T')[0] },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).not.toHaveValue();
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      startAtISO.split('T')[0],
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      endAtISO.split('T')[0],
    );

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    expect(toastErrorSpy).toHaveBeenCalledWith(
      'Invalid arguments for this action.',
    );
  });

  it('creating advertisement with end date before than start date should throw an error', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');
    const startAtISO = '2024-12-31T18:30:00.000Z';
    const endAtISO = '2020-02-01T18:30:00.000Z';
    const startISOReceived = '2024-12-30T18:30:00.000Z';
    const endISOReceived = '2020-01-31T18:30:00.000Z';
    const createAdvertisement = [
      {
        request: {
          query: ADD_ADVERTISEMENT_MUTATION,
          variables: {
            organizationId: '1',
            type: 'banner',
            startAt: startISOReceived,
            endAt: endISOReceived,
          },
        },
        result: {
          data: {
            createAdvertisement: {
              id: '123',
            },
          },
        },
      },
    ];
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={createAdvertisement} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(
      screen.getByText(translations.createAdvertisement),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(translations.createAdvertisement));
    });

    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rname), {
        target: { value: 'Ad1' },
      });
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: startAtISO.split('T')[0] },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: endAtISO.split('T')[0] },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      startAtISO.split('T')[0],
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      endAtISO.split('T')[0],
    );

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    expect(toastErrorSpy).toHaveBeenCalledWith(
      'End Date should be greater than Start Date',
    );
  });

  it('should handle unknown errors', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');
    const startAtISO = '2024-12-31T18:30:00.000Z';
    const endAtISO = '2025-02-01T18:30:00.000Z';
    const startISOReceived = '2024-12-30T18:30:00.000Z';
    const endISOReceived = '2025-01-31T18:30:00.000Z';
    const createAdvertisement = [
      {
        request: {
          query: ADD_ADVERTISEMENT_MUTATION,
          variables: {
            organizationId: '1',
            type: 'banner',
            startAt: startISOReceived,
            endAt: endISOReceived,
          },
        },
        error: new Error('An unknown error occurred'),
      },
    ];
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={createAdvertisement} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(
      screen.getByText(translations.createAdvertisement),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(translations.createAdvertisement));
    });

    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rname), {
        target: { value: 'Ad1' },
      });
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: startAtISO.split('T')[0] },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: endAtISO.split('T')[0] },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      startAtISO.split('T')[0],
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      endAtISO.split('T')[0],
    );

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    expect(toastErrorSpy).toHaveBeenCalledWith(
      "An error occurred. Couldn't create advertisement",
    );
  });

  it('update advertisement', async () => {
    const toastSuccessSpy = vi.spyOn(toast, 'success');
    const startAtISO = '2024-12-31T18:30:00.000Z';
    const endAtISO = '2030-02-01T18:30:00.000Z';
    const startISOReceived = '2024-12-30T18:30:00.000Z';
    const endISOReceived = '2030-01-31T18:30:00.000Z';
    const updateAdMocks = [
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
                      id: '1',
                      createdAt: new Date().toISOString(),
                      description:
                        'This is a new advertisement created for testing.',
                      endAt: endAtISO,
                      organization: {
                        id: '1',
                      },
                      name: 'Ad1',
                      startAt: startAtISO,
                      type: 'banner',
                      attachments: [],
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
              isCompleted: true,
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
          query: UPDATE_ADVERTISEMENT_MUTATION,
          variables: {
            id: '1',
            description: 'This is an updated advertisement',
            startAt: startISOReceived,
            endAt: endISOReceived,
          },
        },
        result: {
          data: {
            updateAdvertisement: {
              id: '1',
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
                edges: [
                  {
                    node: {
                      id: '1',
                      createdAt: new Date().toISOString(),
                      description: 'This is an updated advertisement',
                      endAt: endAtISO,
                      organization: {
                        id: '1',
                      },
                      name: 'Ad1',
                      startAt: startAtISO,
                      type: 'banner',
                      attachments: [],
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
              isCompleted: true,
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
    ];
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={updateAdMocks} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await wait();

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.getByTestId('AdEntry')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(screen.getByTestId('Ad_name')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_name')).toHaveTextContent('Ad1');
    expect(screen.getByTestId('Ad_desc')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_desc')).toHaveTextContent(
      'This is a new advertisement created for testing.',
    );
    expect(screen.getByTestId('media')).toBeInTheDocument();
    expect(screen.getByTestId('moreiconbtn')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('moreiconbtn'));
    expect(screen.getByTestId('editBtn')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('editBtn'));

    const descriptionField = screen.getByLabelText(
      'Enter description of Advertisement (optional)',
    );
    fireEvent.change(descriptionField, {
      target: { value: 'This is an updated advertisement' },
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: startAtISO.split('T')[0] },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: endAtISO.split('T')[0] },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('addonupdate'));
    });

    await waitFor(
      () => {
        expect(toastSuccessSpy).toHaveBeenCalled();
        expect(toastSuccessSpy).toHaveBeenCalledWith(
          'Advertisement updated Successfully',
        );
      },
      { timeout: 3000 },
    );
  });

  it('delete advertisement', async () => {
    const toastSuccessSpy = vi.spyOn(toast, 'success');
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={deleteAdvertisementMocks}
                addTypename={false}
              >
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    await wait();
    expect(getByTestId('moreiconbtn')).toBeInTheDocument();
    fireEvent.click(getByTestId('moreiconbtn'));
    expect(getByTestId('deletebtn')).toBeInTheDocument();
    fireEvent.click(getByTestId('deletebtn'));
    await waitFor(() => {
      expect(getByTestId('delete_title')).toBeInTheDocument();
      expect(getByTestId('delete_body')).toBeInTheDocument();
    });
    await act(() => {
      fireEvent.click(getByTestId('delete_yes'));
    });
    await waitFor(
      () => {
        expect(toastSuccessSpy).toHaveBeenCalledWith(
          'Advertisement deleted successfully.',
        );
      },
      { timeout: 3000 },
    );
  });

  test('skips queries when organization ID is missing', async () => {
    mockID = undefined;

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={[]} addTypename={false}>
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    expect(screen.getByTestId('advertisements')).toBeInTheDocument();
  });

  test('title is set correctly', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider
                mocks={getCompletedAdvertisementMocks}
                addTypename={false}
              >
                <Advertisement />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    const translations = JSON.parse(
      JSON.stringify(
        i18n.getDataByLanguage('en')?.translation.advertisement ?? {},
      ),
    );

    expect(document.title).toBe(translations.title);
  });
});
