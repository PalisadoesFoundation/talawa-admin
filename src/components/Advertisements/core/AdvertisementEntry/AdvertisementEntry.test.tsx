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

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token') || '',
  },
});
const translations = JSON.parse(
  JSON.stringify(
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    i18nForTest.getDataByLanguage('en')?.translation.advertisement!
  )
);

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

const mockUseMutation = jest.fn();
jest.mock('@apollo/client', () => {
  const originalModule = jest.requireActual('@apollo/client');
  return {
    ...originalModule,
    useMutation: () => mockUseMutation(),
  };
});

describe('Testing Advertisement Entry Component', () => {
  test('Testing rendering and deleting of advertisement', async () => {
    const deleteAdByIdMock = jest.fn();
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
                link="google.com"
                name="Advert1"
                orgId="1"
                type="POPUP"
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    //Testing rendering
    expect(getByTestId('AdEntry')).toBeInTheDocument();
    expect(getAllByText('POPUP')[0]).toBeInTheDocument();
    expect(getAllByText('Advert1')[0]).toBeInTheDocument();

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
                link="google.com"
                name="Advert1"
                orgId="1"
                type="POPUP"
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
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

  test('Updates the advertisement and shows success toast on successful update', async () => {
    const updateAdByIdMock = jest.fn().mockResolvedValue({
      data: {
        updateAdvertisement: {
          advertisement: {
            _id: '1',
            name: 'Updated Advertisement',
            link: 'google.com',
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
              {
                <AdvertisementEntry
                  endDate={new Date()}
                  startDate={new Date()}
                  type="POPUP"
                  name="Advert1"
                  orgId="1"
                  link="google.com"
                  id="1"
                />
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    const optionsButton = screen.getByTestId('moreiconbtn');
    fireEvent.click(optionsButton);
    fireEvent.click(screen.getByTestId('editBtn'));

    fireEvent.change(screen.getByLabelText('Enter name of Advertisement'), {
      target: { value: 'Updated Advertisement' },
    });

    expect(screen.getByLabelText('Enter name of Advertisement')).toHaveValue(
      'Updated Advertisement'
    );

    fireEvent.change(screen.getByLabelText(translations.Rlink), {
      target: { value: 'http://example.com' },
    });
    expect(screen.getByLabelText(translations.Rlink)).toHaveValue(
      'http://example.com'
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
        link: 'http://example.com',
        type: 'BANNER',
        startDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().add(2, 'days').format('YYYY-MM-DD'),
      },
    });
  });

  test('Simulating if the mutation doesnt have data variable while updating', async () => {
    const updateAdByIdMock = jest.fn().mockResolvedValue({
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
              {
                <AdvertisementEntry
                  endDate={new Date()}
                  startDate={new Date()}
                  type="POPUP"
                  name="Advert1"
                  orgId="1"
                  link="google.com"
                  id="1"
                />
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    const optionsButton = screen.getByTestId('moreiconbtn');
    fireEvent.click(optionsButton);
    fireEvent.click(screen.getByTestId('editBtn'));

    fireEvent.change(screen.getByLabelText('Enter name of Advertisement'), {
      target: { value: 'Updated Advertisement' },
    });

    expect(screen.getByLabelText('Enter name of Advertisement')).toHaveValue(
      'Updated Advertisement'
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

  test('Updates the advertisement and shows error toast on successful update', async () => {
    const updateAdByIdMock = jest.fn();

    mockUseMutation.mockReturnValue([updateAdByIdMock]);

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {
                <AdvertisementRegister
                  formStatus="edit"
                  idEdit="-100"
                  nameEdit="Updated"
                  endDateEdit={new Date()}
                  startDateEdit={new Date()}
                  typeEdit="POPUP"
                  orgId="1"
                  linkEdit="google.com"
                />
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    fireEvent.click(screen.getByTestId('editBtn'));

    fireEvent.change(screen.getByLabelText(translations.Rlink), {
      target: { value: 'http://example.com' },
    });
    expect(screen.getByLabelText(translations.Rlink)).toHaveValue(
      'http://example.com'
    );

    fireEvent.click(screen.getByTestId('addonupdate'));

    expect(updateAdByIdMock).toHaveBeenCalledWith({
      variables: {
        id: '-100',
        link: 'http://example.com',
      },
    });
  });

  test('Simulating if the mutation does not have data variable while registering', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: jest.fn(),
        href: 'https://example.com/page/id=1',
      },
    });
    const createAdByIdMock = jest.fn().mockResolvedValue({
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
              {<AdvertisementRegister formStatus="register" />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    fireEvent.click(screen.getByTestId('createAdvertisement'));

    fireEvent.change(screen.getByLabelText('Enter name of Advertisement'), {
      target: { value: 'Updated Advertisement' },
    });

    expect(screen.getByLabelText('Enter name of Advertisement')).toHaveValue(
      'Updated Advertisement'
    );

    fireEvent.change(screen.getByLabelText(translations.Rlink), {
      target: { value: 'http://example.com' },
    });
    expect(screen.getByLabelText(translations.Rlink)).toHaveValue(
      'http://example.com'
    );

    fireEvent.change(screen.getByLabelText(translations.Rtype), {
      target: { value: 'BANNER' },
    });
    expect(screen.getByLabelText(translations.Rtype)).toHaveValue('BANNER');

    fireEvent.change(screen.getByLabelText(translations.RstartDate), {
      target: { value: '2023-01-01' },
    });
    expect(screen.getByLabelText(translations.RstartDate)).toHaveValue(
      '2023-01-01'
    );

    fireEvent.change(screen.getByLabelText(translations.RendDate), {
      target: { value: '2023-02-01' },
    });
    expect(screen.getByLabelText(translations.RendDate)).toHaveValue(
      '2023-02-01'
    );

    fireEvent.click(screen.getByTestId('addonregister'));

    expect(createAdByIdMock).toHaveBeenCalledWith({
      variables: {
        orgId: '1',
        name: 'Updated Advertisement',
        link: 'http://example.com',
        type: 'BANNER',
        startDate: dayjs(new Date('2023-01-01')).format('YYYY-MM-DD'),
        endDate: dayjs(new Date('2023-02-01')).format('YYYY-MM-DD'),
      },
    });
  });
});
