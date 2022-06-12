import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from 'state/store';
import PageNotFound from './PageNotFound';

describe('Testing Page not found component', () => {
  test('Component should be rendered properly', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <PageNotFound />
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
