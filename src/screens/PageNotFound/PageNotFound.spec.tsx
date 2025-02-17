import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import PageNotFound from './PageNotFound';
import i18nForTest from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import { it, expect, describe } from 'vitest';
import type { NormalizedCacheObject } from '@apollo/client';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  Observable,
} from '@apollo/client';

const { setItem } = useLocalStorage();

const link = new ApolloLink((operation, forward) => {
  if (operation.operationName === 'VERIFY_ROLE') {
    return new Observable((observer) => {
      observer.next({
        data: {
          verifyRole: {
            isAuthorized: true,
            role: 'ADMIN',
          },
        },
      });
      observer.complete();
    });
  }
  if (!forward) {
    console.warn('Last test link: Apollo link ended with last link');
  }
  return forward
    ? forward(operation)
    : new Observable((subscribe) => {
        subscribe.next({ data: {} });
        subscribe.complete();
      });
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

describe('Testing Page not found component', () => {
  it('should render component properly for User', () => {
    render(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PageNotFound />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </ApolloProvider>,
    );

    expect(screen.getByText(/Talawa User/i)).toBeInTheDocument();
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Oops! The Page you requested was not found!/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Back to Home/i)).toBeInTheDocument();
  });

  it('should render properly for ADMIN or SUPERADMIN', () => {
    setItem('AdminFor', [
      {
        _id: '6537904485008f171cf29924',
        __typename: 'Organization',
      },
    ]);
    render(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PageNotFound />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </ApolloProvider>,
    );

    expect(screen.getByText(/Talawa Admin Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Oops! The Page you requested was not found!/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Back to Home/i)).toBeInTheDocument();
  });
});
