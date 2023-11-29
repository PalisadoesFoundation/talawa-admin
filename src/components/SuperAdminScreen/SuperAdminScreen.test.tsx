import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceSuperAdminScreenProps } from './SuperAdminScreen';
import SuperAdminScreen from './SuperAdminScreen';

const props: InterfaceSuperAdminScreenProps = {
  title: 'Organizations',
  screenName: 'Organizations',
  children: <div>Testing ...</div>,
};

describe('Testing LeftDrawer in SuperAdminScreen', () => {
  test('Testing LeftDrawer in page functionality', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');

    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <SuperAdminScreen {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    // Expand LeftDrawer
    userEvent.click(screen.getByTestId('menuBtn'));
    // Contract LeftDrawer
    userEvent.click(screen.getByTestId('menuBtn'));
  });
});
