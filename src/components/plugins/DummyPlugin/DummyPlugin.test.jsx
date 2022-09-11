import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import DummyPlugin from './DummyPlugin';

describe('Testing dummy plugin', () => {
  test('should render props and text elements test for the page component', () => {
    const { getByText } = render(
      <MockedProvider>
        <BrowserRouter>
          <Provider store={store}>
            <DummyPlugin />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(getByText(/Welcome to the Dummy Plugin!/i)).toBeInTheDocument();
  });
});
