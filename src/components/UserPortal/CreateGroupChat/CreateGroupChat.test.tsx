import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import type { ApolloQueryResult, NormalizedCacheObject } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import CreateGroupChat from './CreateGroupChat';
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

const mockUseMutation = jest.fn();
jest.mock('@apollo/client', () => {
  const originalModule = jest.requireActual('@apollo/client');
  return {
    ...originalModule,
    useMutation: () => mockUseMutation(),
  };
});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: '1' }),
}));

describe('Testing Advertisement Entry Component', () => {
  test('Testing rendering and deleting of advertisement', async () => {
    const deleteAdByIdMock = jest.fn();
    mockUseMutation.mockReturnValue([deleteAdByIdMock]);
    const { getByTestId, getAllByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <CreateGroupChat
                toggleCreateGroupChatModal={jest.fn()}
                createGroupChatModalisOpen={false}
                groupChatListRefetch={jest.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    //Testing rendering
  });
});
