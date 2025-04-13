import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import AdvertisementEntry from './AdvertisementEntry';
import AdvertisementRegister from '../AdvertisementRegister/AdvertisementRegister';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import dayjs from 'dayjs';
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

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: '1' }),
  };
});

const mockFile = new File(['dummy content'], 'test.jpg', {
  type: 'image/jpeg',
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
    const screen = render(
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
                setAfter={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    //Testing rendering
    expect(screen.getByTestId('AdEntry')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(screen.getAllByText('Advert1')[0]).toBeInTheDocument();
    expect(screen.getByTestId('media')).toBeInTheDocument();

    //Testing successful deletion
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

    //Testing unsuccessful deletion
    deleteAdByIdMock.mockRejectedValueOnce(new Error('Deletion Failed'));

    fireEvent.click(screen.getByTestId('moreiconbtn'));

    fireEvent.click(screen.getByTestId('delete_yes'));

    await waitFor(() => {
      expect(deleteAdByIdMock).toHaveBeenCalledWith({
        variables: {
          id: '1',
        },
      });
      const deletionFailedText = screen.queryByText((content, element) => {
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
        setAfter={function () // _value: React.SetStateAction<string | null | undefined>,
        : void {
          throw new Error('Function not implemented.');
        }}
      />,
    );

    //Check if component renders with default ''(empty string)
    const elements = screen.getAllByText(''); // This will return an array of matching elements
    elements.forEach((element) => expect(element).toBeInTheDocument());

    // Check that the component renders with default `mediaUrl` (empty string)
    const mediaElement = screen.getByTestId('media');
    expect(mediaElement).toHaveAttribute('src', 'test.jpg');

    // Check that the component renders with default `endDate`
    const defaultEndDate = new Date().toDateString();
    expect(screen.getByText(`Ends : ${defaultEndDate}`)).toBeInTheDocument();

    // Check that the component renders with default `startDate`
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
        setAfter={function () // _value: React.SetStateAction<string | null | undefined>,
        : void {
          throw new Error('Function not implemented.');
        }}
      />,
    );

    // Check that the component renders with provided values
    expect(getByText(mockName)).toBeInTheDocument();
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
                setAfter={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    // Test initial rendering
    expect(getByTestId('AdEntry')).toBeInTheDocument();
    expect(screen.getByTestId('Ad_type')).toHaveTextContent('banner');
    expect(getAllByText('Advert1')[0]).toBeInTheDocument();

    // Test dropdown functionality
    const optionsButton = getByTestId('moreiconbtn');

    // Initially, the dropdown should not be visible
    expect(queryByText('Edit')).toBeNull();

    // Click to open the dropdown
    fireEvent.click(optionsButton);

    // After clicking the button, the dropdown should be visible
    expect(queryByText('Edit')).toBeInTheDocument();

    // Click again to close the dropdown
    fireEvent.click(optionsButton);

    // After the second click, the dropdown should be hidden again
    expect(queryByText('Edit')).toBeNull();
  });

  it('Updates the advertisement and shows success toast on successful update', async () => {
    const updateAdByIdMock = vi.fn().mockResolvedValue({
      data: {
        updateAdvertisement: {
          advertisement: {
            id: '1',
            name: 'Updated Advertisement',
            mediaUrl: '',
            startDate: dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD'),
            endDate: dayjs(new Date()).add(2, 'days').format('YYYY-MM-DD'),
            type: 'BANNER',
          },
        },
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
                setAfter={vi.fn()}
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

    fireEvent.change(screen.getByLabelText(translations.RstartDate), {
      target: { value: '2025-04-08' },
    });

    fireEvent.change(screen.getByLabelText(translations.RendDate), {
      target: { value: '2025-04-09' },
    });

    fireEvent.click(screen.getByTestId('addonupdate'));

    expect(updateAdByIdMock).toHaveBeenCalledWith({
      variables: {
        attachments: [],
        endAt: '2025-04-08T18:30:00.000Z',
        id: '1',
        name: 'Updated Advertisement',
        type: 'menu',
        startAt: '2025-04-07T18:30:00.000Z',
      },
    });
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
                setAfter={vi.fn()}
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
        attachments: [],
      },
    });
  });

  it('Simulating if the mutation does not have data variable while registering', async () => {
    vi.stubGlobal('location', {
      reload: vi.fn(),
      href: 'https://example.com/page/id=1',
    });

    const createAdByIdMock = vi.fn().mockResolvedValue({
      data1: {
        createAdvertisement: {
          id: '1',
        },
      },
    });

    mockUseMutation.mockReturnValue([createAdByIdMock]);

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {
                <AdvertisementRegister
                  setAfter={vi.fn()}
                  formStatus="register"
                />
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    fireEvent.click(screen.getByTestId('createAdvertisement'));

    fireEvent.change(screen.getByLabelText('Enter name of Advertisement'), {
      target: { value: 'Updated Advertisement' },
    });

    expect(screen.getByLabelText('Enter name of Advertisement')).toHaveValue(
      'Updated Advertisement',
    );

    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');

    fireEvent.change(screen.getByLabelText(translations.RstartDate), {
      target: { value: '2023-01-01' },
    });
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      '2023-01-01',
    );

    fireEvent.change(screen.getByLabelText(translations.RendDate), {
      target: { value: '2023-02-01' },
    });
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      '2023-02-01',
    );

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(translations.Rdesc), {
        target: { value: 'advertisement' },
      });

      expect(screen.getByLabelText(translations.Rdesc)).toHaveValue(
        'advertisement',
      );
      expect(screen.getByLabelText(translations.Rmedia)).toBeInTheDocument();
      fireEvent.change(screen.getByLabelText(translations.Rmedia), {
        target: {
          files: [mockFile],
        },
      });
    });

    expect(screen.getByTestId('addonregister')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('addonregister'));

    expect(createAdByIdMock).toHaveBeenCalledWith({
      variables: {
        organizationId: '1',
        attachments: [mockFile],
        name: 'Updated Advertisement',
        description: 'advertisement',
        type: 'banner',
        startAt: '2022-12-31T18:30:00.000Z',
        endAt: '2023-01-31T18:30:00.000Z',
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
                  setAfter={vi.fn()}
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
    expect(screen.getByTestId('media')).toBeInTheDocument();

    //Testing successful deletion
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

    //Testing unsuccessful deletion
    deleteAdByIdMock.mockRejectedValueOnce(new Error('Deletion Failed'));

    fireEvent.click(getByTestId('moreiconbtn'));

    fireEvent.click(getByTestId('delete_yes'));

    await waitFor(() => {
      expect(deleteAdByIdMock).toHaveBeenCalledWith({
        variables: {
          id: '1',
        },
      });
      const deletionFailedText = screen.queryByText((content, element) => {
        return (
          element?.textContent === 'Deletion Failed' &&
          element.tagName.toLowerCase() === 'div'
        );
      });
      expect(deletionFailedText).toBeNull();
    });
  });
});
