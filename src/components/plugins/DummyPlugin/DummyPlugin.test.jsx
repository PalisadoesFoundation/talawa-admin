import { MockedProvider } from '@apollo/react-testing';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import { store } from 'state/store';
import DummyPlugin from './DummyPlugin';
import i18nForTest from 'utils/i18nForTest';

describe('Testing dummy plugin', () => {
  test('should render props and text elements test for the page component', () => {
    const { getByText } = render(
      <MockedProvider>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <DummyPlugin />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(getByText(/Welcome to the Dummy Plugin!/i)).toBeInTheDocument();
  });
});
