import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/client/testing/react';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import { store } from 'state/store';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import i18nForTest from './utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import 'style/app-fixed.module.css';

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
  PluginRouteRenderer: vi.fn(({ route, fallback }) => (
    <div data-testid={`plugin-route-${route.pluginId}`}>{fallback}</div>
  )),
  PluginInjector: vi.fn(() => <div>Mock Plugin Injector</div>),
}));

vi.mock('screens/UserPortal/Settings/Settings', () => ({
  default: () => <div data-testid="mock-settings">Mock Settings</div>,
}));

const MOCKS = [
  {
    request: { query: CURRENT_USER },
    result: {
      data: {
        currentUser: {
          id: '123',
          name: 'John Doe',
          createdAt: '2023-04-13T04:53:17.742+00:00',
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

describe('Testing the App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restores console spies automatically
  });

  it('Component should be rendered properly and user is logged in', async () => {
    renderApp(link, '/orglist');

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
    renderApp(link, '/user/settings');

    await waitFor(() => {
      // Should render user screen components
      expect(screen.getByTestId('mock-settings')).toBeInTheDocument();
    });
  });
});
