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
import { describe, test, expect, vi } from 'vitest';
import useLocalStorage from 'utils/useLocalstorage';
import styles from 'style/app-fixed.module.css';
const { clearAllItems } = useLocalStorage();

// Mock LeftDrawer to prevent router-related errors from NavLink, useLocation, etc.
vi.mock('components/LeftDrawer/LeftDrawer', () => ({
  default: vi.fn(({ hideDrawer }: { hideDrawer: boolean }) => (
    <div
      data-testid="leftDrawerContainer"
      className={hideDrawer ? styles.collapsedDrawer : styles.expandedDrawer}
    >
      <span>Admin Menu</span>
    </div>
  )),
}));

// Mock SignOut component to prevent useNavigate() error from Router context
vi.mock('components/SignOut/SignOut', () => ({
  default: vi.fn(() => (
    <button data-testid="signOutBtn" type="button">
      Sign Out
    </button>
  )),
}));

// Mock useSession to prevent router hook errors
vi.mock('utils/useSession', () => ({
  default: vi.fn(() => ({
    endSession: vi.fn(),
    startSession: vi.fn(),
    handleLogout: vi.fn(),
    extendSession: vi.fn(),
  })),
}));

// Mock ProfileCard component to prevent useNavigate() error from Router context
vi.mock('components/ProfileCard/ProfileCard', () => ({
  default: vi.fn(() => (
    <div data-testid="profile-dropdown">
      <div data-testid="display-name">Test User</div>
    </div>
  )),
}));

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new window.Event('resize'));
};

describe('Testing LeftDrawer in SuperAdminScreen', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    const { setItem } = useLocalStorage();
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
