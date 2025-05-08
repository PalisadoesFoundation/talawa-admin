import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router';
import type { Mock } from 'vitest';
import { vi } from 'vitest';
import SignOut from './SignOut';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import useSession from 'utils/useSession';

// Mock dependencies
const mockStorage = {
  clear: vi.fn(),
  getItem: vi.fn((key: string) => {
    const items: Record<string, string> = {
      name: JSON.stringify('Test User'),
    };
    return items[key] || null;
  }),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};

// Save the original localStorage
const originalLocalStorage = global.localStorage;

// Mock localStorage globally
beforeEach(() => {
  Object.defineProperty(global, 'localStorage', {
    value: mockStorage,
    configurable: true,
  });

  // Clear mock calls before each test
  mockStorage.clear.mockClear();
  mockStorage.getItem.mockClear();
  mockStorage.setItem.mockClear();
  mockStorage.removeItem.mockClear();
});

// Restore the original localStorage after each test
afterEach(() => {
  Object.defineProperty(global, 'localStorage', {
    value: originalLocalStorage,
    configurable: true,
  });
});

const mockHandleLogout = vi.fn(async () => {
  mockStorage.clear(); // Ensure localStorage is cleared
  mockNavigate('/'); // Navigate after clearing storage
});

vi.mock('utils/useSession', () => ({
  default: () => ({
    handleLogout: mockHandleLogout,
  }),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignOut Component', () => {
  const mockRevokeRefreshToken = {
    request: {
      query: REVOKE_REFRESH_TOKEN,
    },
    result: {
      data: {
        revokeRefreshToken: true,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('calls logout functionality when sign out button is clicked', async () => {
    render(
      <MockedProvider mocks={[mockRevokeRefreshToken]} addTypename={false}>
        <BrowserRouter>
          <SignOut />
        </BrowserRouter>
      </MockedProvider>,
    );

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // Verify localStorage was cleared
      expect(mockStorage.clear).toHaveBeenCalled();
      // Verify navigation to home page
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
