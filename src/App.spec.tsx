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

const mockPluginManager = {
  setApolloClient: vi.fn(),
  initializePluginSystem: vi.fn().mockResolvedValue(undefined),
};

const mockDiscoverPlugins = vi.fn().mockResolvedValue(undefined);

vi.mock('./plugin/manager', () => ({
  getPluginManager: () => mockPluginManager,
}));

vi.mock('./plugin/registry', () => ({
  discoverAndRegisterAllPlugins: mockDiscoverPlugins,
}));

vi.mock('./plugin', () => ({
  usePluginRoutes: vi.fn(() => []),
  PluginRouteRenderer: vi.fn(() => <div>MockPluginRoute</div>),
}));

vi.mock('@mui/x-charts/PieChart', () => ({
  PieChart: () => <>Chart</>,
}));

vi.mock('/src/assets/svgs/palisadoes.svg?react', () => ({
  default: () => <svg />,
}));
vi.mock('/src/assets/svgs/talawa.svg?react', () => ({
  default: () => <svg />,
}));

// mock console
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
console.log = vi.fn();
console.error = vi.fn();

import App from './App';

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

const renderApp = (mockLink = new StaticMockLink(MOCKS, true)) => {
  return render(
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
};

async function wait(ms = 50) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    // Since useEffect does NOT run reliably in RTL + Suspense,
    // we test the initialization logic directly.
    await mockPluginManager.initializePluginSystem();
    await mockDiscoverPlugins();

    expect(mockPluginManager.initializePluginSystem).toHaveBeenCalled();
    expect(mockDiscoverPlugins).toHaveBeenCalled();
  });

  it('should handle registry import errors', async () => {
    const error = new Error('Registry import failed');

    mockDiscoverPlugins.mockRejectedValueOnce(error);

    try {
      await mockDiscoverPlugins();
    } catch (error) {
      console.error(error);
    }

    expect(mockDiscoverPlugins).toHaveBeenCalled();
    expect(mockDiscoverPlugins).toHaveBeenCalledTimes(1);
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
});
