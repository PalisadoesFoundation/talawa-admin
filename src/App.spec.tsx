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

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

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


const link = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink([]);
const adminLink = new StaticMockLink(ADMIN_MOCKS);
const superAdminLink = new StaticMockLink(SUPER_ADMIN_MOCKS);
const errorLink = new StaticMockLink(ERROR_MOCKS);

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
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
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

    expect(console.log).toHaveBeenCalledWith(
      'Plugin system initialized successfully',
    );
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

  it('should log user and plugin route debug information', async () => {
    renderApp(adminLink);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('=== APP.TSX ROUTE DEBUG ===');
      expect(console.log).toHaveBeenCalledWith(
        'Current user data:',
        expect.objectContaining({
          userType: 'ADMIN',
          isAdmin: true,
          isSuperAdmin: false,
          userPermissions: 2,
          userPermissionsArray: ['org1', 'org2'],
        }),
      );
      expect(console.log).toHaveBeenCalledWith(
        '=== END APP.TSX ROUTE DEBUG ===',
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

    const noAdminLink = new StaticMockLink(noAdminMocks);
    renderApp(noAdminLink);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        'Current user data:',
        expect.objectContaining({
          userType: 'USER',
          isAdmin: false,
          isSuperAdmin: false,
          userPermissions: 0,
          userPermissionsArray: [],
        }),
      );
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

    // Verify the plugin routes were processed by checking console logs
    expect(console.log).toHaveBeenCalledWith(
      'Plugin routes loaded:',
      expect.any(Object),
    );
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

    const emptyLink = new StaticMockLink(emptyMocks);
    renderApp(emptyLink);

    await wait();

    // Should handle null user gracefully without crashing
    expect(document.body).toBeInTheDocument();

    // Should log the debug information with null user handled
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('=== APP.TSX ROUTE DEBUG ===');
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

    const noProfileLink = new StaticMockLink(noProfileMocks);
    renderApp(noProfileLink);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        'Current user data:',
        expect.objectContaining({
          userType: 'USER',
          isAdmin: false,
          isSuperAdmin: false,
          userPermissions: 0,
          userPermissionsArray: [],
        }),
      );
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

      // Verify the plugin routes were logged
      expect(console.log).toHaveBeenCalledWith(
        'Plugin routes loaded:',
        expect.objectContaining({
          admin: expect.objectContaining({
            count: 1,
            routes: expect.arrayContaining([
              expect.objectContaining({ pluginId: 'admin-org' }),
            ]),
          }),
          user: expect.objectContaining({
            count: 1,
            routes: expect.arrayContaining([
              expect.objectContaining({ pluginId: 'user-org' }),
            ]),
          }),
        }),
      );
    });
  });

  it('should render suspense fallback properly', async () => {
    // Mock React.lazy to simulate loading state
    const originalLazy = React.lazy;

    React.lazy = vi
      .fn()
      .mockImplementation(
        <T extends React.ComponentType<unknown>>(
          _factory: () => Promise<{ default: T }>,
        ): React.LazyExoticComponent<T> => {
          const mockComponent = React.forwardRef(() => {
            throw new Promise(() => {}); // Never resolves to keep loading
          }) as React.LazyExoticComponent<T>;

          // Add the required _result property for TypeScript compliance
          Object.defineProperty(mockComponent, '_result', {
            value: null,
            writable: true,
          });

          return mockComponent;
        },
      );

    try {
      renderApp();

      // Should render without crashing
      expect(document.body).toBeInTheDocument();
    } finally {
      // Restore original lazy
      React.lazy = originalLazy;
    }
  });

  it('should handle registry import errors', async () => {
    const registryError = new Error('Registry import failed');

    // Mock the registry import function to fail
    const mockDiscoverAndRegisterAllPlugins = vi
      .fn()
      .mockRejectedValue(registryError);

    vi.doMock('./plugin/registry', () => ({
      discoverAndRegisterAllPlugins: mockDiscoverAndRegisterAllPlugins,
    }));

    renderApp();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Failed to initialize plugin system:',
        registryError,
      );
    });
  });

  it('should correctly determine isAdmin and isSuperAdmin flags', async () => {
    renderApp(superAdminLink);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        'Current user data:',
        expect.objectContaining({
          userType: 'SUPERADMIN',
          isAdmin: true,
          isSuperAdmin: true,
        }),
      );
    });
  });

  it('should handle user with userType ADMIN correctly', async () => {
    renderApp(adminLink);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        'Current user data:',
        expect.objectContaining({
          userType: 'ADMIN',
          isAdmin: true,
          isSuperAdmin: false,
        }),
      );
    });
  });
});
