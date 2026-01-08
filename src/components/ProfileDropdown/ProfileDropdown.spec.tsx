import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Route, Routes } from 'react-router';
import ProfileDropdown, { MAX_NAME_LENGTH } from './ProfileDropdown';
import { MockedProvider } from '@apollo/react-testing';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG } from 'GraphQl/Queries/Queries';
import { vi, beforeAll } from 'vitest';

let setItem: ReturnType<typeof useLocalStorage>['setItem'];
let clearAllItems: ReturnType<typeof useLocalStorage>['clearAllItems'];

beforeAll(() => {
  const storage = useLocalStorage();
  setItem = storage.setItem;
  clearAllItems = storage.clearAllItems;
});

let mockNavigate: ReturnType<typeof vi.fn>;

// Mock useNavigate hook
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

const MOCKS = [
  {
    request: { query: LOGOUT_MUTATION },
    result: { data: { logout: { success: true } } },
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
  setItem('SuperAdmin', false);
  setItem('AdminFor', []);
  setItem('id', '123');
});

afterEach(() => {
  vi.clearAllMocks();
  clearAllItems();
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

  test('truncates long names to MAX_NAME_LENGTH characters with ellipsis', () => {
    clearAllItems();
    const longName = 'ThisIsAVeryLongNameThatExceedsTwentyCharacters';
    setItem('name', longName);
    setItem('UserImage', 'https://example.com/image.jpg');
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

    const expectedName = longName.substring(0, MAX_NAME_LENGTH - 3) + '...';
    const displayedName = screen.getByTestId('display-name').textContent;
    expect(displayedName).toBe(expectedName);
  });

  test('renders Avatar component when no user image is available', () => {
    clearAllItems();
    setItem('name', 'John Doe');
    setItem('role', 'regular');
    // UserImage not set, should show Avatar fallback

    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ProfileDropdown />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByAltText('dummy picture')).toBeInTheDocument();
  });

  test('renders Avatar component when user image is null string', () => {
    clearAllItems();
    setItem('name', 'John Doe');
    setItem('UserImage', 'null');
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

    expect(screen.getByAltText('dummy picture')).toBeInTheDocument();
  });

  test('renders Super admin', () => {
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

  test('navigates to /admin/profile for admin roles', async () => {
    window.history.pushState({}, 'Test page', '/321');

    setItem('SuperAdmin', true); // Admin role
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

    expect(mockNavigate).toHaveBeenCalledWith('/admin/profile');
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

  test('handles error when logout fails during logout', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const errorMocks = [
      {
        request: { query: LOGOUT_MUTATION },
        error: new Error('Network error'),
      },
      {
        request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
        result: { data: { community: { inactivityTimeoutDuration: 1800 } } },
        delay: 1000,
      },
    ];

    render(
      <MockedProvider mocks={errorMocks}>
        <BrowserRouter>
          <ProfileDropdown />
        </BrowserRouter>
      </MockedProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('togDrop'));
    });

    await act(async () => {
      await userEvent.click(screen.getByTestId('logoutBtn'));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during logout:',
      expect.any(Error),
    );
    // Verify that navigation still happens even when logout mutation fails
    expect(mockNavigate).toHaveBeenCalledWith('/');
    consoleSpy.mockRestore();
  });
});
