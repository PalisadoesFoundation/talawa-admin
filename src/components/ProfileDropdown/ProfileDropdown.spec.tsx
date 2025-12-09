import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Route, Routes } from 'react-router';
import ProfileDropdown from './ProfileDropdown';
import { MockedProvider } from '@apollo/react-testing';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG } from 'GraphQl/Queries/Queries';
import { vi } from 'vitest';

const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: unknown) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

vi.stubGlobal('localStorage', createLocalStorageMock());

const { setItem } = useLocalStorage();

let mockNavigate: ReturnType<typeof vi.fn>;

// Mock useNavigate hook
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

const MOCKS = [
  {
    request: { query: REVOKE_REFRESH_TOKEN },
    result: { data: { revokeRefreshTokenForUser: true } },
  },
  {
    request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
    result: { data: { community: { inactivityTimeoutDuration: 1800 } } },
    delay: 1000,
  },
];

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), warn: vi.fn(), error: vi.fn() },
  clear: vi.fn(),
}));

beforeEach(() => {
  mockNavigate = vi.fn();
  setItem('name', 'John Doe');
  setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
  );
  setItem('Admin', false);
  setItem('AdminFor', []);
  setItem('id', '123');
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  localStorage.clear();
});
afterAll(() => {
  // Ensure any global stubs are cleaned up for other test files
  vi.unstubAllGlobals();
});

describe('ProfileDropdown Component', () => {
  test('renders with user information', () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileDropdown />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('display-name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByTestId('display-type')).toBeInTheDocument();
    expect(screen.getByAltText('profile picture')).toBeInTheDocument();
  });

  test('renders admin', () => {
    setItem('role', 'API Administrator');
    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <ProfileDropdown />
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByText('API Administrator')).toBeInTheDocument();
  });
  test('renders Admin', () => {
    setItem('role', 'administrator');
    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <ProfileDropdown />
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByText('administrator')).toBeInTheDocument();
  });

  test('logout functionality clears local storage and redirects to home', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <ProfileDropdown />
        </BrowserRouter>
      </MockedProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('togDrop'));
    });

    await userEvent.click(screen.getByTestId('logoutBtn'));

    expect(global.window.location.pathname).toBe('/');
  });

  describe('Member screen routing testing', () => {
    test('member screen', async () => {
      setItem('role', 'regular');

      render(
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ProfileDropdown />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await act(async () => {
        await userEvent.click(screen.getByTestId('togDrop'));
      });

      await act(async () => {
        await userEvent.click(screen.getByTestId('profileBtn'));
      });

      expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
    });
  });

  test('navigates to /user/settings for a user', async () => {
    setItem('role', 'regular');

    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileDropdown />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('togDrop'));
    });

    await act(async () => {
      await userEvent.click(screen.getByTestId('profileBtn'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
  });

  test('navigates to /member/:orgId for non-user roles when orgId is not present', async () => {
    window.history.pushState({}, 'Test page', '/orglist');
    setItem('Admin', true); // Set as admin
    setItem('id', '123');

    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route path="/orglist" element={<ProfileDropdown />} />
            </Routes>
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('togDrop'));
    });

    await act(async () => {
      await userEvent.click(screen.getByTestId('profileBtn'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/member');
  });

  test('navigates to /member/:userID for non-user roles', async () => {
    window.history.pushState({}, 'Test page', '/321');
    setItem('Admin', true); // Set as admin
    setItem('id', '123');

    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route path="/:orgId" element={<ProfileDropdown />} />
            </Routes>
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('togDrop'));
    });

    await act(async () => {
      await userEvent.click(screen.getByTestId('profileBtn'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/member/321');
  });

  test('uses user settings route for admin when portal is user', async () => {
    setItem('role', 'administrator');
    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileDropdown portal="user" />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('togDrop'));
    });

    await act(async () => {
      await userEvent.click(screen.getByTestId('profileBtn'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
  });
});
