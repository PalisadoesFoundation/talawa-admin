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
<<<<<<< HEAD
      </Provider>,
=======
      </Provider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    expect(getByText(props.label)).toBeInTheDocument();
    expect(getByText(props.children)).toBeInTheDocument();
  });
});
