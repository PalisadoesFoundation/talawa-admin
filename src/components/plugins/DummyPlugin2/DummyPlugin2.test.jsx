/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-filename-extension */
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
