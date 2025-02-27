import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { MockedProvider } from '@apollo/react-testing';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG } from 'GraphQl/Queries/Queries';
import { vi } from 'vitest';
import '../../style/app.module.css';

const { setItem } = useLocalStorage();

const mockNavigate = vi.fn();
const mockEndSession = vi.fn();

// Mock useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useSession hook
vi.mock('utils/useSession', () => ({
  default: () => ({
    endSession: mockEndSession,
  }),
}));

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
      query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
    },
    result: {
      data: {
        community: {
          inactivityTimeoutDuration: 1800,
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
  setItem('name', 'John Doe');
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
    expect(screen.getByTestId('display-type')).toBeInTheDocument();
    expect(screen.getByAltText('profile picture')).toBeInTheDocument();
  });

  test('renders Avatar when userImage is null', () => {
    setItem('UserImage', null);

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileDropdown />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByAltText('dummy picture')).toBeInTheDocument();
  });

  test('truncates long names', () => {
    setItem('name', 'This is a very long name that should be truncated');

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileDropdown />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('This is a very long...')).toBeInTheDocument();
  });

  test('renders Super admin', () => {
    setItem('role', 'API Administrator');
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileDropdown />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByText('API Administrator')).toBeInTheDocument();
  });

  test('renders Admin', () => {
    setItem('role', 'administrator');
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileDropdown />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByText('administrator')).toBeInTheDocument();
  });

  test('logout functionality clears local storage and redirects to home', async () => {
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
      await userEvent.click(screen.getByTestId('logoutBtn'));
    });

    expect(mockEndSession).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to /user/settings for a regular user', async () => {
    setItem('role', 'regular');

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
      await userEvent.click(screen.getByTestId('profileBtn'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
  });

  test('navigates to /member/:orgId for non-user roles when orgId is present', async () => {
    window.history.pushState({}, 'Test page', '/321');
    setItem('role', 'administrator');

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
      await userEvent.click(screen.getByTestId('profileBtn'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/member/321');
  });

  test('navigates to /member/ for non-user roles when orgId is not present', async () => {
    window.history.pushState({}, 'Test page', '/orglist');
    setItem('role', 'administrator');

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
      await userEvent.click(screen.getByTestId('profileBtn'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/member/');
  });
});
