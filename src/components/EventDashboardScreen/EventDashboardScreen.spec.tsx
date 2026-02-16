import React, { act } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import EventDashboardScreen from './EventDashboardScreen';
import { StaticMockLink } from 'utils/StaticMockLink';
import useLocalStorage from 'utils/useLocalstorage';
import { MOCKS } from './EventDashboardScreenMocks';
import userEvent from '@testing-library/user-event';

const { setItem } = useLocalStorage();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

let mockID: string | undefined = '123';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: mockID }),
    useLocation: () => ({
      pathname: mockID
        ? `/admin/orgdash/${mockID}`
        : '/admin/orgdash/undefined',
    }),
  };
});

// Mock LeftDrawerOrg to prevent router-related errors from NavLink, useLocation, etc.
vi.mock('components/LeftDrawerOrg/LeftDrawerOrg', () => ({
  default: vi.fn(({ hideDrawer }: { hideDrawer: boolean }) => (
    <div data-testid="leftDrawerContainer" data-hide-drawer={hideDrawer}>
      <span>Organization Menu</span>
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

// Mock ProfileDropdown component to prevent useNavigate() error from Router context
vi.mock('components/ProfileDropdown/ProfileDropdown', () => ({
  default: vi.fn(() => (
    <div data-testid="profile-dropdown-admin">
      <div data-testid="display-name">Admin User</div>
    </div>
  )),
}));

const link = new StaticMockLink(MOCKS, true);
const user = userEvent.setup();
const resizeWindow = (width: number): void => {
  act(() => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
  });
};

const clickToggleMenuBtn = async (toggleButton: HTMLElement): Promise<void> => {
  await user.click(toggleButton);
};

describe('EventDashboardScreen Component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('does not render main content when orgId is undefined', async () => {
    mockID = undefined;
    setItem('IsLoggedIn', 'true');

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/orgdash/undefined']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Component should not render the main page container
    expect(screen.queryByTestId('mainpageright')).not.toBeInTheDocument();
    mockID = '123';
  });

  it('does not render main content when IsLoggedIn is false', async () => {
    setItem('IsLoggedIn', 'false');

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/orgdash/123']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.queryByTestId('mainpageright')).not.toBeInTheDocument();
  });

  it('renders correctly when AdminFor is null', async () => {
    setItem('IsLoggedIn', 'true');
    setItem('AdminFor', null);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/orgdash/123']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders and toggles drawer states correctly', async () => {
    setItem('IsLoggedIn', 'true');
    setItem('AdminFor', [{ _id: '1', __typename: 'Organization' }]);
    setItem('sidebar', false);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/orgdash/123']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <EventDashboardScreen />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    const toggleButton = await screen.findByTestId('toggleMenuBtn');
    const mainPage = await screen.findByTestId('mainpageright');

    const initialClass = mainPage.className;

    // Resize window to trigger hideDrawer true
    resizeWindow(800);
    await clickToggleMenuBtn(toggleButton);

    const afterFirstToggle = mainPage.className;
    expect(afterFirstToggle).not.toBe(initialClass);
    expect(afterFirstToggle).toMatch(/expand|contract/);

    // Resize back
    resizeWindow(1200);
    await clickToggleMenuBtn(toggleButton);

    const afterSecondToggle = mainPage.className;
    expect(afterSecondToggle).not.toBe(afterFirstToggle);
    expect(afterSecondToggle).toMatch(/expand|contract/);

    // Resize back to default
    resizeWindow(1024);
  });
});
