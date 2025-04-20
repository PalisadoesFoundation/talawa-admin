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
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { client } from 'components/Advertisements/AdvertisementsMocks';
import { AdvertisementType } from 'types/Advertisement/type';

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation?.advertisement ?? null,
  ),
);

const mockUseMutation = vi.fn();
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
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue([vi.fn()]);
  });
  afterEach(() => {
    vi.clearAllMocks();
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
      expect(screen.getByTestId('delete_title')).toBeInTheDocument();
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
    const mockEndDate = new Date(2025, 11, 31);
    const mockStartDate = new Date(2024, 0, 1);
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

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date('2025-04-09T18:30:00.000Z'),
                  startAt: new Date('2025-04-08T18:30:00.000Z'),
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
        endAt: '2025-04-09T18:30:00.000Z',
        startAt: '2025-04-08T18:30:00.000Z',
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
                        startDate: '2022-01-01',
                        endDate: '2023-01-01',
                        mediaUrl: 'http://example1.com',
                      },
                      cursor: 'cursor1',
                    },
                    {
                      node: {
                        id: '2',
                        name: 'Advertisement2',
                        startDate: '2024-02-01',
                        endDate: '2025-02-01',
                        mediaUrl: 'http://example2.com',
                      },
                      cursor: 'cursor2',
                    },
                    {
                      node: {
                        id: '3',
                        name: 'Advertisement1',
                        startDate: '2022-01-01',
                        endDate: '2023-01-01',
                        mediaUrl: 'http://example1.com',
                      },
                      cursor: 'cursor3',
                    },
                    {
                      node: {
                        id: '4',
                        name: 'Advertisement2',
                        startDate: '2024-02-01',
                        endDate: '2025-02-01',
                        mediaUrl: 'http://example2.com',
                      },
                      cursor: 'cursor4',
                    },
                    {
                      node: {
                        id: '5',
                        name: 'Advertisement1',
                        startDate: '2022-01-01',
                        endDate: '2023-01-01',
                        mediaUrl: 'http://example1.com',
                      },
                      cursor: 'cursor5',
                    },
                    {
                      node: {
                        id: '6',
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
              <MockedProvider mocks={mocks} addTypename={false}>
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
      expect(screen.getByTestId('delete_title')).toBeInTheDocument();
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
              <MockedProvider addTypename={false}>
                <AdvertisementEntry
                  advertisement={{
                    endAt: new Date('2030-01-01'),
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
              <MockedProvider addTypename={false}>
                <AdvertisementEntry
                  advertisement={{
                    endAt: new Date('2023-02-02'),
                    startAt: new Date('2023-01-01'),
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
});
