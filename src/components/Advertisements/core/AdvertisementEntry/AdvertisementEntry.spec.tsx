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
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/OrganizationQueries';
import { DELETE_ADVERTISEMENT_BY_ID } from 'GraphQl/Mutations/mutations';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { client } from 'components/Advertisements/AdvertisementsMocks';
import { toast } from 'react-toastify';
vi.spyOn(toast, 'error');

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation?.advertisement ?? null,
  ),
);
console.log('Available translations:', translations);

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

global.URL.createObjectURL = vi.fn(() => 'mocked-url');

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
                endAt={new Date()}
                startAt={new Date()}
                id="1"
                key={1}
                attachmentUrl="data:videos"
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
          input: {
            id: '1',
          },
        },
      });
      const deletedMessage = screen.queryByText('Advertisement Deleted');
      expect(deletedMessage).toBeNull();
    });

    //Testing unsuccessful deletion
    deleteAdByIdMock.mockRejectedValueOnce(new Error('Deletion Failed'));

    fireEvent.click(getByTestId('moreiconbtn'));
    console.log('screen');
    screen.debug();
    await waitFor(() => {
      expect(screen.getByTestId('deletebtn')).toBeInTheDocument();
    });
    fireEvent.click(getByTestId('deletebtn'));
    await waitFor(() => {
      expect(screen.getByTestId('delete_yes')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(deleteAdByIdMock).toHaveBeenCalledWith({
        variables: {
          input: {
            id: '1',
          },
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

    // Check that the component renders with default `attachmentUrl` (empty string)
    const mediaElement = screen.getByTestId('media');
    expect(mediaElement).toHaveAttribute('src', '');

    // Check that the component renders with default `endAt`
    const defaultendAt = new Date().toDateString();
    expect(screen.getByText(`Ends on ${defaultendAt}`)).toBeInTheDocument();

    // Check that the component renders with default `startAt`
    const defaultstartAt = new Date().toDateString();
    expect(screen.getByText(`Starts on ${defaultstartAt}`)).toBeInTheDocument();
  });

  it('should correctly override default props when values are provided', () => {
    const mockName = 'Test Ad';
    const mockType = 'Banner';
    const mockMediaUrl = 'https://example.com/media.png';
    const mockendAt = new Date(2025, 11, 31);
    const mockstartAt = new Date(2024, 0, 1);
    const mockOrganizationId = 'org123';

    const { getByText } = render(
      <AdvertisementEntry
        name={mockName}
        type={mockType}
        attachmentUrl={mockMediaUrl}
        endAt={mockendAt}
        startAt={mockstartAt}
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
      getByText(`Ends on ${mockendAt.toDateString()}`),
    ).toBeInTheDocument();
  });

  it('should open and close the dropdown when options button is clicked', () => {
    const { getByTestId, queryByText, getAllByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                endAt={new Date()}
                startAt={new Date()}
                id="1"
                key={1}
                attachmentUrl=""
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
            id: '1',
            name: 'Updated Advertisement',
            attachmentUrl: '',
            startAt: dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD'),
            endAt: dayjs(new Date()).add(2, 'days').format('YYYY-MM-DD'),
            type: 'banner',
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
                endAt={new Date()}
                startAt={new Date()}
                type="POPUP"
                name="Advert1"
                organizationId="1"
                attachmentUrl=""
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
    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Updated Advertisement' },
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue(
      'Updated Advertisement',
    );

    fireEvent.change(screen.getByLabelText(translations.Rtype), {
      target: { value: 'banner' },
    });
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');

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
        type: 'banner',
        attachments: [],
        startAt: expect.any(String),
        endAt: expect.any(String),
      },
    });
  });

  it('Simulating if the mutation doesnt have data variable while updating', async () => {
    const updateAdByIdMock = vi.fn().mockResolvedValue({
      updateAdvertisement: {
        id: '1',
        name: 'Updated Advertisement',
        type: 'banner',
      },
    });

    mockUseMutation.mockReturnValue([updateAdByIdMock]);

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                endAt={new Date()}
                startAt={new Date()}
                type="POPUP"
                name="Advert1"
                organizationId="1"
                attachmentUrl=""
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

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Updated Advertisement' },
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue(
      'Updated Advertisement',
    );

    fireEvent.change(screen.getByLabelText(translations.Rtype), {
      target: { value: 'banner' },
    });
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('banner');

    fireEvent.click(screen.getByTestId('addonupdate'));

    expect(updateAdByIdMock).toHaveBeenCalledWith({
      variables: {
        id: '1',
        name: 'Updated Advertisement',
        type: 'banner',
        attachments: [],
        startAt: expect.any(String),
        endAt: expect.any(String),
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

    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Updated Advertisement' },
    });

    expect(screen.getByLabelText(translations.Rname)).toHaveValue(
      'Updated Advertisement',
    );

    fireEvent.change(screen.getByLabelText(translations.Rtype), {
      target: { value: 'banner' },
    });
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

    fireEvent.click(screen.getByTestId('addonregister'));

    expect(createAdByIdMock).toHaveBeenCalledWith({
      variables: {
        organizationId: '1',
        name: 'Updated Advertisement',
        attachments: [],
        type: 'banner',
        startAt: dayjs(new Date('2023-01-01')).toISOString(),
        endAt: dayjs(new Date('2023-02-01')).toISOString(),
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
          query: DELETE_ADVERTISEMENT_BY_ID,
          variables: {
            input: {
              id: '1',
            },
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
                  endAt={new Date()}
                  startAt={new Date()}
                  id="1"
                  key={1}
                  attachmentUrl="data:videos"
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
          input: {
            id: '1',
          },
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
          input: {
            id: '1',
          },
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
  it('should display an error and prevent submission when start date is after end date', async () => {
    // Render AdvertisementRegister component to test date range validation
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister setAfter={vi.fn()} formStatus="register" />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    // Simulate filling in the form with an invalid date range: start date is later than end date.
    fireEvent.click(screen.getByTestId('createAdvertisement'));
    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Invalid Date Range Ad' },
    });
    fireEvent.change(screen.getByLabelText(translations.Rtype), {
      target: { value: 'banner' },
    });
    fireEvent.change(screen.getByLabelText(translations.RstartDate), {
      target: { value: '2023-02-01' }, // Start date (later)
    });
    fireEvent.change(screen.getByLabelText(translations.RendDate), {
      target: { value: '2023-01-01' }, // End date (earlier)
    });

    // Attempt to submit the form.
    fireEvent.click(screen.getByTestId('addonregister'));

    // Wait for and assert that an error message is shown.
    // Adjust the expected text to match your component's implementation.
    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining(translations.endAtGreaterOrEqual),
    );

    // Optionally, verify that the mutation or submission is not triggered.
  });

  it('should allow submission when the date range is valid', async () => {
    // Render AdvertisementRegister component for a valid date range scenario
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementRegister setAfter={vi.fn()} formStatus="register" />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    // Simulate filling in the form with a valid date range: start date is before end date.
    fireEvent.click(screen.getByTestId('createAdvertisement'));
    fireEvent.change(screen.getByLabelText(translations.Rname), {
      target: { value: 'Valid Date Range Ad' },
    });
    fireEvent.change(screen.getByLabelText(translations.Rtype), {
      target: { value: 'banner' },
    });
    fireEvent.change(screen.getByLabelText(translations.RstartDate), {
      target: { value: '2023-01-01' }, // Start date (earlier)
    });
    fireEvent.change(screen.getByLabelText(translations.RendDate), {
      target: { value: '2023-02-01' }, // End date (later)
    });

    // Submit the form.
    fireEvent.click(screen.getByTestId('addonregister'));

    // Confirm that no error message is displayed.
    await waitFor(() => {
      expect(screen.queryByText(/invalid date range/i)).toBeNull();
    });
  });
});
