import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { MockedProvider } from '@apollo/react-testing';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA } from 'GraphQl/Queries/Queries';
import { vi } from 'vitest';

const { setItem } = useLocalStorage();

const mockNavigate = vi.fn();

// Mock useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const MOCKS = [
  {
    request: {
      query: REVOKE_REFRESH_TOKEN,
    },
    result: {
      data: {
        revokeRefreshTokenForUser: true,
      },
    },
  },
  {
    request: {
      query: GET_COMMUNITY_SESSION_TIMEOUT_DATA,
    },
    result: {
      data: {
        getCommunityData: {
          timeout: 30,
        },
      },
    },
    delay: 1000,
  },
];

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  clear: vi.fn(),
}));

beforeEach(() => {
  setItem('FirstName', 'John');
  setItem('LastName', 'Doe');
  setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
  );
  setItem('SuperAdmin', false);
  setItem('AdminFor', []);
  setItem('id', '123');
});

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});
afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('ProfileDropdown Component', () => {
  test('renders with user information', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileDropdown />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('display-name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByTestId('display-type')).toBeInTheDocument();
    expect(screen.getByAltText('profile picture')).toBeInTheDocument();
  });

  test('renders Super admin', () => {
    setItem('SuperAdmin', true);
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <ProfileDropdown />
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByText('SuperAdmin')).toBeInTheDocument();
  });
  test('renders Admin', () => {
    setItem('AdminFor', ['123']);
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <ProfileDropdown />
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('logout functionality clears local storage and redirects to home', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <ProfileDropdown />
        </BrowserRouter>
      </MockedProvider>,
    );

    await act(async () => {
      userEvent.click(screen.getByTestId('togDrop'));
    });

    userEvent.click(screen.getByTestId('logoutBtn'));

    expect(global.window.location.pathname).toBe('/');
  });

  describe('Member screen routing testing', () => {
    test('member screen', async () => {
      setItem('SuperAdmin', false);
      setItem('AdminFor', []);

      render(
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ProfileDropdown />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await act(async () => {
        userEvent.click(screen.getByTestId('togDrop'));
      });

      await act(async () => {
        userEvent.click(screen.getByTestId('profileBtn'));
      });

      expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
    });
  });

  test('handles error when revoking refresh token during logout', async () => {
    // Mock the revokeRefreshToken mutation to throw an error
    const MOCKS_WITH_ERROR = [
      {
        request: {
          query: REVOKE_REFRESH_TOKEN,
        },
        error: new Error('Failed to revoke refresh token'),
      },
    ];

    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <MockedProvider mocks={MOCKS_WITH_ERROR} addTypename={false}>
        <BrowserRouter>
          <ProfileDropdown />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Open the dropdown
    await act(async () => {
      userEvent.click(screen.getByTestId('togDrop'));
    });

    // Click the logout button
    await act(async () => {
      userEvent.click(screen.getByTestId('logoutBtn'));
    });

    // Wait for any pending promises
    await waitFor(() => {
      // Assert that console.error was called
      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Error revoking refresh token:',
        expect.any(Error),
      );
    });

    // Cleanup mock
    consoleErrorMock.mockRestore();
  });

  test('navigates to /user/settings for a user', async () => {
    setItem('SuperAdmin', false);
    setItem('AdminFor', []);

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileDropdown />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await act(async () => {
      userEvent.click(screen.getByTestId('togDrop'));
    });

    await act(async () => {
      userEvent.click(screen.getByTestId('profileBtn'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
  });

  test('navigates to /member/:orgId for non-user roles when orgId is not present', async () => {
    window.history.pushState({}, 'Test page', '/orglist');
    setItem('SuperAdmin', true); // Set as admin
    setItem('id', '123');

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
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
      userEvent.click(screen.getByTestId('togDrop'));
    });

    await act(async () => {
      userEvent.click(screen.getByTestId('profileBtn'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/member/');
  });

  test('navigates to /member/:userID for non-user roles', async () => {
    window.history.pushState({}, 'Test page', '/321');
    setItem('SuperAdmin', true); // Set as admin
    setItem('id', '123');

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
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
      userEvent.click(screen.getByTestId('togDrop'));
    });

    await act(async () => {
      userEvent.click(screen.getByTestId('profileBtn'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/member/321');
  });
});
