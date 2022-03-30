import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from 'state/store';
import AddOn from './AddOn';

describe('Testing Addon component', () => {
  const props = {
    children: 'This is a dummy text',
  };

  test('should render props and text elements test for the page component', () => {
    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <AddOn {...props} />
        </Provider>
      </BrowserRouter>
    );

    expect(getByTestId('pluginContainer')).toBeInTheDocument();
    expect(getByText(props.children)).toBeInTheDocument();
  });
});
