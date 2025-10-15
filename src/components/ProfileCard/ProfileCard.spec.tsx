import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Route, Routes } from 'react-router';
import ProfileCard from './ProfileCard';
import { MockedProvider } from '@apollo/react-testing';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG } from 'GraphQl/Queries/Queries';
import { vi } from 'vitest';

const { setItem } = useLocalStorage();

const mockNavigate = vi.fn();

// Mock useNavigate hook
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
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

describe('ProfileDropdown Component', () => {
  test('renders with user information', () => {
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileCard />
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

  test('renders Admin', () => {
    setItem('AdminFor', ['123']);
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <ProfileCard />
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('handles image load error', () => {
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileCard />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const image = screen.getByAltText('profile picture');
    act(() => {
      image.dispatchEvent(new Event('error'));
    });

    // Verify the broken image is hidden from view
    expect(image).not.toBeVisible();
  });

  test('renders Avatar when userImage is null string', () => {
    setItem('UserImage', 'null');
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileCard />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByAltText('dummy picture')).toBeInTheDocument();
    expect(screen.queryByAltText('profile picture')).not.toBeInTheDocument();
  });

  test('truncates long names', () => {
    setItem('name', 'This is a very long name that should be truncated');
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileCard />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const displayName = screen.getByTestId('display-name');
    expect(displayName.textContent).toMatch(/\.\.\.$/);
    // Verify the text is actually shorter than the input
    expect(displayName.textContent?.length || 0).toBeLessThan(
      'This is a very long name that should be truncated'.length,
    );
    // Optional: verify it starts with expected prefix (truncated at 17 chars + ...)
    expect(displayName.textContent).toMatch(/^This is a very lo/);
  });

  test('handles null name', () => {
    setItem('name', null);
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileCard />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const displayName = screen.getByTestId('display-name');
    expect(displayName.textContent).toBe(' ');
    // Verify other component elements still render correctly
    expect(screen.getByAltText('profile picture')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  test('handles empty string name', () => {
    setItem('name', '');
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileCard />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const displayName = screen.getByTestId('display-name');
    expect(displayName.textContent).toBe(' ');
    // Verify other component elements still render correctly
    expect(screen.getByAltText('profile picture')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  test('handles single name', () => {
    setItem('name', 'John');
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileCard />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const displayName = screen.getByTestId('display-name');
    expect(displayName.textContent).toBe('John ');
    // Verify other component elements still render correctly
    expect(screen.getByAltText('profile picture')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });
});

describe('Member screen routing testing', () => {
  test('member screen', async () => {
    setItem('SuperAdmin', false);
    setItem('AdminFor', []);
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileCard />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('profileBtn'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
  });

  test('navigates to /user/settings for a user', async () => {
    setItem('SuperAdmin', false);
    setItem('AdminFor', []);
    setItem('role', 'regular');

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileCard />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('profileBtn'));
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
              <Route path="/orglist" element={<ProfileCard />} />
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

  test('navigates to /member/:userID for non-user roles', async () => {
    window.history.pushState({}, 'Test page', '/321');
    setItem('SuperAdmin', true); // Set as admin
    setItem('id', '123');

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route path="/:orgId" element={<ProfileCard />} />
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
});
