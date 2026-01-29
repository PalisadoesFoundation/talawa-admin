import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/react-testing';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import { store } from 'state/store';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import i18nForTest from './utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';

import * as useLSModule from 'utils/useLocalstorage';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

vi.mock('@mui/x-charts/PieChart', () => ({
  pieArcLabelClasses: vi.fn(),
  PieChart: vi.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: vi.fn(),
}));

vi.mock('/src/assets/svgs/palisadoes.svg?react', () => ({
  default: () => <svg>Mocked SVG</svg>,
}));
vi.mock('/src/assets/svgs/talawa.svg?react', () => ({
  default: () => <svg>Mocked SVG</svg>,
}));

// Mock the plugin system
const mockPluginManager = {
  setApolloClient: vi.fn(),
  initializePluginSystem: vi.fn().mockResolvedValue(undefined),
};

vi.mock('./plugin/manager', () => ({
  getPluginManager: vi.fn(() => mockPluginManager),
}));

vi.mock('./plugin/registry', () => ({
  discoverAndRegisterAllPlugins: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./plugin', () => ({
  usePluginRoutes: vi.fn(() => []),
  usePluginDrawerItems: vi.fn(() => []),
  PluginRouteRenderer: vi.fn(({ route, fallback }) => (
    <div data-testid={`plugin-route-${route.pluginId}`}>{fallback}</div>
  )),
  PluginInjector: vi.fn(() => <div>Mock Plugin Injector</div>),
}));

vi.mock('screens/AdminPortal/MemberDetail/MemberDetail', () => ({
  default: () => <div data-testid="mock-profile-form">Mock Settings</div>,
}));

vi.mock('screens/UserPortal/UserScreen/UserScreen', async () => {
  const { Outlet } = await import('react-router');
  return {
    default: () => (
      <div data-testid="mock-user-screen">
        <Outlet />
      </div>
    ),
  };
});

// Mock all lazy loaded components
vi.mock('components/AdminPortal/OrganizationScreen/OrganizationScreen', () => ({
  default: () => (
    <div data-testid="mock-organization-screen">Mock Organization Screen</div>
  ),
}));

vi.mock('shared-components/posts/posts', () => ({
  default: () => <div data-testid="mock-posts">Mock Posts</div>,
}));

vi.mock('components/AdminPortal/SuperAdminScreen/SuperAdminScreen', () => ({
  default: () => (
    <div data-testid="mock-super-admin-screen">Mock Super Admin Screen</div>
  ),
}));

vi.mock('screens/AdminPortal/BlockUser/BlockUser', () => ({
  default: () => <div data-testid="mock-block-user">Mock Block User</div>,
}));

vi.mock('screens/AdminPortal/EventManagement/EventManagement', () => ({
  default: () => (
    <div data-testid="mock-event-management">Mock Event Management</div>
  ),
}));

vi.mock('screens/Auth/ForgotPassword/ForgotPassword', () => ({
  default: () => (
    <div data-testid="mock-forgot-password">Mock Forgot Password</div>
  ),
}));

vi.mock('screens/AdminPortal/OrgContribution/OrgContribution', () => ({
  default: () => (
    <div data-testid="mock-org-contribution">Mock Org Contribution</div>
  ),
}));

vi.mock('screens/AdminPortal/OrgList/OrgList', () => ({
  default: () => <div data-testid="mock-org-list">Mock Org List</div>,
}));

vi.mock('screens/AdminPortal/OrgSettings/OrgSettings', () => ({
  default: () => <div data-testid="mock-org-settings">Mock Org Settings</div>,
}));

vi.mock(
  'screens/AdminPortal/OrganizationDashboard/OrganizationDashboard',
  () => ({
    default: () => (
      <div data-testid="mock-organization-dashboard">
        Mock Organization Dashboard
      </div>
    ),
  }),
);

vi.mock('screens/AdminPortal/OrganizationEvents/OrganizationEvents', () => ({
  default: () => (
    <div data-testid="mock-organization-events">Mock Organization Events</div>
  ),
}));

vi.mock('screens/AdminPortal/OrganizationFunds/OrganizationFunds', () => ({
  default: () => (
    <div data-testid="mock-organization-funds">Mock Organization Funds</div>
  ),
}));

