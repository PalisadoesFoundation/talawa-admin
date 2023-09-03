import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceOrganizationScreenProps } from './OrganizationScreen';
import OrganizationScreen from './OrganizationScreen';

const props: InterfaceOrganizationScreenProps = {
  title: 'Dashboard',
  screenName: 'Dashboard',
  children: <div>Testing ...</div>,
};

describe('Testing LeftDrawer in OrganizationScreen', () => {
  test('Testing LeftDrawer in page functionality', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');

    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationScreen {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    // sets hideDrawer to true
    userEvent.click(screen.getByTestId('menuBtn'));
    // sets hideDrawer to false
    userEvent.click(screen.getByTestId('menuBtn'));
  });
});
