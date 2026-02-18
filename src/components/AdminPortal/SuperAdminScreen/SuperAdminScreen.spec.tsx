/* global HTMLElement */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import SuperAdminScreen from './SuperAdminScreen';
import { describe, test, expect, vi } from 'vitest';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './SuperAdminScreen.module.css';
const { clearAllItems } = useLocalStorage();

// Mock LeftDrawer to prevent router-related errors from NavLink, useLocation, etc.
vi.mock('components/AdminPortal/LeftDrawer/LeftDrawer', () => ({
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
  window.dispatchEvent(new Event('resize'));
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

    // Get initial state
    const initialHasCollapsed = leftDrawerContainer.classList.contains(
      styles.collapsedDrawer,
    );

    // Resize window to a smaller width
    resizeWindow(800);

    // Wait for the component to update
    await waitFor(() => {
      const hasCollapsed = leftDrawerContainer.classList.contains(
        styles.collapsedDrawer,
      );
      // The class should toggle from its initial state
      expect(hasCollapsed).toBe(!initialHasCollapsed);
    });
  });
});

describe('SuperAdminScreen title mapping', () => {
  const titleCases = [
    { path: '/admin/orglist', keyPrefix: 'orgList' },
    { path: '/admin/requests', keyPrefix: 'requests' },
    { path: '/admin/users', keyPrefix: 'users' },
    { path: '/admin/member/123', keyPrefix: 'memberDetail' },
    { path: '/admin/profile', keyPrefix: 'adminProfile' },
    { path: '/admin/communityProfile', keyPrefix: 'communityProfile' },
    { path: '/admin/pluginstore', keyPrefix: 'pluginStore' },
    { path: '/admin/notification', keyPrefix: 'notification' },
  ];

  const renderWithPath = (path: string): void => {
    render(
      <MockedProvider>
        <MemoryRouter initialEntries={[path]}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <SuperAdminScreen />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
  };

  test.each(titleCases)('renders title for $path', ({ path, keyPrefix }) => {
    renderWithPath(path);
    const translations = i18nForTest.getDataByLanguage('en')?.translation as
      | Record<string, { title?: string }>
      | undefined;
    const expectedTitle = translations?.[keyPrefix]?.title ?? 'title';

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectedTitle,
    );
  });
});
