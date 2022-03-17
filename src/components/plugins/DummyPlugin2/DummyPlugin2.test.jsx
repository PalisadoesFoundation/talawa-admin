import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import DummyPlugin2 from './DummyPlugin2';

describe('Testing dummy plugin', () => {
  test('should render props and text elements test for the page component', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <DummyPlugin2 />
        </Provider>
      </BrowserRouter>
    );
  });
});
