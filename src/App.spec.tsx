// Minimal, clean version (previous large duplicated block removed)
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi, describe, it, expect, beforeEach, afterAll } from 'vitest';
import App from './App';
import Loader from 'components/Loader/Loader';
import ReactDOM from 'react-dom';

// Minimal component mocks (keep lightweight)
vi.mock('screens/LoginPage/LoginPage', () => ({
  default: () => <div data-testid="route-login">login</div>,
}));
vi.mock('components/SecuredRoute/SecuredRoute', () => ({
  default: ({ children }: any) => <>{children}</>,
}));
vi.mock(
  'components/UserPortal/SecuredRouteForUser/SecuredRouteForUser',
  () => ({ default: ({ children }: any) => <>{children}</> }),
);
vi.mock('components/SuperAdminScreen/SuperAdminScreen', () => ({
  default: ({ children }: any) => (
    <div data-testid="super-wrapper">{children}</div>
  ),
}));
vi.mock('screens/OrgList/OrgList', () => ({
  default: () => <div data-testid="route-orglist">orglist</div>,
}));
vi.mock('screens/UserPortal/Settings/Settings', () => ({
  default: () => <div data-testid="route-usersettings">usersettings</div>,
}));
vi.mock('plugin', () => ({
  usePluginRoutes: vi.fn(() => []),
  PluginRouteRenderer: ({ route }: any) => (
    <div data-testid={`plugin-${route.pluginId}`}>plugin</div>
  ),
}));
vi.mock('plugin/manager', () => ({
  getPluginManager: () => ({
    setApolloClient: vi.fn(),
    initializePluginSystem: vi.fn().mockResolvedValue(undefined),
  }),
}));
vi.mock('./plugin/registry', () => ({
  discoverAndRegisterAllPlugins: vi.fn().mockResolvedValue(undefined),
}));

// Apollo mock
const states: any = {
  none: { data: { currentUser: null }, loading: false },
  regular: {
    data: {
      currentUser: {
        userType: 'REGULAR',
        id: 'u1',
        name: 'User',
        emailAddress: 'u@example.com',
        appUserProfile: { adminFor: [] },
      },
    },
    loading: false,
  },
  admin: {
    data: {
      currentUser: {
        userType: 'ADMIN',
        id: 'a1',
        name: 'Admin',
        emailAddress: 'a@example.com',
        appUserProfile: { adminFor: [{ _id: 'o1' }] },
      },
    },
    loading: false,
  },
};
let currentQueryState = states.none;
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual<any>('@apollo/client');
  return {
    ...actual,
    useQuery: vi.fn(() => currentQueryState),
    useApolloClient: () => ({}),
  };
});

const origLog = console.log;
const origErr = console.error;

describe('App minimal routing coverage', () => {
  beforeEach(() => {
    console.log = vi.fn();
    console.error = vi.fn();
  });

  it('renders login for unauthenticated', async () => {
    currentQueryState = states.none;
    render(
      <MemoryRouter initialEntries={['/']}>
        {' '}
        <App />{' '}
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('route-login')).toBeInTheDocument();
  });

  it('logs current user data for regular user (covers regular route branch)', async () => {
    currentQueryState = states.regular;
    render(
      <MemoryRouter initialEntries={['/user/settings']}>
        {' '}
        <App />{' '}
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        (console.log as any).mock.calls.some(
          (c: any[]) =>
            c[0] === 'Current user data:' && c[1]?.userType === 'REGULAR',
        ),
      ).toBe(true);
    });
  });

  it('logs current user data for admin user (covers admin route branch)', async () => {
    currentQueryState = states.admin;
    render(
      <MemoryRouter initialEntries={['/orglist']}>
        {' '}
        <App />{' '}
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        (console.log as any).mock.calls.some(
          (c: any[]) =>
            c[0] === 'Current user data:' && c[1]?.userType === 'ADMIN',
        ),
      ).toBe(true);
    });
  });

  it('plugin init success logs', async () => {
    currentQueryState = states.admin;
    render(
      <MemoryRouter initialEntries={['/orglist']}>
        {' '}
        <App />{' '}
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        (console.log as any).mock.calls.some((c: any[]) =>
          c.join(' ').includes('Plugin system initialized successfully'),
        ),
      ).toBe(true);
    });
  });

  it('plugin init failure path', async () => {
    vi.resetModules();
    vi.doMock('plugin/manager', () => ({
      getPluginManager: () => ({
        setApolloClient: vi.fn(),
        initializePluginSystem: vi.fn().mockRejectedValue(new Error('boom')),
      }),
    }));
    const { default: FreshApp } = await import('./App');
    currentQueryState = states.admin;
    render(
      <MemoryRouter initialEntries={['/orglist']}>
        {' '}
        <FreshApp />{' '}
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        (console.error as any).mock.calls.some((c: any[]) =>
          (c[0] || '').includes('Failed to initialize plugin system'),
        ),
      ).toBe(true);
    });
  });
});

afterAll(() => {
  console.log = origLog;
  console.error = origErr;
});
// End minimal spec
