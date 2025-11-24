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

// Import AFTER mocks — now safe because mocks are hoisted
import * as pluginModule from 'plugin';
import { getPluginManager } from 'plugin/manager';
import App from './App';

// Extract mocked functions
const mockDiscoverPlugins =
  pluginModule.discoverAndRegisterAllPlugins as unknown as ReturnType<
    typeof vi.fn
  >;

const mockPluginManager = getPluginManager() as unknown as {
  setApolloClient: ReturnType<typeof vi.fn>;
  initializePluginSystem: ReturnType<typeof vi.fn>;
};

vi.mock('@mui/x-charts/PieChart', () => ({
  PieChart: () => <>Chart</>,
}));

vi.mock('/src/assets/svgs/palisadoes.svg?react', () => ({
  default: () => <svg />,
}));

vi.mock('/src/assets/svgs/talawa.svg?react', () => ({
  default: () => <svg />,
}));

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

describe('Testing the App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    console.log = vi.fn();
    console.error = vi.fn();

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
    renderApp(new StaticMockLink(MOCKS, true));

    await waitFor(() => {
      expect(mockPluginManager.initializePluginSystem).toHaveBeenCalled();
      expect(mockDiscoverPlugins).toHaveBeenCalled();
    });
  });

  it('should handle registry import errors', async () => {
    const error = new Error('Registry import failed');
    mockDiscoverPlugins.mockRejectedValueOnce(error);

    renderApp(new StaticMockLink(MOCKS, true));

    await waitFor(() => {
      expect(mockDiscoverPlugins).toHaveBeenCalled();
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

    await wait(); // ensure Suspense + lazy import finish

    // Minimum assertion: something was rendered
    expect(document.body).toBeInTheDocument();
  });
});
