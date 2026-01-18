import React, { act } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import AdvertisementRegister from './AdvertisementRegister';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import { MockedProvider } from '@apollo/client/testing';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import userEvent from '@testing-library/user-event';
import { vi, it } from 'vitest';
import {
  client,
  wait,
} from 'components/AdminPortal/Advertisements/AdvertisementsMocks';
import { UPDATE_ADVERTISEMENT_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/AdvertisementQueries';
import * as router from 'react-router';
import {
  createAdFailMock,
  createAdvertisement,
  dateConstants,
  mockBigFile,
  mockFile,
  updateAdFailMock,
} from './AdvertisementRegisterMocks';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: '1' }),
    useNavigate: vi.fn(),
  };
});

global.URL.createObjectURL = vi.fn(() => 'mocked-url');

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

let mockUseMutation: ReturnType<typeof vi.fn> & (() => void) & (() => void);
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useMutation: () => mockUseMutation(),
  };
});

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: vi.fn().mockReturnValue('token'),
  }),
}));

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18nForTest.getDataByLanguage('en')?.translation.advertisement ?? {},
    ),
  ),
  ...JSON.parse(
    JSON.stringify(i18nForTest.getDataByLanguage('en')?.common ?? {}),
  ),
  ...JSON.parse(
    JSON.stringify(i18nForTest.getDataByLanguage('en')?.errors ?? {}),
  ),
};

