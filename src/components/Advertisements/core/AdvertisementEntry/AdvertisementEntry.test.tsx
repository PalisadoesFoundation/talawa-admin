import React from 'react';
import { DELETE_ADVERTISEMENT_BY_ID } from 'GraphQl/Mutations/mutations';
import { MockedProvider } from '@apollo/client/testing';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
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
import { ADVERTISEMENTS_GET } from 'GraphQl/Queries/Queries';

const advertisementProps = {
  id: '1',
  name: 'Sample Advertisement',
  type: 'Sample Type',
  orgId: 'org_id',
  link: 'test.png',
  endDate: new Date(),
  startDate: new Date(),
};
const mocks = [
  {
    request: {
      query: DELETE_ADVERTISEMENT_BY_ID,
      variables: { id: '1' },
    },
    result: {
      data: {
        deleteAdvertisementById: {
          success: true,
        },
      },
    },
  },
  {
    request: {
      query: ADVERTISEMENTS_GET,
    },
    result: {
      data: {
        getAdvertisements: [
          {
            _id: '6574cf9caa18987e28d248d9',
            name: 'Cookie',
            orgId: '6437904485008f171cf29924',
            link: '123',
            type: 'BANNER',
            startDate: '2023-12-10',
            endDate: '2023-12-10',
          },
          {
            _id: '6574e38aaa18987e28d24979',
            name: 'HEy',
            orgId: '6437904485008f171cf29924',
            link: '123',
            type: 'BANNER',
            startDate: '2023-12-10',
            endDate: '2023-12-10',
          },
        ],
      },
    },
  },
];

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

const mockUseMutation = jest.fn();
jest.mock('@apollo/client', () => {
  const originalModule = jest.requireActual('@apollo/client');
  return {
    ...originalModule,
    useMutation: () => mockUseMutation(),
  };
});

describe('Testing Advertisement Entry Component', () => {
  test('Temporary test for Advertisement Entry', async () => {
    const deleteAdByIdMock = jest.fn();
    mockUseMutation.mockReturnValue([deleteAdByIdMock]);
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
                  link="test.png"
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

    fireEvent.click(getByTestId('moreiconbtn'));
    fireEvent.click(getByTestId('deletebtn'));

    await waitFor(() => {
      expect(screen.getByTestId('delete_title')).toBeInTheDocument();
      expect(screen.getByTestId('delete_body')).toBeInTheDocument();
    });

    fireEvent.click(getByTestId('AddOnEntry_btn_install'));

    fireEvent.click(getByTestId('AddOnEntry_btn_install'));

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

    fireEvent.click(getByTestId('AddOnEntry_btn_install'));

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
                link="test.png"
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
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <MockedProvider mocks={mocks} addTypename={false} link={link}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18nForTest}>
                <AdvertisementEntry {...advertisementProps} />
              </I18nextProvider>
            </BrowserRouter>
          </Provider>
        </MockedProvider>
      </ApolloProvider>
    );
    await wait();
    await waitFor(() => {
      const optionsButton = getByTestId('moreiconbtn');
      fireEvent.click(optionsButton);
      const deleteButton = getByTestId('deletebtn');
      fireEvent.click(deleteButton);
    });
  });
});
