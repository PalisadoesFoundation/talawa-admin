/* global HTMLElement */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import SuperAdminScreen from './SuperAdminScreen';
import { describe, test, expect } from 'vitest';
import useLocalStorage from 'utils/useLocalstorage';
import styles from 'style/app-fixed.module.css';
const { setItem, clearAllItems } = useLocalStorage();

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new window.Event('resize'));
};

describe('Testing LeftDrawer in SuperAdminScreen', () => {
  beforeAll(() => {
    setItem('name', 'John Doe');
  });
  afterAll(() => {
    clearAllItems();
  });
  test('Testing LeftDrawer in page functionality', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <SuperAdminScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const leftDrawerContainer = screen.getByTestId(
      'leftDrawerContainer',
    ) as HTMLElement;
    // const icon = toggleButton.querySelector('i');

    // Resize window to a smaller width
    resizeWindow(800);
    // clickToggleMenuBtn(toggleButton);
    expect(leftDrawerContainer).toHaveClass(styles.collapsedDrawer);

    // clickToggleMenuBtn(toggleButton);
    // expect(icon).toHaveClass('fa fa-angle-double-left');
  });
});
