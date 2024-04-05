<<<<<<< HEAD
import React from 'react';
=======
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-filename-extension */
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import DummyPlugin2 from './DummyPlugin2';

describe('Testing dummy plugin 2', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <DummyPlugin2 />
        </Provider>
      </BrowserRouter>
    );
  });
});