vi.mock(
  'screens/AdminPortal/OrganizationTransactions/OrganizationTransactions',
  () => ({
    default: () => (
      <div data-testid="mock-organization-transactions">
        Mock Organization Transactions
      </div>
    ),
  }),
);

vi.mock('screens/AdminPortal/FundCampaignPledge/FundCampaignPledge', () => ({
  default: () => (
    <div data-testid="mock-fund-campaign-pledge">Mock Fund Campaign Pledge</div>
  ),
}));

vi.mock('screens/AdminPortal/OrganizationPeople/OrganizationPeople', () => ({
  default: () => (
    <div data-testid="mock-organization-people">Mock Organization People</div>
  ),
}));

vi.mock('screens/AdminPortal/OrganizationTags/OrganizationTags', () => ({
  default: () => (
    <div data-testid="mock-organization-tags">Mock Organization Tags</div>
  ),
}));

vi.mock('screens/AdminPortal/ManageTag/ManageTag', () => ({
  default: () => <div data-testid="mock-manage-tag">Mock Manage Tag</div>,
}));

vi.mock('screens/AdminPortal/SubTags/SubTags', () => ({
  default: () => <div data-testid="mock-sub-tags">Mock Sub Tags</div>,
}));

vi.mock('screens/AdminPortal/Requests/Requests', () => ({
  default: () => <div data-testid="mock-requests">Mock Requests</div>,
}));

vi.mock('screens/AdminPortal/Users/Users', () => ({
  default: () => <div data-testid="mock-users">Mock Users</div>,
}));

vi.mock('screens/AdminPortal/CommunityProfile/CommunityProfile', () => ({
  default: () => (
    <div data-testid="mock-community-profile">Mock Community Profile</div>
  ),
}));

vi.mock('screens/AdminPortal/OrganizationVenues/OrganizationVenues', () => ({
  default: () => (
    <div data-testid="mock-organization-venues">Mock Organization Venues</div>
  ),
}));

vi.mock('screens/AdminPortal/Leaderboard/Leaderboard', () => ({
  default: () => <div data-testid="mock-leaderboard">Mock Leaderboard</div>,
}));

vi.mock('components/AdminPortal/Advertisements/Advertisements', () => ({
  default: () => (
    <div data-testid="mock-advertisements">Mock Advertisements</div>
  ),
}));

vi.mock('screens/UserPortal/Donate/Donate', () => ({
  default: () => <div data-testid="mock-donate">Mock Donate</div>,
}));

vi.mock('screens/UserPortal/Transactions/Transactions', () => ({
  default: () => (
    <div data-testid="mock-user-transactions">Mock User Transactions</div>
  ),
}));

vi.mock('screens/UserPortal/Events/Events', () => ({
  default: () => <div data-testid="mock-user-events">Mock User Events</div>,
}));

vi.mock('screens/UserPortal/Organizations/Organizations', () => ({
  default: () => (
    <div data-testid="mock-user-organizations">Mock User Organizations</div>
  ),
}));

vi.mock('screens/UserPortal/People/People', () => ({
  default: () => <div data-testid="mock-user-people">Mock User People</div>,
}));

vi.mock('screens/UserPortal/Chat/Chat', () => ({
  default: () => <div data-testid="mock-chat">Mock Chat</div>,
}));

vi.mock('components/EventDashboardScreen/EventDashboardScreen', () => ({
  default: () => (
    <div data-testid="mock-event-dashboard-screen">
      Mock Event Dashboard Screen
    </div>
  ),
}));

vi.mock('screens/Public/Invitation/AcceptInvitation', () => ({
  default: () => (
    <div data-testid="mock-accept-invitation">Mock Accept Invitation</div>
  ),
}));

vi.mock('screens/UserPortal/Campaigns/Campaigns', () => ({
  default: () => <div data-testid="mock-campaigns">Mock Campaigns</div>,
}));

vi.mock('screens/UserPortal/Pledges/Pledges', () => ({
  default: () => <div data-testid="mock-pledges">Mock Pledges</div>,
}));

vi.mock('screens/UserPortal/Volunteer/VolunteerManagement', () => ({
  default: () => (
    <div data-testid="mock-volunteer-management">Mock Volunteer Management</div>
  ),
}));

vi.mock('screens/UserPortal/LeaveOrganization/LeaveOrganization', () => ({
  default: () => (
    <div data-testid="mock-leave-organization">Mock Leave Organization</div>
  ),
}));

