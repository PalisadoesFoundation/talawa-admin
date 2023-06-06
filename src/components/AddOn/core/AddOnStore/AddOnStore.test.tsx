import React from 'react';
import { render } from '@testing-library/react';
// import * as reactRedux from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';

// import AddOnStore from './AddOnStore';
// import { store } from 'state/store';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';

import type { NormalizedCacheObject } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import AddOnStore from './AddOnStore';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BACKEND_URL } from 'Constant/constant';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';

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
describe('Testing AddOnStore Component', () => {
  test('Temporary test for AddOnStore', () => {
    expect(true).toBe(true);
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<AddOnStore />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    expect(getByTestId('AddOnEntryStore')).toBeInTheDocument();
  });
  // const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  // const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

  // beforeEach(() => {
  //   useSelectorMock.mockClear();
  //   useDispatchMock.mockClear();
  // });
});
