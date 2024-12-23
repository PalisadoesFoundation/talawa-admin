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
const { setItem } = useLocalStorage();

describe('Testing Page not found component', () => {
  it('should render component properly for User', () => {
    //setItem('AdminFor', undefined);
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <PageNotFound />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
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
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <PageNotFound />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Talawa Admin Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Oops! The Page you requested was not found!/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Back to Home/i)).toBeInTheDocument();
  });
});