describe('Testing Advertisement Register Component', () => {
  beforeEach(() => {
    mockUseMutation = vi.fn();
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue([vi.fn()]);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('AdvertismentRegister component loads correctly in register mode', async () => {
    const { getByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="register"
                nameEdit=""
                typeEdit="banner"
                descriptionEdit=""
                endAtEdit={
                  new Date(new Date().setDate(new Date().getDate() + 1))
                }
                startAtEdit={new Date()}
                idEdit="1"
                setAfterActive={() => {}}
                setAfterCompleted={() => {}}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    await waitFor(() => {
      expect(getByText(translations.createAdvertisement)).toBeInTheDocument();
    });
  });

  test('Logs error to the console and shows error toast when advertisement creation fails', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');

    await act(async () => {
      render(
        <MockedProvider mocks={[createAdFailMock]}>
          <Provider store={store}>
            <router.BrowserRouter>
              <I18nextProvider i18n={i18nForTest}>
                <AdvertisementRegister
                  endAtEdit={new Date()}
                  startAtEdit={new Date()}
                  typeEdit="banner"
                  nameEdit="Ad1"
                  idEdit="1"
                  setAfterActive={vi.fn() as () => void}
                  setAfterCompleted={vi.fn() as () => void}
                />
              </I18nextProvider>
            </router.BrowserRouter>
          </Provider>
        </MockedProvider>,
      );
    });

    expect(
      screen.getByText(translations.createAdvertisement),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(translations.createAdvertisement));
    });

    expect(screen.queryByText(translations.addNew)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        `Invalid arguments for this action.`,
      );
    });

    expect(setTimeoutSpy).toHaveBeenCalled();
  });

  test('Throws error at creation when the end date is less than the start date', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');
    const { getByText, queryByText, getByLabelText } = render(
      <MockedProvider>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(getByText(translations.createAdvertisement)).toBeInTheDocument();

    fireEvent.click(getByText(translations.createAdvertisement));
    expect(queryByText(translations.addNew)).toBeInTheDocument();

    fireEvent.change(getByLabelText(translations.Rname), {
      target: { value: 'Ad1' },
    });
    expect(getByLabelText(translations.Rname)).toHaveValue('Ad1');

    const mediaFile = new File(['media content'], 'test.png', {
      type: 'image/png',
    });

    const mediaInput = getByLabelText(translations.Rmedia);
    fireEvent.change(mediaInput, {
      target: {
        files: [mediaFile],
      },
    });

    const mediaPreview = await screen.findByTestId('mediaPreview');
    expect(mediaPreview).toBeInTheDocument();

    fireEvent.change(getByLabelText(translations.Rtype), {
      target: { value: 'banner' },
    });
    expect(getByLabelText(translations.Rtype)).toHaveValue('banner');

    fireEvent.change(getByLabelText(translations.RstartDate), {
      target: { value: dateConstants.create.startAtISO.split('T')[0] },
    });
    expect(getByLabelText(translations.RstartDate)).toHaveValue(
      dateConstants.create.startAtISO.split('T')[0],
    );

    fireEvent.change(getByLabelText(translations.RendDate), {
      target: { value: dateConstants.create.endBeforeStartISO.split('T')[0] },
    });
    expect(getByLabelText(translations.RendDate)).toHaveValue(
      dateConstants.create.endBeforeStartISO.split('T')[0],
    );

    await waitFor(() => {
      fireEvent.click(getByText(translations.register));
    });
    expect(toastErrorSpy).toHaveBeenCalledWith(
      'End Date should be greater than Start Date',
    );
    expect(setTimeoutSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });

  test('AdvertismentRegister component loads correctly in edit mode', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                endAtEdit={new Date()}
                startAtEdit={new Date()}
                typeEdit="banner"
                nameEdit="Advert1"
                idEdit="1"
                formStatus="edit"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('editBtn')).toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  test('Opens and closes modals on button click', async () => {
    const { getByText, queryByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                endAtEdit={new Date()}
                startAtEdit={new Date()}
                typeEdit="banner"
                nameEdit="Advert1"
                idEdit="1"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    fireEvent.click(getByText(translations.createAdvertisement));
    await waitFor(() => {
      expect(queryByText(translations.addNew)).toBeInTheDocument();
    });
    fireEvent.click(getByText(translations.close));
    await waitFor(() => {
      expect(queryByText(translations.close)).not.toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  test('Throws error when the end date is less than the start date while editing the advertisement', async () => {
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');
    const { getByText, getByLabelText, queryByText } = render(
      <MockedProvider mocks={[updateAdFailMock]}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {
                <AdvertisementRegister
                  formStatus="edit"
                  endAtEdit={new Date()}
                  startAtEdit={new Date()}
                  typeEdit="banner"
                  nameEdit="Advert1"
                  idEdit="1"
                  setAfterActive={vi.fn() as () => void}
                  setAfterCompleted={vi.fn() as () => void}
                />
              }
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('editBtn'));
    });
    expect(queryByText(translations.editAdvertisement)).toBeInTheDocument();
    fireEvent.change(getByLabelText(translations.Rname), {
      target: { value: 'Test Advertisement' },
    });
    expect(getByLabelText(translations.Rname)).toHaveValue(
      'Test Advertisement',
    );

    fireEvent.change(getByLabelText(translations.Rtype), {
      target: { value: 'banner' },
    });
    expect(getByLabelText(translations.Rtype)).toHaveValue('banner');

    expect(getByLabelText(translations.RstartDate)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(translations.RstartDate), {
      target: { value: dateConstants.update.startAtISO.split('T')[0] },
    });

    expect(getByLabelText(translations.RstartDate)).toHaveValue(
      dateConstants.update.startAtISO.split('T')[0],
    );

    fireEvent.change(screen.getByLabelText(translations.RendDate), {
      target: { value: dateConstants.update.endBeforeStartISO.split('T')[0] },
    });

    expect(getByLabelText(translations.RendDate)).toHaveValue(
      dateConstants.update.endBeforeStartISO.split('T')[0],
    );

    fireEvent.click(getByText(translations.saveChanges));
    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        'End Date should be greater than Start Date',
      );
    });
    vi.useRealTimers();
  });

  test('Media preview renders correctly', async () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                endAtEdit={new Date()}
                startAtEdit={new Date()}
                typeEdit="banner"
                nameEdit="Advert1"
                idEdit="1"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByText(translations.createAdvertisement));
    await screen.findByText(translations.addNew);

    const mediaFile = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    });
    const mediaInput = screen.getByTestId('advertisementMedia');
    await userEvent.upload(mediaInput, mediaFile);

    const mediaPreview = await screen.findByTestId('mediaPreview');
    expect(mediaPreview).toBeInTheDocument();

    const closeButton = await screen.findByTestId('closePreview');
    fireEvent.click(closeButton);
    expect(mediaPreview).not.toBeInTheDocument();
  });

  it('create advertisement', async () => {
    const createAdMock = vi.fn();
    mockUseMutation.mockReturnValue([createAdMock]);
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={createAdvertisement}>
                <AdvertisementRegister
                  setAfterActive={vi.fn() as () => void}
                  setAfterCompleted={vi.fn() as () => void}
                />
              </MockedProvider>
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

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
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(translations.Rtype), {
        target: { value: 'banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.Rdesc), {
        target: { value: 'this is a banner' },
      });

      fireEvent.change(screen.getByLabelText(translations.RstartDate), {
        target: { value: dateConstants.create.startAtISO.split('T')[0] },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: dateConstants.create.endAtISO.split('T')[0] },
      });
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      dateConstants.create.startAtISO.split('T')[0],
    );
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      dateConstants.create.endAtISO.split('T')[0],
    );

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    await waitFor(() => {
      const mockCall = createAdMock.mock.calls[0][0];
      expect(mockCall.variables).toMatchObject({
        organizationId: '1',
        name: 'Ad1',
        type: 'banner',
        description: 'this is a banner',
        attachments: [],
      });
      expect(new Date(mockCall.variables.startAt)).toBeInstanceOf(Date);
      expect(new Date(mockCall.variables.endAt)).toBeInstanceOf(Date);
      const creationFailedText = screen.queryByText((_, element) => {
        return (
          element?.textContent === 'Creation Failed' &&
          element.tagName.toLowerCase() === 'div'
        );
      });
      expect(creationFailedText).toBeNull();
    });
    vi.useRealTimers();
  });

  it('update advertisement', async () => {
    const updateMock = vi.fn();
    mockUseMutation.mockReturnValue([updateMock]);
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
                      endAt: dateConstants.update.endAtISO,
                      organization: {
                        id: '1',
                      },
                      name: 'Ad1',
                      startAt: dateConstants.update.startAtISO,
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
            startAt: dateConstants.update.startISOReceived,
            endAt: dateConstants.update.endISOReceived,
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
                      endAt: dateConstants.update.endAtISO,
                      organization: {
                        id: '1',
                      },
                      name: 'Ad1',
                      startAt: dateConstants.update.startAtISO,
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
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={updateAdMocks}>
                <AdvertisementRegister
                  endAtEdit={new Date()}
                  startAtEdit={new Date()}
                  typeEdit="banner"
                  nameEdit="Ad1"
                  idEdit="1"
                  setAfterActive={vi.fn() as () => void}
                  setAfterCompleted={vi.fn() as () => void}
                  formStatus="edit"
                />
              </MockedProvider>
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

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
        target: { value: dateConstants.update.startAtISO.split('T')[0] },
      });

      fireEvent.change(screen.getByLabelText(translations.RendDate), {
        target: { value: dateConstants.update.endAtISO.split('T')[0] },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('addonupdate'));
    });

    await waitFor(() => {
      const mockCall = updateMock.mock.calls[0][0];
      expect(mockCall.variables).toMatchObject({
        id: '1',
        description: 'This is an updated advertisement',
      });
      expect(new Date(mockCall.variables.startAt)).toBeInstanceOf(Date);
      expect(new Date(mockCall.variables.endAt)).toBeInstanceOf(Date);
      const updateFailedText = screen.queryByText((_, element) => {
        return (
          element?.textContent === 'Update Failed' &&
          element.tagName.toLowerCase() === 'div'
        );
      });
      expect(updateFailedText).toBeNull();
    });
  });

  it('throw error while uploading attachment of more than 5 mb', async () => {
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider>
                <AdvertisementRegister
                  setAfterActive={vi.fn() as () => void}
                  setAfterCompleted={vi.fn() as () => void}
                />
              </MockedProvider>
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

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
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    const mediaInput = screen.getByTestId('advertisementMedia');
    await userEvent.upload(mediaInput, mockBigFile);

    expect(toastErrorSpy).toHaveBeenCalledWith('File too large: test.jpg');
    expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('upload valid files successfully', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider>
                <AdvertisementRegister
                  setAfterActive={vi.fn() as () => void}
                  setAfterCompleted={vi.fn() as () => void}
                />
              </MockedProvider>
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

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
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue('Ad1');
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    const mediaInput = screen.getByTestId('advertisementMedia');
    await userEvent.upload(mediaInput, mockFile);

    expect(screen.queryByTestId('mediaPreview')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('Validates file types during upload', async () => {
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="register"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    fireEvent.click(screen.getByText(translations.createAdvertisement));

    const invalidFile = new File(['content'], 'test.pdf', {
      type: 'image/pdf',
    });

    const mediaInput = screen.getByTestId('advertisementMedia');
    expect(mediaInput).toBeInTheDocument();
    await userEvent.upload(mediaInput, invalidFile);

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith('Invalid file type: test.pdf');
    });
  });

  it('Validates that name is required', async () => {
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="register"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    fireEvent.click(screen.getByText(translations.createAdvertisement));

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: '' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText(translations.register));
    });

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        'Invalid arguments for this action.',
      );
    });
  });

  it('does not shows updating attachment option in edit mode', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="edit"
                endAtEdit={new Date()}
                startAtEdit={new Date()}
                typeEdit="banner"
                nameEdit="Ad1"
                idEdit="1"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByTestId('editBtn'));

    const mediaPreview = await screen.queryByTestId('mediaPreview');
    expect(mediaPreview).not.toBeInTheDocument();
  });

  it('Updates only end date in edit mode', async () => {
    const updateMock = vi.fn().mockResolvedValue({
      data: {
        updateAdvertisement: {
          id: '1',
        },
      },
    });
    mockUseMutation.mockReturnValue([updateMock]);

    const originalStartDate = new Date(
      dateConstants.create.startAtISO.split('T')[0],
    );
    const originalEndDate = new Date(
      dateConstants.create.endAtISO.split('T')[0],
    );
    const newEndDate = dateConstants.update.endAtISO.split('T')[0];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="edit"
                startAtEdit={originalStartDate}
                endAtEdit={originalEndDate}
                typeEdit="banner"
                nameEdit="Ad1"
                idEdit="1"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByTestId('editBtn'));

    const endDateField = screen.getByLabelText(translations.RendDate);
    fireEvent.change(endDateField, { target: { value: newEndDate } });

    fireEvent.click(screen.getByText(translations.saveChanges));

    await waitFor(() => {
      const mockCall = updateMock.mock.calls[0][0];
      expect(mockCall.variables).toEqual({
        id: '1',
        endAt: expect.any(String),
        startAt: expect.any(String),
      });
      expect(new Date(mockCall.variables.endAt)).toBeInstanceOf(Date);
      expect(new Date(mockCall.variables.startAt)).toBeInstanceOf(Date);
    });
  });

  it('Selects menu ad type', async () => {
    const createMock = vi.fn().mockResolvedValue({
      data: {
        createAdvertisement: {
          id: '123',
        },
      },
    });
    mockUseMutation.mockReturnValue([createMock]);

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="register"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByText(translations.createAdvertisement));

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Menu Ad' },
    });

    fireEvent.change(screen.getByLabelText(translations.Rtype), {
      target: { value: 'menu' },
    });
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('menu');

    fireEvent.click(screen.getByText(translations.register));

    await waitFor(() => {
      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({
            name: 'Menu Ad',
            type: 'menu',
          }),
        }),
      );
    });
  });

  it('Handles error from create mutation', async () => {
    const createError = new Error('Creation failed due to server error');
    const createMock = vi.fn().mockRejectedValue(createError);
    mockUseMutation.mockReturnValue([createMock]);
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="register"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByText(translations.createAdvertisement));

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'New Ad' },
    });

    fireEvent.click(screen.getByText(translations.register));

    await waitFor(() => {
      expect(createMock).toHaveBeenCalled();
      expect(toastErrorSpy).toHaveBeenCalledWith(
        "An error occurred. Couldn't create advertisement",
      );
    });
  });

  it('Handles error from update mutation', async () => {
    const updateError = new Error('Update failed due to server error');
    const updateMock = vi.fn().mockRejectedValue(updateError);
    mockUseMutation.mockReturnValue([updateMock]);
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="edit"
                endAtEdit={new Date()}
                startAtEdit={new Date()}
                typeEdit="banner"
                nameEdit="Ad1"
                idEdit="1"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByTestId('editBtn'));

    const nameField = screen.getByLabelText(translations.Rname);
    fireEvent.change(nameField, { target: { value: 'Updated Ad' } });

    fireEvent.click(screen.getByText(translations.saveChanges));

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalled();
      expect(toastErrorSpy).toHaveBeenCalledWith(
        'Update failed due to server error',
      );
    });
  });

  it('Updates only start date in edit mode', async () => {
    const updateMock = vi.fn().mockResolvedValue({
      data: {
        updateAdvertisement: {
          id: '1',
        },
      },
    });
    mockUseMutation.mockReturnValue([updateMock]);

    const originalStartDate = new Date(
      dateConstants.create.startAtISO.split('T')[0],
    );
    const originalEndDate = new Date(
      dateConstants.create.endAtISO.split('T')[0],
    );
    const newStartDate = dateConstants.update.startAtISO.split('T')[0];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="edit"
                startAtEdit={originalStartDate}
                endAtEdit={originalEndDate}
                typeEdit="banner"
                nameEdit="Ad1"
                idEdit="1"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByTestId('editBtn'));

    const startDateField = screen.getByLabelText(translations.RstartDate);
    fireEvent.change(startDateField, { target: { value: newStartDate } });

    fireEvent.click(screen.getByText(translations.saveChanges));

    await waitFor(() => {
      const mockCall = updateMock.mock.calls[0][0];
      expect(mockCall.variables).toEqual({
        id: '1',
        startAt: expect.any(String),
        endAt: expect.any(String),
      });
      expect(new Date(mockCall.variables.startAt)).toBeInstanceOf(Date);
      expect(new Date(mockCall.variables.endAt)).toBeInstanceOf(Date);
    });
  });

  it('Updates advertisement name and type in edit mode', async () => {
    const updateMock = vi.fn().mockResolvedValue({
      data: {
        updateAdvertisement: {
          id: '1',
        },
      },
    });
    mockUseMutation.mockReturnValue([updateMock]);

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="edit"
                endAtEdit={new Date()}
                startAtEdit={new Date()}
                typeEdit="banner"
                nameEdit="Original Name"
                idEdit="1"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByTestId('editBtn'));

    const nameField = screen.getByLabelText(translations.Rname);
    fireEvent.change(nameField, { target: { value: 'Updated Name' } });
    expect(nameField).toHaveValue('Updated Name');

    const typeField = screen.getByLabelText(translations.Rtype);
    fireEvent.change(typeField, { target: { value: 'menu' } });
    expect(typeField).toHaveValue('menu');

    fireEvent.click(screen.getByText(translations.saveChanges));

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({
            id: '1',
            name: 'Updated Name',
            type: 'menu',
          }),
        }),
      );
    });
  });

  it('Handles multiple file uploads with video files', async () => {
    const mockVideoFile = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    });
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="register"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByText(translations.createAdvertisement));

    const mediaInput = screen.getByTestId('advertisementMedia');

    await userEvent.upload(mediaInput, mockFile);
    expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();

    await userEvent.upload(mediaInput, mockVideoFile);

    const previews = screen.getAllByTestId('mediaPreview');
    expect(previews.length).toBe(2);
  });

  it('advertisement with undefined orgId should show 404', async () => {
    const useParamsMock = vi.spyOn(router, 'useParams');
    useParamsMock.mockReturnValue({ orgId: undefined });

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.MemoryRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider>
                <AdvertisementRegister
                  setAfterActive={vi.fn() as () => void}
                  setAfterCompleted={vi.fn() as () => void}
                />
              </MockedProvider>
            </I18nextProvider>
          </router.MemoryRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(
      screen.getByText('Oops! The Page you requested was not found!'),
    ).toBeInTheDocument();

    useParamsMock.mockRestore();
  });

  it('Handles file upload with no files selected', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="register"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    fireEvent.click(screen.getByText(translations.createAdvertisement));

    const mediaInput = screen.getByTestId('advertisementMedia');
    fireEvent.change(mediaInput, { target: { files: null } });

    expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
  });

  it('Handles createAdvertisement returning no data', async () => {
    const createMock = vi.fn().mockResolvedValue({ data: null });
    mockUseMutation.mockReturnValue([createMock]);
    const setAfterActiveMock = vi.fn();
    const setAfterCompletedMock = vi.fn();

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="register"
                setAfterActive={setAfterActiveMock}
                setAfterCompleted={setAfterCompletedMock}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByText(translations.createAdvertisement));

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Test Ad' },
    });

    fireEvent.click(screen.getByText(translations.register));

    await waitFor(() => {
      expect(createMock).toHaveBeenCalled();
      expect(setAfterActiveMock).not.toHaveBeenCalled();
      expect(setAfterCompletedMock).not.toHaveBeenCalled();
    });
  });

  it('Successfully creates advertisement and resets form state', async () => {
    const createMock = vi.fn().mockResolvedValue({
      data: {
        createAdvertisement: {
          id: '123',
        },
      },
    });
    mockUseMutation.mockReturnValue([createMock]);

    const setAfterActiveMock = vi.fn();
    const setAfterCompletedMock = vi.fn();
    const toastSuccessSpy = vi.spyOn(NotificationToast, 'success');

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="register"
                setAfterActive={setAfterActiveMock}
                setAfterCompleted={setAfterCompletedMock}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByText(translations.createAdvertisement));

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Test Ad' },
    });

    fireEvent.change(screen.getByLabelText(translations.Rtype), {
      target: { value: 'banner' },
    });

    fireEvent.change(screen.getByLabelText(translations.RstartDate), {
      target: { value: dateConstants.create.startAtISO.split('T')[0] },
    });

    fireEvent.change(screen.getByLabelText(translations.RendDate), {
      target: { value: dateConstants.create.endAtISO.split('T')[0] },
    });

    fireEvent.click(screen.getByText(translations.register));

    await waitFor(() => {
      expect(createMock).toHaveBeenCalled();

      expect(toastSuccessSpy).toHaveBeenCalledWith(
        translations.advertisementCreated,
      );

      expect(setAfterActiveMock).toHaveBeenCalledWith(null);
      expect(setAfterCompletedMock).toHaveBeenCalledWith(null);

      expect(screen.queryByText(translations.addNew)).not.toBeInTheDocument();
    });
  });

  it('Does not show toast when create error is not an Error instance', async () => {
    const createMock = vi.fn().mockRejectedValue('string error');
    mockUseMutation.mockReturnValue([createMock]);
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="register"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByText(translations.createAdvertisement));

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Test Ad' },
    });

    fireEvent.change(screen.getByLabelText(translations.RstartDate), {
      target: { value: dateConstants.create.startAtISO.split('T')[0] },
    });

    fireEvent.change(screen.getByLabelText(translations.RendDate), {
      target: { value: dateConstants.create.endAtISO.split('T')[0] },
    });

    fireEvent.click(screen.getByText(translations.register));

    await waitFor(() => {
      expect(createMock).toHaveBeenCalled();
    });

    expect(toastErrorSpy).not.toHaveBeenCalled();
  });

  it('Handles updateAdvertisement returning no data', async () => {
    const updateMock = vi.fn().mockResolvedValue({ data: null });
    mockUseMutation.mockReturnValue([updateMock]);
    const setAfterActiveMock = vi.fn();
    const setAfterCompletedMock = vi.fn();
    const toastSuccessSpy = vi.spyOn(NotificationToast, 'success');

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="edit"
                startAtEdit={new Date()}
                endAtEdit={new Date()}
                typeEdit="banner"
                nameEdit="Ad1"
                idEdit="1"
                setAfterActive={setAfterActiveMock}
                setAfterCompleted={setAfterCompletedMock}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByTestId('editBtn'));

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Updated Ad' },
    });

    fireEvent.click(screen.getByText(translations.saveChanges));

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalled();
      expect(toastSuccessSpy).not.toHaveBeenCalled();
      expect(setAfterActiveMock).not.toHaveBeenCalled();
    });
  });

  it('Handles update error that is not an Error instance', async () => {
    const updateMock = vi.fn().mockRejectedValue('string error');
    mockUseMutation.mockReturnValue([updateMock]);
    const toastErrorSpy = vi.spyOn(NotificationToast, 'error');

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="edit"
                startAtEdit={new Date()}
                endAtEdit={new Date()}
                typeEdit="banner"
                nameEdit="Ad1"
                idEdit="1"
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByTestId('editBtn'));

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Updated Ad' },
    });

    fireEvent.click(screen.getByText(translations.saveChanges));

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalled();
      expect(toastErrorSpy).not.toHaveBeenCalled();
    });
  });

  it('Uses default type, name and description when typeEdit, nameEdit and descriptionEdit are empty string', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <router.BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister
                formStatus="edit"
                idEdit="1"
                nameEdit={undefined as unknown as string}
                descriptionEdit={undefined as unknown as string}
                typeEdit=""
                startAtEdit={new Date()}
                endAtEdit={new Date()}
                setAfterActive={vi.fn() as () => void}
                setAfterCompleted={vi.fn() as () => void}
              />
            </I18nextProvider>
          </router.BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    fireEvent.click(screen.getByTestId('editBtn'));

    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');
    expect(screen.getByLabelText(translations.Rname)).toHaveValue('');
    expect(screen.getByLabelText(translations.Rdesc)).toHaveValue('');
  });

  vi.useRealTimers();
});
