import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Route, Routes } from 'react-router';
import ProfileCard from './ProfileCard';
import { MockedProvider } from '@apollo/react-testing';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG } from 'GraphQl/Queries/Queries';
import { vi } from 'vitest';

const { setItem, clearAllItems } = useLocalStorage();

let mockNavigate: ReturnType<typeof vi.fn>;

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
      query: LOGOUT_MUTATION,
    },
    result: {
      data: {
        logout: { success: true },
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
  mockNavigate = vi.fn();
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
  vi.restoreAllMocks();
  clearAllItems();
});

describe('ProfileDropdown Component', () => {
  test('renders with user information', () => {
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS}>
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
    expect(
      screen.getByAltText('Profile picture of John Doe'),
    ).toBeInTheDocument();
  });

  test('renders Admin', () => {
    setItem('AdminFor', ['123']);
    render(
      <MockedProvider mocks={MOCKS}>
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
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileCard />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const image = screen.getByAltText('Profile picture of John Doe');

    // Trigger image error which will cause ProfileAvatarDisplay to show fallback
    act(() => {
      image.dispatchEvent(new Event('error'));
    });

    // After error, the ProfileAvatarDisplay swaps to Avatar fallback
    // The fallback avatar should be visible with a different testid
    const fallbackAvatar = screen.getByTestId('display-img-fallback');
    expect(fallbackAvatar).toBeInTheDocument();
  });

  test('renders Avatar when userImage is null string', () => {
    setItem('UserImage', 'null');
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileCard />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Verify fallback avatar is displayed when userImage is 'null' string
    const avatar = screen.getByTestId('display-img');
    expect(avatar).toBeInTheDocument();
  });

  test('truncates long names', () => {
    setItem('name', 'This is a very long name that should be truncated');
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS}>
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
      <MockedProvider mocks={MOCKS}>
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
    const avatar = screen.getByTestId('display-img');
    expect(avatar).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  test('handles empty string name', () => {
    setItem('name', '');
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS}>
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
    const avatar = screen.getByTestId('display-img');
    expect(avatar).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  test('handles single name', () => {
    setItem('name', 'John');
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS}>
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
    const avatar = screen.getByTestId('display-img');
    expect(avatar).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });
});

describe('Member screen routing testing', () => {
  test('member screen', async () => {
    setItem('SuperAdmin', false);
    setItem('AdminFor', []);
    setItem('role', 'regular');
    render(
      <MockedProvider mocks={MOCKS}>
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
      <MockedProvider mocks={MOCKS}>
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

  test('navigates to /admin/profile for admin roles', async () => {
    window.history.pushState({}, 'Test page', '/321');
    setItem('SuperAdmin', true); // Set as admin
    setItem('id', '123');

    render(
      <MockedProvider mocks={MOCKS}>
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

    expect(mockNavigate).toHaveBeenCalledWith('/admin/profile');
  });

  test('navigates to /user/settings when admin is in user portal', async () => {
    setItem('role', 'administrator');
    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileCard portal="user" />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('profileBtn'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
  });
});
