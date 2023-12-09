import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DELETE_ADVERTISEMENT_BY_ID } from 'GraphQl/Mutations/mutations';
import { MockedProvider } from '@apollo/client/testing';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { StaticMockLink } from 'utils/StaticMockLink';
import type { NormalizedCacheObject } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import AdvertisementEntry from './AdvertisementEntry';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BACKEND_URL } from 'Constant/constant';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { act } from 'react-dom/test-utils';

const advertisementProps = {
  id: '1',
  name: 'Sample Advertisement',
  type: 'Sample Type',
  orgId: 'org_id',
  link: 'samplelink.com',
  endDate: new Date(),
  startDate: new Date(),
};
const mocks = [
  {
    request: {
      query: DELETE_ADVERTISEMENT_BY_ID,
      variables: { id: advertisementProps.id },
    },
    result: {
      data: {
        deleteAdvertisement: {
          id: advertisementProps.id,
        },
      },
    },
  },
];

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
const link = new StaticMockLink(mocks, true);
async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token') || '',
  },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});
describe('Testing Advertisement Entry Component', () => {
  test('Temporary test for Advertisement Entry', () => {
    const { getByTestId, getAllByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {
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
              }
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    expect(getByTestId('AdEntry')).toBeInTheDocument();
    expect(getAllByText('POPUP')[0]).toBeInTheDocument();
    expect(getAllByText('Advert1')[0]).toBeInTheDocument();
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
  test('should delete an advertisement when delete button is clicked', async () => {
    const { getByTestId, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false} link={link}>
        <AdvertisementEntry {...advertisementProps} />
      </MockedProvider>
    );
    wait();
    const deleteButton = getByTestId('deletebtn');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      const deletedAdName = queryByText(advertisementProps.name);
      expect(deletedAdName).toBeNull();
    });
  });
});
