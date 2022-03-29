import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from 'state/store';
import AddOn from './AddOn';

describe('Testing Addon', () => {
  test('should render props and text elements test for the page component', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Provider store={store}>
          <AddOn />
        </Provider>
      </BrowserRouter>
    );

    expect(getByTestId('pluginContainer')).toBeInTheDocument();
  });
});
