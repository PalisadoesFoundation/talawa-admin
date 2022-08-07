import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import { store } from 'state/store';
import PageNotFound from './PageNotFound';
import i18nForTest from 'utils/i18nForTest';

describe('Testing Page not found component', () => {
  test('Component should be rendered properly', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <PageNotFound />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Talawa Admin/i)).toBeTruthy();
    expect(screen.getByText(/404/i)).toBeTruthy();
    expect(
      screen.getByText(/Oops! The Page you requested was not found!/i)
    ).toBeTruthy();
    expect(screen.getByText(/Back to Home/i)).toBeTruthy();
  });
});
