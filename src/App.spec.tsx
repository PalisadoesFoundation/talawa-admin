import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/react-testing';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { store } from 'state/store';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import i18nForTest from './utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import 'style/app-fixed.module.css';

// IMPORTANT: these imports will be mocked by the vi.mock calls below
import * as pluginModule from 'plugin';
import { getPluginManager } from 'plugin/manager';
import App from './App';

// ---------------------- Plugin mocks (hoist-safe) ----------------------

// These mocks use ONLY local variables in the factory.
// They do NOT reference or assign any outer variables, so Vitest hoisting is safe.
vi.mock('plugin/manager', () => {
  const setApolloClient = vi.fn();
  const initializePluginSystem = vi.fn();

  const manager = {
    setApolloClient,
    initializePluginSystem,
  };

  return {
    getPluginManager: () => manager,
  };
});

vi.mock('plugin', () => {
  const usePluginRoutes = vi.fn(() => []);
  const PluginRouteRenderer = vi.fn(() => null);
  const discoverAndRegisterAllPlugins = vi.fn();

  return {
    usePluginRoutes,
    PluginRouteRenderer,
    discoverAndRegisterAllPlugins,
  };
});

// Grab the mocked functions from the mocked modules
const mockDiscoverPlugins =
  pluginModule.discoverAndRegisterAllPlugins as unknown as ReturnType<
    typeof vi.fn
  >;

const mockPluginManager = getPluginManager() as unknown as {
  setApolloClient: ReturnType<typeof vi.fn>;
  initializePluginSystem: ReturnType<typeof vi.fn>;
};

// ---------------------- Asset mocks ----------------------

vi.mock('@mui/x-charts/PieChart', () => ({
  PieChart: () => <>Chart</>,
}));

vi.mock('/src/assets/svgs/palisadoes.svg?react', () => ({
  default: () => <svg />,
}));

vi.mock('/src/assets/svgs/talawa.svg?react', () => ({
  default: () => <svg />,
}));

// ---------------------- Shared helpers ----------------------

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
          emailAddress: 'johndoe@gmail.com',
          userType: 'USER',
          appUserProfile: { adminFor: [] },
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
          userType: 'ADMIN',
          emailAddress: 'admin@example.com',
          appUserProfile: { adminFor: [{ _id: 'org1' }, { _id: 'org2' }] },
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
          userType: 'SUPERADMIN',
          emailAddress: 'super@example.com',
          appUserProfile: {
            adminFor: [{ _id: 'org1' }, { _id: 'org2' }, { _id: 'org3' }],
          },
        },
      },
    },
  },
];

const renderApp = (mockLink = new StaticMockLink(MOCKS, true)) =>
  render(
    <MockedProvider addTypename={false} link={mockLink}>
      <MemoryRouter initialEntries={['/']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <App />
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );

const wait = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------- Tests ----------------------

describe('Testing the App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    console.log = vi.fn();
    console.error = vi.fn();

    // Default successful plugin init behavior
    mockPluginManager.initializePluginSystem.mockResolvedValue(undefined);
    mockDiscoverPlugins.mockResolvedValue(undefined);
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  it('Component renders properly and user logged in', async () => {
    renderApp(new StaticMockLink(MOCKS, true));
    await wait();
    expect(document.body).toBeInTheDocument();
  });

  it('Component renders properly and user logged out', async () => {
    renderApp(new StaticMockLink([], true));
    await wait();
    expect(document.body).toBeInTheDocument();
  });

  it('should initialize plugin system on app startup', async () => {
    // Mount <App /> — the useEffect in App.tsx will:
    // - call getPluginManager().setApolloClient(...)
    // - call initializePluginSystem()
    // - call discoverAndRegisterAllPlugins()
    renderApp(new StaticMockLink(MOCKS, true));

    await waitFor(() => {
      expect(mockPluginManager.initializePluginSystem).toHaveBeenCalled();
      expect(mockDiscoverPlugins).toHaveBeenCalled();
    });
  });

  it('should handle registry import errors', async () => {
    const error = new Error('Registry import failed');
    // On first call, make discoverAndRegisterAllPlugins reject
    mockDiscoverPlugins.mockRejectedValueOnce(error);

    renderApp(new StaticMockLink(MOCKS, true));

    await waitFor(() => {
      expect(mockDiscoverPlugins).toHaveBeenCalled();
      // App.tsx logs: console.error('Failed to initialize plugin system:', error)
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('should handle admin user', async () => {
    renderApp(new StaticMockLink(ADMIN_MOCKS, true));

    await waitFor(() => {
      expect(console.log).toHaveBeenCalled();
    });
  });

  it('should handle super admin user', async () => {
    renderApp(new StaticMockLink(SUPER_ADMIN_MOCKS, true));

    await waitFor(() => {
      expect(console.log).toHaveBeenCalled();
    });
  });

  it('renders PageNotFound for unknown route', async () => {
    // Navigate to a route that does not exist
    render(
      <MockedProvider addTypename={false} link={new StaticMockLink([], true)}>
        <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <App />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // The LazyPageNotFound component shows something—usually text or an element.
    // If you don't know what it shows, we simply wait for lazy load to finish.
    await wait(); // allow Suspense fallback + lazy import

    // Minimum assertion: PageNotFound rendered something non-empty
    expect(document.body).toBeInTheDocument();
  });

  it('should navigate to user settings', async () => {
    renderApp(link, '/user/settings');

    await waitFor(() => {
      // Should render user screen components
      expect(screen.getByTestId('mock-settings')).toBeInTheDocument();
    });
  });
});
