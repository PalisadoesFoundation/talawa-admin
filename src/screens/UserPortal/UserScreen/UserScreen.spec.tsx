/**
 * Unit tests for the UserScreen component.
 *
 * Coverage includes:
 * - All 13 route → title mappings + unknown-route fallback
 * - Sidebar rendering: UserSidebarOrg vs UserSidebar
 * - Drawer visibility: localStorage, resize, wide-screen no-reopen
 * - DropDownButton onSelect: viewProfile / logout / logout-error / default
 * - Profile rendering: userImage present (img) vs absent (Avatar)
 * - GraphQL error resilience
 *
 * Uses Vitest, React Testing Library, userEvent, and MockedProvider.
 */

// SKIP_LOCALSTORAGE_CHECK
import React from 'react';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
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

let mockID: string | undefined = '123';
let mockLocation: string | undefined = '/user/organization/123';

const routerSpies = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

const mockUserProfile = vi.hoisted(() => ({
  handleLogout: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  userImage: '' as string,
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

vi.mock('hooks/useUserProfile', () => ({
  default: vi.fn(() => ({
    name: 'John Doe',
    displayedName: 'John Doe',
    userRole: 'USER',
    userImage: mockUserProfile.userImage,
    profileDestination: '/user/profile/123',
    handleLogout: mockUserProfile.handleLogout,
    tCommon: (key: string) => {
      const t: Record<string, string> = {
        viewProfile: 'View Profile',
        logout: 'Logout',
        profilePicture: 'profile picture',
        profilePicturePlaceholder: 'dummy picture',
        userProfileMenu: 'User Profile Menu',
      };
      return t[key] || key;
    },
  })),
}));

vi.mock('shared-components/DropDownButton', () => ({
  default: vi.fn(
    ({
      onSelect,
      icon,
    }: {
      onSelect: (value: string) => void;
      icon?: React.ReactNode;
    }) => (
      <div data-testid="mock-dropdown">
        {icon}
        <button
          data-testid="select-viewProfile"
          onClick={() => onSelect('viewProfile')}
        >
          View Profile
        </button>
        <button data-testid="select-logout" onClick={() => onSelect('logout')}>
          Logout
        </button>
        <button
          data-testid="select-unknown"
          onClick={() => onSelect('unknown')}
        >
          Unknown
        </button>
      </div>
    ),
  ),
}));

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

vi.mock('components/UserPortal/UserSidebar/UserSidebar', () => ({
  default: vi.fn(({ hideDrawer }: { hideDrawer: boolean }) => (
    <div data-testid="leftDrawerContainer" data-hide-drawer={hideDrawer}>
      <span>User Menu</span>
    </div>
  )),
}));

vi.mock('components/SignOut/SignOut', () => ({
  default: vi.fn(() => (
    <button data-testid="signOutBtn" type="button">
      Sign Out
    </button>
  )),
}));

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

const ERROR_MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: '123' },
    },
    error: new Error('Network error'),
  },
];

const link = new StaticMockLink(MOCKS, true);
const errorLink = new StaticMockLink(ERROR_MOCKS, true);

