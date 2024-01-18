import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { store } from 'state/store';
import Action from './Action';

describe('Testing Action Component', () => {
  const props = {
    children: 'dummy children',
    label: 'dummy label',
  };

  test('should render props and text elements test for the page component', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Action {...props} />
      </Provider>
    );

    expect(getByText(props.label)).toBeInTheDocument();
    expect(getByText(props.children)).toBeInTheDocument();
  });
});
