import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen } from '@testing-library/react';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceSuperAdminScreenProps } from './SuperAdminScreen';
import SuperAdminScreen from './SuperAdminScreen';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

const props: InterfaceSuperAdminScreenProps = {
  title: 'Organizations',
  screenName: 'Organizations',
  children: <div>Testing ...</div>,
};

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new Event('resize'));
};

const clickToggleMenuBtn = (toggleButton: HTMLElement): void => {
  fireEvent.click(toggleButton);
};

describe('Testing LeftDrawer in SuperAdminScreen', () => {
  test('Testing LeftDrawer in page functionality', async () => {
    setItem('UserType', 'SUPERADMIN');

    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <SuperAdminScreen {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const toggleButton = screen.getByTestId('toggleMenuBtn') as HTMLElement;
    const icon = toggleButton.querySelector('i');

    // Resize window to a smaller width
    resizeWindow(800);
    clickToggleMenuBtn(toggleButton);
    expect(icon).toHaveClass('fa fa-angle-double-right');

    // Resize window back to a larger width
    resizeWindow(1000);
    clickToggleMenuBtn(toggleButton);
    expect(icon).toHaveClass('fa fa-angle-double-left');

    clickToggleMenuBtn(toggleButton);
    expect(icon).toHaveClass('fa fa-angle-double-right');
  });
});
