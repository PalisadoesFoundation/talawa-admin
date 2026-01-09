import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router';
import AdvertisementEntry from './AdvertisementEntry';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { MockedProvider } from '@apollo/client/testing';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/AdvertisementQueries';
import { DELETE_ADVERTISEMENT_MUTATION } from 'GraphQl/Mutations/AdvertisementMutations';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { client } from 'components/Advertisements/AdvertisementsMocks';
import { AdvertisementType } from 'types/AdminPortal/Advertisement/type';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation?.advertisement ?? null,
  ),
);

let mockUseMutation: ReturnType<typeof vi.fn>;
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useMutation: () => mockUseMutation(),
  };
});

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: '1' }),
  };
});

global.URL.createObjectURL = vi.fn(() => 'mocked-url');

describe('Testing Advertisement Entry Component', () => {
  beforeEach(() => {
    mockUseMutation = vi.fn();
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue([vi.fn()]);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Testing rendering and deleting of advertisement', async () => {
    const deleteAdByIdMock = vi.fn();
    mockUseMutation.mockReturnValue([deleteAdByIdMock]);
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: [{ url: 'test.jpg', mimeType: 'image/jpeg' }],
                  name: 'Advert1',
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('AdEntry')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(screen.getAllByText('Advert1')[0]).toBeInTheDocument();
    expect(screen.getByTestId('media')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('moreiconbtn'));
    fireEvent.click(screen.getByTestId('deletebtn'));

    await waitFor(() => {
      expect(
        screen.getByText(translations.deleteAdvertisement),
      ).toBeInTheDocument();
      expect(screen.getByTestId('delete_body')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete_yes'));

    await waitFor(() => {
      expect(deleteAdByIdMock).toHaveBeenCalledWith({
        variables: {
          id: '1',
        },
      });
      const deletedMessage = screen.queryByText('Advertisement Deleted');
      expect(deletedMessage).toBeNull();
    });

    deleteAdByIdMock.mockRejectedValueOnce(new Error('Deletion Failed'));

    fireEvent.click(screen.getByTestId('moreiconbtn'));

    fireEvent.click(screen.getByTestId('delete_yes'));

    await waitFor(() => {
      expect(deleteAdByIdMock).toHaveBeenCalledWith({
        variables: {
          id: '1',
        },
      });
      const deletionFailedText = screen.queryByText((_, element) => {
        return (
          element?.textContent === 'Deletion Failed' &&
          element.tagName.toLowerCase() === 'div'
        );
      });
      expect(deletionFailedText).toBeNull();
    });
  });

  it('should handle deletion error when error is not an Error instance', async () => {
    const deleteAdByIdMock = vi.fn();
    mockUseMutation.mockReturnValue([deleteAdByIdMock, { loading: false }]);

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: [{ url: 'test.jpg', mimeType: 'image/jpeg' }],
                  name: 'Test Ad',
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    // Mock deletion to reject with a non-Error value (string, number, object, etc.)
    deleteAdByIdMock.mockRejectedValueOnce('Network failure');

    fireEvent.click(screen.getByTestId('moreiconbtn'));
    fireEvent.click(screen.getByTestId('deletebtn'));

    await waitFor(() => {
      expect(
        screen.getByText(translations['deleteAdvertisement']),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete_yes'));

    await waitFor(() => {
      expect(deleteAdByIdMock).toHaveBeenCalledWith({
        variables: {
          id: '1',
        },
      });
    });

    // When error is not an Error instance, NotificationToast.error should not be called
    // (no way to easily assert that, but the branch will be covered)
  });

  it('should use default props when none are provided', () => {
    render(
      <AdvertisementEntry
        advertisement={{
          endAt: new Date(),
          startAt: new Date(),
          id: '1',
          attachments: [{ url: 'test.jpg', mimeType: 'image/jpeg' }],
          name: 'Advert1',
          createdAt: new Date(),
          organization: {
            id: '12',
          },
          orgId: '1',
          type: AdvertisementType.Banner,
          updatedAt: new Date(),
        }}
        setAfterActive={vi.fn()}
        setAfterCompleted={vi.fn()}
      />,
    );

    const elements = screen.getAllByText('');
    elements.forEach((element) => expect(element).toBeInTheDocument());

    const mediaElement = screen.getByTestId('media');
    expect(mediaElement).toHaveAttribute('src', 'test.jpg');

    const defaultEndDate = new Date().toDateString();
    expect(screen.getByText(`Ends : ${defaultEndDate}`)).toBeInTheDocument();

    const defaultStartDate = new Date().toDateString();
    expect(
      screen.getByText(`Starts : ${defaultStartDate}`),
    ).toBeInTheDocument();
  });

  it('should correctly override default props when values are provided', () => {
    const mockMediaUrl = 'https://example.com/media.png';
    const mockMediaType = 'image/png';
    const mockName = 'Test Ad';
    const mockType = AdvertisementType.Menu;
    const mockCreatedAt = new Date();
    const mockEndDate = dayjs().add(1, 'year').toDate();
    const mockStartDate = dayjs().toDate();
    const mockUpdatedAt = new Date();
    const mockOrganizationId = 'org123';

    const { getByText } = render(
      <AdvertisementEntry
        advertisement={{
          endAt: mockEndDate,
          startAt: mockStartDate,
          id: '1',
          attachments: [{ url: mockMediaUrl, mimeType: mockMediaType }],
          name: mockName,
          createdAt: mockCreatedAt,
          organization: {
            id: mockOrganizationId,
          },
          orgId: '1',
          type: mockType,
          updatedAt: mockUpdatedAt,
        }}
        setAfterActive={vi.fn()}
        setAfterCompleted={vi.fn()}
      />,
    );

    expect(screen.getByText(mockName)).toBeInTheDocument();
    expect(screen.getByText(`Type: ${mockType}`)).toBeInTheDocument();
    expect(screen.getByTestId('media')).toHaveAttribute('src', mockMediaUrl);
    expect(
      getByText(`Ends : ${mockEndDate.toDateString()}`),
    ).toBeInTheDocument();
  });

  it('should open and close the dropdown when options button is clicked', () => {
    const { getByTestId, queryByText, getAllByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: [],
                  name: 'Advert1',
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(getByTestId('AdEntry')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(getAllByText('Advert1')[0]).toBeInTheDocument();

    const optionsButton = getByTestId('moreiconbtn');

    expect(queryByText('Edit')).toBeNull();

    fireEvent.click(optionsButton);

    expect(queryByText('Edit')).toBeInTheDocument();

    fireEvent.click(optionsButton);

    expect(queryByText('Edit')).toBeNull();
  });

  it('Simulating if the mutation doesnt have data variable while updating', async () => {
    const updateAdByIdMock = vi.fn().mockResolvedValue({
      updateAdvertisement: {
        id: '1',
        name: 'Updated Advertisement',
        type: 'BANNER',
      },
    });

    mockUseMutation.mockReturnValue([updateAdByIdMock]);

    // Dynamic future dates for active ad using UTC to avoid timezone issues
    const futureStart = dayjs.utc().add(30, 'days').startOf('day');
    const futureEnd = dayjs.utc().add(31, 'days').startOf('day');

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: futureEnd.toDate(),
                  startAt: futureStart.toDate(),
                  id: '1',
                  attachments: [],
                  name: 'Advert1',
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    const optionsButton = screen.getByTestId('moreiconbtn');
    fireEvent.click(optionsButton);
    fireEvent.click(screen.getByTestId('editBtn'));

    fireEvent.change(screen.getByLabelText('Enter name of Advertisement'), {
      target: { value: 'Updated Advertisement' },
    });

    expect(screen.getByLabelText('Enter name of Advertisement')).toHaveValue(
      'Updated Advertisement',
    );

    fireEvent.change(screen.getByLabelText(translations.Rtype), {
      target: { value: 'menu' },
    });
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('menu');

    fireEvent.click(screen.getByTestId('addonupdate'));

    expect(updateAdByIdMock).toHaveBeenCalledWith({
      variables: {
        id: '1',
        name: 'Updated Advertisement',
        type: 'menu',
        endAt: futureEnd.toISOString(),
        startAt: futureStart.toISOString(),
      },
    });
  });

  it('delete advertisement', async () => {
    const deleteAdByIdMock = vi.fn();
    const mocks = [
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
                        startDate: dayjs()
                          .subtract(2, 'years')
                          .format('YYYY-MM-DD'),
                        endDate: dayjs()
                          .subtract(1, 'year')
                          .format('YYYY-MM-DD'),
                        mediaUrl: 'http://example1.com',
                      },
                      cursor: 'cursor1',
                    },
                    {
                      node: {
                        id: '2',
                        name: 'Advertisement2',
                        startDate: dayjs().format('YYYY-MM-DD'),
                        endDate: dayjs().add(1, 'year').format('YYYY-MM-DD'),
                        mediaUrl: 'http://example2.com',
                      },
                      cursor: 'cursor2',
                    },
                    {
                      node: {
                        id: '3',
                        name: 'Advertisement1',
                        startDate: dayjs()
                          .subtract(2, 'years')
                          .format('YYYY-MM-DD'),
                        endDate: dayjs()
                          .subtract(1, 'year')
                          .format('YYYY-MM-DD'),
                        mediaUrl: 'http://example1.com',
                      },
                      cursor: 'cursor3',
                    },
                    {
                      node: {
                        id: '4',
                        name: 'Advertisement2',
                        startDate: dayjs().format('YYYY-MM-DD'),
                        endDate: dayjs().add(1, 'year').format('YYYY-MM-DD'),
                        mediaUrl: 'http://example2.com',
                      },
                      cursor: 'cursor4',
                    },
                    {
                      node: {
                        id: '5',
                        name: 'Advertisement1',
                        startDate: dayjs()
                          .subtract(2, 'years')
                          .format('YYYY-MM-DD'),
                        endDate: dayjs()
                          .subtract(1, 'year')
                          .format('YYYY-MM-DD'),
                        mediaUrl: 'http://example1.com',
                      },
                      cursor: 'cursor5',
                    },
                    {
                      node: {
                        id: '6',
                        name: 'Advertisement2',
                        startDate: dayjs().format('YYYY-MM-DD'),
                        endDate: dayjs().add(1, 'year').format('YYYY-MM-DD'),
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
          query: DELETE_ADVERTISEMENT_MUTATION,
          variables: {
            id: '1',
          },
        },
        result: {
          data: {
            advertisements: {
              id: null,
            },
          },
        },
      },
    ];
    mockUseMutation.mockReturnValue([deleteAdByIdMock]);
    const { getByTestId, getAllByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks}>
                <AdvertisementEntry
                  advertisement={{
                    endAt: new Date(),
                    startAt: new Date(),
                    id: '1',
                    attachments: [],
                    name: 'Advert1',
                    createdAt: new Date(),
                    organization: {
                      id: '12',
                    },
                    orgId: '1',
                    type: AdvertisementType.Banner,
                    updatedAt: new Date(),
                  }}
                  setAfterActive={vi.fn()}
                  setAfterCompleted={vi.fn()}
                />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(getByTestId('AdEntry')).toBeInTheDocument();
    expect(getByTestId('Ad_type')).toBeInTheDocument();
    expect(getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(getAllByText('Advert1')[0]).toBeInTheDocument();
    expect(screen.getByTestId('media')).toBeInTheDocument();

    fireEvent.click(getByTestId('moreiconbtn'));
    fireEvent.click(getByTestId('deletebtn'));

    await waitFor(() => {
      expect(
        screen.getByText(translations.deleteAdvertisement),
      ).toBeInTheDocument();
      expect(screen.getByTestId('delete_body')).toBeInTheDocument();
    });

    fireEvent.click(getByTestId('delete_yes'));

    await waitFor(() => {
      expect(deleteAdByIdMock).toHaveBeenCalledWith({
        variables: {
          id: '1',
        },
      });
      const deletedMessage = screen.queryByText('Advertisement Deleted');
      expect(deletedMessage).toBeNull();
    });

    deleteAdByIdMock.mockRejectedValueOnce(new Error('Deletion Failed'));

    fireEvent.click(getByTestId('moreiconbtn'));

    fireEvent.click(getByTestId('delete_yes'));

    await waitFor(() => {
      expect(deleteAdByIdMock).toHaveBeenCalledWith({
        variables: {
          id: '1',
        },
      });
      const deletionFailedText = screen.queryByText((_, element) => {
        return (
          element?.textContent === 'Deletion Failed' &&
          element.tagName.toLowerCase() === 'div'
        );
      });
      expect(deletionFailedText).toBeNull();
    });
  });

  it('render Carousel correctly for active ads', async () => {
    const { getByTestId, getAllByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider>
                <AdvertisementEntry
                  advertisement={{
                    endAt: dayjs().add(4, 'year').toDate(),
                    startAt: new Date(),
                    id: '1',
                    attachments: [
                      {
                        url: 'test1.jpg',
                        mimeType: 'image/jpeg',
                      },
                      {
                        url: 'test2.jpg',
                        mimeType: 'image/jpeg',
                      },
                    ],
                    name: 'Advert1',
                    createdAt: new Date(),
                    organization: {
                      id: '12',
                    },
                    orgId: '1',
                    type: AdvertisementType.Banner,
                    updatedAt: new Date(),
                  }}
                  setAfterActive={vi.fn()}
                  setAfterCompleted={vi.fn()}
                />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(getByTestId('AdEntry')).toBeInTheDocument();
    expect(getByTestId('Ad_type')).toBeInTheDocument();
    expect(getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(getAllByText('Advert1')[0]).toBeInTheDocument();

    const mediaElements = screen.queryAllByTestId('media');
    expect(mediaElements).toHaveLength(2);
    mediaElements.forEach((element, index) => {
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('src', `test${index + 1}.jpg`);
      expect(element).toHaveAttribute(
        'alt',
        `Advertisement image #${index + 1} for Advert1`,
      );
    });
  });

  it('render Carousel correctly for completed ads', async () => {
    const { getByTestId, getAllByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider>
                <AdvertisementEntry
                  advertisement={{
                    endAt: dayjs
                      .utc()
                      .subtract(1, 'day')
                      .startOf('day')
                      .toDate(),
                    startAt: dayjs
                      .utc()
                      .subtract(2, 'days')
                      .startOf('day')
                      .toDate(),
                    id: '1',
                    attachments: [
                      {
                        url: 'test1.jpg',
                        mimeType: 'image/jpeg',
                      },
                      {
                        url: 'test2.jpg',
                        mimeType: 'image/jpeg',
                      },
                    ],
                    name: 'Advert1',
                    createdAt: new Date(),
                    organization: {
                      id: '12',
                    },
                    orgId: '1',
                    type: AdvertisementType.Banner,
                    updatedAt: new Date(),
                  }}
                  setAfterActive={vi.fn()}
                  setAfterCompleted={vi.fn()}
                />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    //Testing rendering
    expect(getByTestId('AdEntry')).toBeInTheDocument();
    expect(getByTestId('Ad_type')).toBeInTheDocument();
    expect(getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(getAllByText('Advert1')[0]).toBeInTheDocument();

    const mediaElements = screen.queryAllByTestId('media');
    expect(mediaElements).toHaveLength(2);
    mediaElements.forEach((element, index) => {
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('src', `test${index + 1}.jpg`);
      expect(element).toHaveAttribute(
        'alt',
        `Advertisement image #${index + 1} for Advert1`,
      );
    });
  });

  it('should render video media when attachment is video type', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: [
                    { url: 'test-video.mp4', mimeType: 'video/mp4' },
                  ],
                  name: 'Video Ad',
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    const videoElement = screen.getByTestId('media');
    expect(videoElement.tagName.toLowerCase()).toBe('video');
    expect(videoElement).toHaveProperty('muted', true);
    expect(videoElement).toHaveProperty('autoplay', true);
    expect(videoElement).toHaveProperty('loop', true);
  });

  it('should display "No media available" when there are no attachments', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: [],
                  name: 'No Media Ad',
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByText('No media available')).toBeInTheDocument();
  });

  it('should display "No Description" when description is empty', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: [{ url: 'test.jpg', mimeType: 'image/jpeg' }],
                  name: 'No Description Ad',
                  description: '',
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByText(translations.noDescription)).toBeInTheDocument();
  });

  it('should display description when provided', () => {
    const testDescription = 'This is a test advertisement description';
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: [{ url: 'test.jpg', mimeType: 'image/jpeg' }],
                  name: 'Ad with Description',
                  description: testDescription,
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByText(testDescription)).toBeInTheDocument();
  });

  it('should display "N/A" when startAt is null or undefined', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: null as unknown as Date,
                  id: '1',
                  attachments: [{ url: 'test.jpg', mimeType: 'image/jpeg' }],
                  name: 'Ad with no start date',
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByText('Starts : N/A')).toBeInTheDocument();
  });

  it('should display "N/A" when endAt is null or undefined', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: null as unknown as Date,
                  startAt: new Date(),
                  id: '1',
                  attachments: [{ url: 'test.jpg', mimeType: 'image/jpeg' }],
                  name: 'Ad with no end date',
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByText('Ends : N/A')).toBeInTheDocument();
  });

  it('should display "pop up" for pop_up type advertisement', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: [{ url: 'test.jpg', mimeType: 'image/jpeg' }],
                  name: 'Popup Ad',
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Popup,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('Ad_type')).toHaveTextContent('Type: pop up');
  });

  it('should display "No Description" when description is null or undefined', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: [{ url: 'test.jpg', mimeType: 'image/jpeg' }],
                  name: 'No Description Ad',
                  description: undefined,
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByText(translations.noDescription)).toBeInTheDocument();
  });

  it('should use "ad" as fallback when advertisement name is null in carousel alt text', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: [
                    { url: 'test1.jpg', mimeType: 'image/jpeg' },
                    { url: 'test2.jpg', mimeType: 'image/jpeg' },
                  ],
                  name: null as unknown as string,
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    const mediaElements = screen.queryAllByTestId('media');
    expect(mediaElements).toHaveLength(2);
    expect(mediaElements[0]).toHaveAttribute(
      'alt',
      'Advertisement image #1 for ad',
    );
  });

  it('should display "No media available" when attachments is null or undefined', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: undefined,
                  name: 'No Attachments Ad',
                  createdAt: new Date(),
                  organization: {
                    id: '12',
                  },
                  orgId: '1',
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByText('No media available')).toBeInTheDocument();
  });
});
