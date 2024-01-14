import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

    // Resize window to trigger handleResize
    window.innerWidth = 800; // Set a width less than or equal to 820
    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('openMenu') as HTMLElement);
    });

    // sets hideDrawer to true
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('menuBtn') as HTMLElement);
    });

    // Resize window back to a larger width
    window.innerWidth = 1000; // Set a larger width
    fireEvent(window, new Event('resize'));

    // sets hideDrawer to false
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('openMenu') as HTMLElement);
    });

    // sets hideDrawer to true
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('menuBtn') as HTMLElement);
    });
  });
});