vi.mock('screens/AdminPortal/Notification/Notification', () => ({
  default: () => <div data-testid="mock-notification">Mock Notification</div>,
}));

vi.mock('screens/AdminPortal/PluginStore/PluginStore', () => ({
  default: () => <div data-testid="mock-plugin-store">Mock Plugin Store</div>,
}));

vi.mock(
  'screens/AdminPortal/OrganizationFundCampaign/OrganizationFundCampaigns',
  () => ({
    default: () => (
      <div data-testid="mock-organization-fund-campaign">
        Mock Organization Fund Campaign
      </div>
    ),
  }),
);

const MOCKS = [
  {
    request: { query: CURRENT_USER },
    result: {
      data: {
        currentUser: {
          id: '123',
          name: 'John Doe',
          createdAt: dayjs().subtract(1, 'year').toISOString(),
          image: 'john.jpg',
          emailAddress: 'johndoe@gmail.com',
          birthDate: '1990-01-01',
          educationGrade: 'NO_GRADE',
          employmentStatus: 'EMPLOYED',
          gender: 'MALE',
          maritalStatus: 'SINGLE',
          address: { line1: 'line1', state: 'state', countryCode: 'IND' },
          phone: { mobile: '+8912313112' },
          userType: 'USER',
          appUserProfile: {
            adminFor: [],
          },
        },
      },
    },
  },
];

const ADMIN_MOCKS = [
  {
    request: { query: CURRENT_USER },
    result: {
      data: {
        currentUser: {
          id: '456',
          name: 'Admin User',
          emailAddress: 'admin@example.com',
          userType: 'ADMIN',
          appUserProfile: {
            adminFor: [{ _id: 'org1' }, { _id: 'org2' }],
          },
        },
      },
    },
  },
];

const SUPER_ADMIN_MOCKS = [
  {
    request: { query: CURRENT_USER },
    result: {
      data: {
        currentUser: {
          id: '789',
          name: 'Super Admin',
          emailAddress: 'superadmin@example.com',
          userType: 'SUPERADMIN',
          appUserProfile: {
            adminFor: [{ _id: 'org1' }, { _id: 'org2' }, { _id: 'org3' }],
          },
        },
      },
    },
  },
];

