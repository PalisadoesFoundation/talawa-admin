import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { ApolloProvider } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { store } from '../../state/store';
import i18nForTest from '../../utils/i18nForTest';
import Advertisement from './Advertisements';
import { wait, client } from './AdvertisementsMocks';
import {
  ADD_ADVERTISEMENT_MUTATION,
  DELETE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/AdvertisementMutations';
import i18n from '../../utils/i18nForTest';

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
  return { ...actual, useParams: () => ({ orgId: mockID }) };
});

const today = new Date();
const tomorrow = today;
tomorrow.setDate(today.getDate() + 1);

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.advertisement ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

global.URL.createObjectURL = vi.fn(() => 'mocked-url');

const mockFile = new File(['dummy content'], 'test.jpg', {
  type: 'image/jpeg',
});

const mocks = [
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: '1',
        first: 12,
        after: null,
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
                  createdAt: '2025-04-05T11:24:59.000Z',
                  description: 'this advertisement is created by admin',
                  endAt: '2025-04-06T11:24:31.210Z',
                  organization: {
                    id: '1',
                  },
                  name: 'Cookie shop',
                  startAt: '2025-04-05T11:24:31.210Z',
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
              startCursor: 'eyJXVl1jpIQ29va2lIHNob3BmIn0',
              endCursor: 'eyJXVl1jpIQ29va2lIHNob3BmIn0',
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

const createAdSuccessMock: MockedResponse = {
  request: {
    query: ADD_ADVERTISEMENT_MUTATION,
    variables: {
      organizationId: '1',
      name: 'Ad1',
      type: 'banner',
      startAt: '2022-12-31T18:30:00.000Z',
      endAt: '2023-01-31T18:30:00.000Z',
      description: 'advertisement',
      attachments: [mockFile],
    },
  },
  result: {
    data: {
      createAdvertisement: {
        id: '0196',
      },
    },
  },
};

describe('Testing Advertisement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('render spinner while loading', async () => {
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

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('delete advertisement', async () => {
    const toastSuccessSpy = vi.spyOn(toast, 'success');
    const { getByTestId } = render(
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

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    await wait(); // wait for the loading spinner to disappear

    //Testing rendering
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
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        'Advertisement deleted successfully.',
      );
    });
  });

  it('render advertisement screen and delete button', async () => {
    const { getByTestId } = render(
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

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    await wait(); // wait for the loading spinner to disappear

    //Testing rendering
    expect(getByTestId('AdEntry')).toBeInTheDocument();
    expect(getByTestId('Ad_type')).toBeInTheDocument();
    expect(getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(getByTestId('Ad_name')).toBeInTheDocument();
    expect(getByTestId('Ad_name')).toHaveTextContent('Cookie shop');
    expect(getByTestId('Ad_desc')).toBeInTheDocument();
    expect(getByTestId('Ad_desc')).toHaveTextContent(
      'this advertisement is created by admin',
    );
    expect(getByTestId('media')).toBeInTheDocument();
    expect(getByTestId('moreiconbtn')).toBeInTheDocument();
    fireEvent.click(getByTestId('moreiconbtn'));
    expect(getByTestId('deletebtn')).toBeInTheDocument();
  });

  test('create advertisement', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    await act(async () => {
      render(
        <MockedProvider addTypename={false} mocks={[createAdSuccessMock]}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18n}>
                <Advertisement />
              </I18nextProvider>
            </BrowserRouter>
          </Provider>
        </MockedProvider>,
      );
    });

    await wait();

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

      fireEvent.change(screen.getByLabelText(translations.Rdesc), {
        target: { value: 'advertisement' },
      });

      fireEvent.change(screen.getByLabelText(translations.Rmedia), {
        target: {
          files: [mockFile],
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: '2023-01-01' },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: '2023-02-01' },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      '2023-01-01',
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      '2023-02-01',
    );

    expect(screen.getByText(translations.register)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Advertisement created successfully.',
      );
      expect(setTimeoutSpy).toHaveBeenCalled();
    });
    vi.useRealTimers();
  });
});
