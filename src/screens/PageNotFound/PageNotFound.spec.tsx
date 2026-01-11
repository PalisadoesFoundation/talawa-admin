import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';

import { store } from 'state/store';
import PageNotFound from './PageNotFound';
import i18nForTest from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import { it, expect, describe, afterEach } from 'vitest';

const { setItem, clearAllItems } = useLocalStorage();

describe('Testing Page not found component', () => {
  afterEach(() => {
    clearAllItems();
  });
  it('should render component properly for User', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <PageNotFound />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Oops! The Page you requested was not found!/i),
    ).toBeInTheDocument();
  });

  it('should render properly for ADMIN or SUPERADMIN', () => {
    setItem('AdminFor', [
      {
        _id: '6537904485008f171cf29924',
        __typename: 'Organization',
      },
    ]);
    setItem('role', 'administrator');
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <PageNotFound />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Oops! The Page you requested was not found!/i),
    ).toBeInTheDocument();
  });
});