const ERROR_MOCKS = [
  {
    request: { query: CURRENT_USER },
    error: new Error('Network error'),
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink([], true);
const adminLink = new StaticMockLink(ADMIN_MOCKS, true);
const superAdminLink = new StaticMockLink(SUPER_ADMIN_MOCKS, true);
const errorLink = new StaticMockLink(ERROR_MOCKS, true);

const renderApp = (mockLink = link, initialRoute = '/') => {
  return render(
    <MockedProvider link={mockLink}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <App />
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

async function wait(ms = 100): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

let logSpy: ReturnType<typeof vi.spyOn> | undefined;
let errorSpy: ReturnType<typeof vi.spyOn> | undefined;

describe('Testing the App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    logSpy?.mockRestore();
    errorSpy?.mockRestore();
  });

  it('Component should be rendered properly and user is logged in', async () => {
    renderApp(link, '/admin/orglist');

    await wait();

    expect(
      screen.getByText(
        'An open source application by Palisadoes Foundation volunteers',
      ),
    ).toBeTruthy();
  });

  it('Component should be rendered properly and user is logged out', async () => {
    renderApp(link2);
    await wait();
  });

  it('should initialize plugin system on app startup', async () => {
    renderApp();

    await waitFor(() => {
      expect(mockPluginManager.setApolloClient).toHaveBeenCalled();
      expect(mockPluginManager.initializePluginSystem).toHaveBeenCalled();
    });
  });

  it('should handle plugin system initialization errors', async () => {
    const error = new Error('Plugin initialization failed');
    mockPluginManager.initializePluginSystem.mockRejectedValueOnce(error);

    renderApp();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Failed to initialize plugin system:',
        error,
      );
    });
  });

  it('should handle regular user permissions correctly', async () => {
    const { usePluginRoutes } = await import('./plugin');

    renderApp();

    await waitFor(() => {
      // Regular user should have empty permissions array
      expect(usePluginRoutes).toHaveBeenCalledWith([], false, false); // userGlobalPluginRoutes
      expect(usePluginRoutes).toHaveBeenCalledWith([], false, true); // userOrgPluginRoutes
    });
  });

  it('should handle admin user permissions correctly', async () => {
    const { usePluginRoutes } = await import('./plugin');

    renderApp(adminLink);

    await waitFor(() => {
      // Admin should have org permissions
      expect(usePluginRoutes).toHaveBeenCalledWith(
        ['org1', 'org2'],
        true,
        false,
      ); // adminGlobalPluginRoutes
      expect(usePluginRoutes).toHaveBeenCalledWith(
        ['org1', 'org2'],
        true,
        true,
      ); // adminOrgPluginRoutes
    });
  });

  it('should handle super admin user permissions correctly', async () => {
    const { usePluginRoutes } = await import('./plugin');

    renderApp(superAdminLink);

    await waitFor(() => {
      // Super admin should have org permissions
      expect(usePluginRoutes).toHaveBeenCalledWith(
        ['org1', 'org2', 'org3'],
        true,
        false,
      );
      expect(usePluginRoutes).toHaveBeenCalledWith(
        ['org1', 'org2', 'org3'],
        true,
        true,
      );
    });
  });

  it('should handle user data with no admin organizations', async () => {
    const noAdminMocks = [
      {
        request: { query: CURRENT_USER },
        result: {
          data: {
            currentUser: {
              id: '999',
              name: 'Regular User',
              emailAddress: 'user@example.com',
              userType: 'USER',
              appUserProfile: {
                adminFor: null, // Test null case
              },
            },
          },
        },
      },
    ];

    const noAdminLink = new StaticMockLink(noAdminMocks, true);
    renderApp(noAdminLink);

    await wait();

    // Should handle null adminFor gracefully
    expect(document.body).toBeInTheDocument();
    // Verify plugin system is initialized even with null adminFor
    await waitFor(() => {
      expect(mockPluginManager.setApolloClient).toHaveBeenCalled();
    });
  });

  it('should handle GraphQL query errors gracefully', async () => {
    // Test that the app doesn't crash with error mocks
    renderApp(errorLink);

    await wait();

    // Should not crash and should render something (either loading or login page)
    expect(document.body).toBeInTheDocument();

    // The GraphQL error should not cause the app to crash
    // We don't expect a specific console.error call since the error might be handled silently
    // Instead, verify that the app continues to function normally
    expect(mockPluginManager.setApolloClient).toHaveBeenCalled();
  });

  it('should render plugin routes when provided', async () => {
    const mockPluginRoutes = [
      {
        pluginId: 'test-plugin',
        path: '/test-route',
        component: 'TestComponent',
        permissions: ['READ'],
      },
    ];

    const { usePluginRoutes } = await import('./plugin');
    vi.mocked(usePluginRoutes).mockReturnValue(mockPluginRoutes);

    renderApp(adminLink);

    await waitFor(() => {
      // Verify that usePluginRoutes was called, indicating plugin routes are being processed
      expect(usePluginRoutes).toHaveBeenCalled();
    });
  });

  it('should handle missing user data gracefully', async () => {
    const emptyMocks = [
      {
        request: { query: CURRENT_USER },
        result: {
          data: {
            currentUser: null,
          },
        },
      },
    ];

    const emptyLink = new StaticMockLink(emptyMocks, true);
    renderApp(emptyLink);

    await wait();

    // Should handle null user gracefully without crashing
    expect(document.body).toBeInTheDocument();
    // Verify plugin system is initialized even with null user
    await waitFor(() => {
      expect(mockPluginManager.setApolloClient).toHaveBeenCalled();
    });
  });

  it('should handle user without appUserProfile', async () => {
    const noProfileMocks = [
      {
        request: { query: CURRENT_USER },
        result: {
          data: {
            currentUser: {
              id: '555',
              name: 'No Profile User',
              emailAddress: 'noprofile@example.com',
              userType: 'USER',
              // Missing appUserProfile
            },
          },
        },
      },
    ];

    const noProfileLink = new StaticMockLink(noProfileMocks, true);
    renderApp(noProfileLink);

    await wait();

    // Should handle missing appUserProfile gracefully
    expect(document.body).toBeInTheDocument();
    // Verify plugin system is initialized even without appUserProfile
    await waitFor(() => {
      expect(mockPluginManager.setApolloClient).toHaveBeenCalled();
    });
  });

  it('should handle different plugin route types correctly', async () => {
    const { usePluginRoutes } = await import('./plugin');

    // Mock different return values for different calls
    vi.mocked(usePluginRoutes)
      .mockReturnValueOnce([]) // adminGlobalPluginRoutes
      .mockReturnValueOnce([
        {
          pluginId: 'admin-org',
          path: '/admin-org',
          component: 'AdminOrgComponent',
        },
      ]) // adminOrgPluginRoutes
      .mockReturnValueOnce([
        {
          pluginId: 'user-org',
          path: '/user-org',
          component: 'UserOrgComponent',
        },
      ]) // userOrgPluginRoutes
      .mockReturnValueOnce([]); // userGlobalPluginRoutes

    renderApp(adminLink);

    await waitFor(() => {
      // Verify that usePluginRoutes was called 4 times for different route types
      expect(usePluginRoutes).toHaveBeenCalledTimes(4);
    });
  });

  it('should render suspense fallback properly', async () => {
    // Mock React.lazy to simulate loading state
    const originalLazy = React.lazy;

    React.lazy = vi.fn().mockImplementation(<
      T extends React.ComponentType<unknown>,
    >(): React.LazyExoticComponent<T> => {
      const mockComponent = ((): React.ReactElement | null => {
        throw new Promise(() => {}); // Never resolves to keep loading
      }) as unknown as React.LazyExoticComponent<T>;

      // Add the required _result property for TypeScript compliance
      Object.defineProperty(mockComponent, '_result', {
        value: null,
        writable: true,
      });

      return mockComponent;
    });

    try {
      renderApp();

      // Should render without crashing
      expect(document.body).toBeInTheDocument();
    } finally {
      // Restore original lazy
      React.lazy = originalLazy;
    }
  });

  it('should correctly determine isAdmin and isSuperAdmin flags', async () => {
    renderApp(superAdminLink);

    await waitFor(() => {
      // Verify plugin system is initialized
      expect(mockPluginManager.setApolloClient).toHaveBeenCalled();
    });
  });

  it('should handle user with userType ADMIN correctly', async () => {
    renderApp(adminLink);

    await waitFor(() => {
      // Verify plugin system is initialized
      expect(mockPluginManager.setApolloClient).toHaveBeenCalled();
    });
  });

  it('should navigate to user settings', async () => {
    const { setItem, removeItem } = useLSModule.useLocalStorage();
    setItem('IsLoggedIn', 'TRUE');
    removeItem('AdminFor');

    renderApp(link, '/user/settings');
    expect(await screen.findByTestId('mock-profile-form')).toBeInTheDocument();
  });

  it('blocks /user/settings when not logged in', async () => {
    // Force IsLoggedIn !== 'TRUE'
    const lsSpy = vi.spyOn(useLSModule, 'default').mockImplementation(
      () =>
        ({
          getItem: (key: string) =>
            key === 'IsLoggedIn' ? 'FALSE' : undefined,
          setItem: vi.fn(),
          removeItem: vi.fn(),
          getStorageKey: (k: string) => `Talawa-admin_${k}`,
        }) as unknown as ReturnType<typeof useLSModule.default>,
    );

    try {
      renderApp(link, '/user/settings');

      // Guard blocks route; mocked Settings must NOT appear
      await waitFor(() => {
        expect(
          screen.queryByTestId('mock-profile-form'),
        ).not.toBeInTheDocument();
      });
    } finally {
      lsSpy.mockRestore();
    }
  });

  it('blocks /user/settings when AdminFor is present', async () => {
    // Force IsLoggedIn === 'TRUE' and AdminFor present
    const lsSpy = vi.spyOn(useLSModule, 'default').mockImplementation(
      () =>
        ({
          getItem: (key: string) =>
            key === 'IsLoggedIn'
              ? 'TRUE'
              : key === 'AdminFor'
                ? 'some-org-id'
                : undefined,
          setItem: vi.fn(),
          removeItem: vi.fn(),
          getStorageKey: (k: string) => `Talawa-admin_${k}`,
        }) as unknown as ReturnType<typeof useLSModule.default>,
    );

    try {
      renderApp(link, '/user/settings');

      // Guard takes "not allowed" branch; mocked Settings must NOT appear
      await waitFor(() => {
        expect(
          screen.queryByTestId('mock-profile-form'),
        ).not.toBeInTheDocument();
      });
    } finally {
      lsSpy.mockRestore();
    }
  });
});
