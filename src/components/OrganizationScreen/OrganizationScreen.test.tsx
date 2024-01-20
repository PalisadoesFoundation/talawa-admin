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
import useLocalStorage from 'utils/useLocalStorage';

const { setItem } = useLocalStorage();

const props: InterfaceOrganizationScreenProps = {
  title: 'Dashboard',
  screenName: 'Dashboard',
  children: <div>Testing ...</div>,
};

type SetScreenSize = () => void;

describe('Testing LeftDrawer in OrganizationScreen', () => {
  const setTabletScreenSize: SetScreenSize = () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768, // Example: setting tablet width
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1024, // Example: setting tablet height
    });
    window.dispatchEvent(new Event('resize'));
  };
  test('Testing LeftDrawer in page functionality', async () => {
    setItem('UserType', 'SUPERADMIN');

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
    userEvent.click(screen.getByTestId('openMenu'));
  });

  test('Testing expanding and closing on a tablet-sized screen', async () => {
    setItem('UserType', 'SUPERADMIN');

    // Render the component with tablet-sized screen
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

    // Set the screen size to simulate a tablet
    setTabletScreenSize();

    // sets hideDrawer to true
    userEvent.click(screen.getByTestId('menuBtnmobile'));
    // sets hideDrawer to false
    userEvent.click(screen.getByTestId('closeModalBtn'));
  });
});
