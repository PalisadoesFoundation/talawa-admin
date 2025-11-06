import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { toast } from 'react-toastify';
import SecuredRouteForUser from './SecuredRouteForUser';
import useLocalStorage from 'utils/useLocalstorage';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  },
}));

/**
 * Unit tests for SecuredRouteForUser component:
 *
 * 1. **Logged-in user**: Verifies that the route renders when 'IsLoggedIn' is set to 'TRUE'.
 * 2. **Not logged-in user**: Ensures redirection to the login page when 'IsLoggedIn' is 'FALSE'.
 * 3. **Logged-in user with admin access**: Checks that the route renders for a logged-in user with 'AdminFor' set (i.e., admin of an organization).
 *
 * LocalStorage values like 'IsLoggedIn' and 'AdminFor' are set to simulate different user states.
 */

const TestComponent = (): JSX.Element => <div>Test Protected Content</div>;

describe('SecuredRouteForUser', () => {
  const originalLocation = window.location;
  const { setItem, getItem } = useLocalStorage();

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
    // Use fake timers for controlling time-based operations
    vi.useFakeTimers();
    // Mock window.location.href
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { href: '' },
    });
  });

  afterEach(() => {
    // Clean up any timers or event listeners
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  describe('Authentication and Authorization', () => {
    it('renders the route when the user is logged in', () => {
      // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user and do not set 'AdminFor' so that it remains undefined.
      setItem('IsLoggedIn', 'TRUE');

      render(
        <MemoryRouter initialEntries={['/user/organizations']}>
          <Routes>
            <Route element={<SecuredRouteForUser />}>
              <Route
                path="/user/organizations"
                element={
                  <div data-testid="organizations-content">
                    Organizations Component
                  </div>
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('organizations-content')).toBeInTheDocument();
    });

    it('redirects to /user when the user is not logged in', () => {
      // Set the user as not logged in in local storage
      setItem('IsLoggedIn', 'FALSE');

      render(
        <MemoryRouter initialEntries={['/user/organizations']}>
          <Routes>
            <Route path="/" element={<div>User Login Page</div>} />
            <Route element={<SecuredRouteForUser />}>
              <Route
                path="/user/organizations"
                element={
                  <div data-testid="organizations-content">
                    Organizations Component
                  </div>
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('User Login Page')).toBeInTheDocument();
    });
  });

  describe('User Activity Tracking', () => {
    it('should update lastActive on mouse movement', () => {
      setItem('IsLoggedIn', 'TRUE');

      render(
        <MemoryRouter initialEntries={['/user/organizations']}>
          <Routes>
            <Route element={<SecuredRouteForUser />}>
              <Route path="/user/organizations" element={<TestComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      // Simulate mouse movement - this should update the lastActive timestamp
      fireEvent(document, new Event('mousemove'));
      expect(screen.getByText('Test Protected Content')).toBeInTheDocument();
    });

    it('should clear user session data after timeout', async () => {
      setItem('IsLoggedIn', 'TRUE');
      setItem('email', 'test@example.com');
      setItem('id', '123');
      setItem('name', 'Test User');
      setItem('token', 'test-token');
      setItem('userId', 'user-123');
      setItem('AdminFor', [{ _id: 'org-123' }]);
      setItem('role', 'regular');

      render(
        <MemoryRouter initialEntries={['/user/organizations']}>
          <Routes>
            <Route element={<SecuredRouteForUser />}>
              <Route path="/user/organizations" element={<TestComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      // Fast-forward past the inactivity timeout
      vi.advanceTimersByTime(15 * 60 * 1000 + 1000);
      vi.advanceTimersByTime(1 * 60 * 1000);

      expect(toast.warn).toHaveBeenCalledWith(
        'Kindly relogin as session has expired',
      );
      expect(getItem('IsLoggedIn')).toBe('FALSE');
      expect(getItem('token')).toBeNull();
      expect(getItem('userId')).toBeNull();
      expect(getItem('AdminFor')).toBeNull();
      expect(getItem('role')).toBeNull();
      expect(getItem('email')).toBeNull();
      expect(getItem('name')).toBeNull();
      expect(getItem('id')).toBeNull();
      expect(window.location.href).toBe('/');
    });
  });
});
