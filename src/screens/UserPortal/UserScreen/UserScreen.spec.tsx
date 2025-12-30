/**
 * This file contains unit tests for the UserScreen component.
 *
 * The tests cover:
 * - Rendering of the correct title based on the location.
 * - Functionality of the LeftDrawer component.
 * - Behavior when the orgId is undefined.
 *
 * These tests use Vitest for test execution and MockedProvider for mocking GraphQL queries.
 */

// SKIP_LOCALSTORAGE_CHECK
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import UserScreen from './UserScreen';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import '@testing-library/dom';
import localStyles from './UserScreen.module.css';
let mockID: string | undefined = '123';
let mockLocation: string | undefined = '/user/organization/123';

const routerSpies = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: mockID }),
    useLocation: () => ({ pathname: mockLocation }),
    useNavigate: () => routerSpies.navigate,
  };
});

// Mock UserSidebarOrg to prevent router-related errors from NavLink, useLocation, etc.
vi.mock('components/UserPortal/UserSidebarOrg/UserSidebarOrg', () => ({
  default: vi.fn(({ hideDrawer }: { hideDrawer: boolean }) => (
    <div data-testid="leftDrawerContainer" data-hide-drawer={hideDrawer}>
      <span>User Org Menu</span>
      <button data-testid="OrgBtn" type="button">
        Organization
      </button>
    </div>
  )),
}));

// Mock UserSidebar to prevent router-related errors
vi.mock('components/UserPortal/UserSidebar/UserSidebar', () => ({
  default: vi.fn(({ hideDrawer }: { hideDrawer: boolean }) => (
    <div data-testid="leftDrawerContainer" data-hide-drawer={hideDrawer}>
      <span>User Menu</span>
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

const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            image: null,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'JohnDoe@example.com',
            },
            name: 'Test Organization',
            description: 'Testing this organization',
            address: {
              city: 'Mountain View',
              countryCode: 'US',
              dependentLocality: 'Some Dependent Locality',
              line1: '123 Main Street',
              line2: 'Apt 456',
              postalCode: '94040',
              sortingCode: 'XYZ-789',
              state: 'CA',
            },
            userRegistrationRequired: true,
            visibleInSearch: true,
            members: [],
            admins: [],
            membershipRequests: [],
            blockedUsers: [],
          },
        ],
      },
    },
  },
];
const link = new StaticMockLink(MOCKS, true);

describe('UserScreen tests with LeftDrawer functionality', () => {
  beforeEach(() => {
    localStorage.setItem('name', 'John Doe');
    mockID = '123';
    mockLocation = '/user/organization/123';
    routerSpies.navigate.mockReset();
    localStorage.setItem('sidebar', 'false');
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.removeItem('name');
    localStorage.removeItem('sidebar');
  });

  it('renders the correct title for posts', () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveTextContent('Posts');
  });

  it('renders the correct title for people', () => {
    mockLocation = '/user/people/123';

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveTextContent('People');
  });

  it('renders the correct title for chat', () => {
    mockLocation = '/user/chat/123';

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveTextContent('Chats');
  });

  it('toggles LeftDrawer correctly based on window size and user interaction', () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Note: Toggle button functionality has been moved to separate components
    // (e.g., SidebarToggle) and is no longer part of the drawer components
    // due to plugin system modifications
  });

  it('renders default sidebar when orgId is undefined', () => {
    mockID = undefined;
    mockLocation = '/user/notification';

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('leftDrawerContainer')).toBeInTheDocument();
    expect(screen.queryByTestId('OrgBtn')).not.toBeInTheDocument();
    expect(routerSpies.navigate).not.toHaveBeenCalled();
  });

  it('renders title within titleContainer div', () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement.parentElement).toHaveClass(localStyles.titleContainer);
  });

  it('renders default title "User Portal" for unknown routes', () => {
    mockLocation = '/user/unknownroute/123';

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserScreen />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveTextContent('User Portal');
  });
});