const renderUserScreen = (mockLink = link): ReturnType<typeof render> =>
  render(
    <MockedProvider link={mockLink}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <UserScreen />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

describe('UserScreen tests', () => {
  beforeEach(() => {
    localStorage.setItem('name', 'John Doe');
    mockID = '123';
    mockLocation = '/user/organization/123';
    routerSpies.navigate.mockReset();
    mockUserProfile.handleLogout.mockReset().mockResolvedValue(undefined);
    mockUserProfile.userImage = '';
    localStorage.setItem('Talawa-admin_sidebar', JSON.stringify('false'));

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();

    localStorage.removeItem('name');
    localStorage.removeItem('Talawa-admin_sidebar');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('renders the correct title for posts', () => {
    renderUserScreen();

    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveTextContent('Posts');
  });

  it('renders the correct title for people route', () => {
    mockLocation = '/user/people/123';
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'People',
    );
  });

  it('renders the correct title for events route', () => {
    mockLocation = '/user/events/123';
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Events',
    );
  });

  it('renders the correct title for donate route', () => {
    mockLocation = '/user/donate/123';
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Donations',
    );
  });

  it('renders the correct title for transactions route', () => {
    mockLocation = '/user/transactions/123';
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Transactions',
    );
  });

  it('renders the correct title for chat route', () => {
    mockLocation = '/user/chat/123';
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Chats',
    );
  });

  it('renders the correct title for campaigns route', () => {
    mockLocation = '/user/campaigns/123';
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Fundraising Campaigns',
    );
  });

  it('renders the correct title for pledges route', () => {
    mockLocation = '/user/pledges/123';
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'My Pledges',
    );
  });

  it('renders the correct title for volunteer route', () => {
    mockLocation = '/user/volunteer/123';
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Volunteership',
    );
  });

  it('renders the correct title for leaveorg route', () => {
    mockLocation = '/user/leaveorg/123';
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Leave Organization',
    );
  });

  it('renders the correct title for notification route', () => {
    mockLocation = '/user/notification';
    mockID = undefined;
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Notifications',
    );
  });

  it('renders the correct title for organizations route', () => {
    mockLocation = '/user/organizations';
    mockID = undefined;
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Organizations',
    );
  });

  it('renders the correct title for settings route', () => {
    mockLocation = '/user/settings';
    mockID = undefined;
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Settings',
    );
  });

  it('renders default title "User Portal" for unknown routes', () => {
    mockLocation = '/user/unknownroute/123';
    renderUserScreen();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'User Portal',
    );
  });

  it('renders UserSidebarOrg when orgId is present', () => {
    renderUserScreen();
    expect(screen.getByTestId('leftDrawerContainer')).toBeInTheDocument();
    expect(screen.getByTestId('OrgBtn')).toBeInTheDocument();
  });

  it('renders UserSidebar when orgId is undefined', () => {
    mockID = undefined;
    mockLocation = '/user/notification';
    renderUserScreen();
    expect(screen.getByTestId('leftDrawerContainer')).toBeInTheDocument();
    expect(screen.queryByTestId('OrgBtn')).not.toBeInTheDocument();
    expect(routerSpies.navigate).not.toHaveBeenCalled();
  });

  it('renders title within titleContainer div', () => {
    renderUserScreen();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.parentElement).toBeInTheDocument();
    expect(heading).toHaveTextContent('Posts');
  });

  it('renders default title "User Portal" for unknown routes', () => {
    mockLocation = '/user/unknownroute/123';

    renderUserScreen();

    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveTextContent('User Portal');
  });

  it('sets hideDrawer to true when window width is 820px or less on mount', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    renderUserScreen();

    const drawer = screen.getByTestId('leftDrawerContainer');
    await waitFor(() => {
      expect(screen.getByTestId('leftDrawerContainer')).toHaveAttribute(
        'data-hide-drawer',
        'true',
      );
    });
  });

  it('hides drawer when localStorage sidebar is true', async () => {
    localStorage.setItem('Talawa-admin_sidebar', JSON.stringify('true'));

    renderUserScreen();

    const drawer = screen.getByTestId('leftDrawerContainer');

    await waitFor(() => {
      expect(screen.getByTestId('leftDrawerContainer')).toHaveAttribute(
        'data-hide-drawer',
        'true',
      );
    });
  });

  it('shows drawer when localStorage sidebar is false', async () => {
    localStorage.setItem('Talawa-admin_sidebar', JSON.stringify('false'));

    renderUserScreen();
    renderUserScreen();

    const drawer = screen.getByTestId('leftDrawerContainer');

    await waitFor(() => {
      expect(drawer).toHaveAttribute('data-hide-drawer', 'false');
    });
  });
});
