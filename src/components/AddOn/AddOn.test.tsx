import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { store } from 'state/store';
import AddOn from './AddOn';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
const link = new StaticMockLink([], true);
describe('Testing Addon component', () => {
  const props = {
    children: 'This is a dummy text',
  };

  test('should render props and text elements test for the page component', () => {
    const { getByTestId, getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <AddOn {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(getByTestId('pluginContainer')).toBeInTheDocument();
    expect(getByText(props.children)).toBeInTheDocument();
  });
});
