import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import type { NormalizedCacheObject } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import AdvertisementEntry from './AdvertisementEntry';
import AdvertisementRegister from '../AdvertisementRegister/AdvertisementRegister';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BACKEND_URL } from 'Constant/constant';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import dayjs from 'dayjs';
import useLocalStorage from 'utils/useLocalstorage';
import { MockedProvider } from '@apollo/client/testing';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/OrganizationQueries';
import { DELETE_ADVERTISEMENT_BY_ID } from 'GraphQl/Mutations/mutations';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

const { getItem } = useLocalStorage();

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + getItem('token') || '',
  },
});
const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation?.advertisement ?? null,
  ),
);

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

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

describe('Testing Advertisement Entry Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Testing rendering and deleting of advertisement', async () => {
    const deleteAdByIdMock = vi.fn();
    mockUseMutation.mockReturnValue([deleteAdByIdMock]);
    const { getByTestId, getAllByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                endDate={new Date()}
                startDate={new Date()}
                id="1"
                key={1}
                mediaUrl="data:videos"
                name="Advert1"
                organizationId="1"
                type="POPUP"
                setAfter={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    //Testing rendering
    expect(getByTestId('AdEntry')).toBeInTheDocument();
    expect(getAllByText('POPUP')[0]).toBeInTheDocument();
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

  it('should use default props when none are provided', () => {
    render(
      <AdvertisementEntry
        id={''}
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
    expect(mediaElement).toHaveAttribute('src', '');

    // Check that the component renders with default `endDate`
    const defaultEndDate = new Date().toDateString();
    expect(screen.getByText(`Ends on ${defaultEndDate}`)).toBeInTheDocument();

    // Check that the component renders with default `startDate`
    const defaultStartDate = new Date().toDateString();
    expect(screen.getByText(`Ends on ${defaultStartDate}`)).toBeInTheDocument(); //fix text "Ends on"?
  });

  it('should correctly override default props when values are provided', () => {
    const mockName = 'Test Ad';
    const mockType = 'Banner';
    const mockMediaUrl = 'https://example.com/media.png';
    const mockEndDate = new Date(2025, 11, 31);
    const mockStartDate = new Date(2024, 0, 1);
    const mockOrganizationId = 'org123';

    const { getByText } = render(
      <AdvertisementEntry
        name={mockName}
        type={mockType}
        mediaUrl={mockMediaUrl}
        endDate={mockEndDate}
        startDate={mockStartDate}
        organizationId={mockOrganizationId}
        id={''}
        setAfter={function () // _value: React.SetStateAction<string | null | undefined>,
        : void {
          throw new Error('Function not implemented.');
        }}
      />,
    );

    // Check that the component renders with provided values
    expect(getByText(mockName)).toBeInTheDocument();
    expect(getByText(mockType)).toBeInTheDocument();
    expect(screen.getByTestId('media')).toHaveAttribute('src', mockMediaUrl);
    expect(
      getByText(`Ends on ${mockEndDate.toDateString()}`),
    ).toBeInTheDocument();
  });

  it('should open and close the dropdown when options button is clicked', () => {
    const { getByTestId, queryByText, getAllByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                endDate={new Date()}
                startDate={new Date()}
                id="1"
                key={1}
                mediaUrl=""
                name="Advert1"
                organizationId="1"
                type="POPUP"
                setAfter={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    // Test initial rendering
    expect(getByTestId('AdEntry')).toBeInTheDocument();
    expect(getAllByText('POPUP')[0]).toBeInTheDocument();
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
            _id: '1',
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
                endDate={new Date()}
                startDate={new Date()}
                type="POPUP"
                name="Advert1"
                organizationId="1"
                mediaUrl=""
                id="1"
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
      target: { value: 'BANNER' },
    });
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('BANNER');

    fireEvent.change(screen.getByLabelText(translations.RstartDate), {
      target: { value: dayjs().add(1, 'day').format('YYYY-MM-DD') },
    });

    fireEvent.change(screen.getByLabelText(translations.RendDate), {
      target: { value: dayjs().add(2, 'days').format('YYYY-MM-DD') },
    });

    fireEvent.click(screen.getByTestId('addonupdate'));

    expect(updateAdByIdMock).toHaveBeenCalledWith({
      variables: {
        id: '1',
        name: 'Updated Advertisement',
        type: 'BANNER',
        startDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().add(2, 'days').format('YYYY-MM-DD'),
      },
    });
  });

  it('Simulating if the mutation doesnt have data variable while updating', async () => {
    const updateAdByIdMock = vi.fn().mockResolvedValue({
      updateAdvertisement: {
        _id: '1',
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
                endDate={new Date()}
                startDate={new Date()}
                type="POPUP"
                name="Advert1"
                organizationId="1"
                mediaUrl=""
                id="1"
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
      target: { value: 'BANNER' },
    });
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('BANNER');

    fireEvent.click(screen.getByTestId('addonupdate'));

    expect(updateAdByIdMock).toHaveBeenCalledWith({
      variables: {
        id: '1',
        name: 'Updated Advertisement',
        type: 'BANNER',
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
          _id: '1',
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

    fireEvent.change(screen.getByLabelText(translations.Rtype), {
      target: { value: 'BANNER' },
    });
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('BANNER');

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

    fireEvent.click(screen.getByTestId('addonregister'));

    expect(createAdByIdMock).toHaveBeenCalledWith({
      variables: {
        organizationId: '1',
        name: 'Updated Advertisement',
        file: '',
        type: 'BANNER',
        startDate: dayjs(new Date('2023-01-01')).format('YYYY-MM-DD'),
        endDate: dayjs(new Date('2023-02-01')).format('YYYY-MM-DD'),
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
          query: DELETE_ADVERTISEMENT_BY_ID,
          variables: {
            id: '1',
          },
        },
        result: {
          data: {
            advertisements: {
              _id: null,
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
                  endDate={new Date()}
                  startDate={new Date()}
                  id="1"
                  key={1}
                  mediaUrl="data:videos"
                  name="Advert1"
                  organizationId="1"
                  type="POPUP"
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
    expect(getAllByText('POPUP')[0]).toBeInTheDocument();
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
