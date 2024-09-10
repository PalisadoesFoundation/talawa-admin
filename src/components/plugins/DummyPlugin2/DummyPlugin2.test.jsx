import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import DummyPlugin2 from './DummyPlugin2';

describe('Testing DummyPlugin2', () => {
  test('should render DummyPlugin2 component', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <DummyPlugin2 />
        </Provider>
      </BrowserRouter>,
    );
  });
});
