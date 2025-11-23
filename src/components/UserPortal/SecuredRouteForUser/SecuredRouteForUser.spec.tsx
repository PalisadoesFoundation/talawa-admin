import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { toast } from 'react-toastify';
import SecuredRouteForUser from './SecuredRouteForUser';

// ======================================================
// 1. Mock useLocalStorage with an in-memory store
// ======================================================

let storage: Record<string, unknown> = {};

const getItem = (key: string) => {
  if (Object.prototype.hasOwnProperty.call(storage, key)) {
    return storage[key];
  }
  return null;
};

const setItem = (key: string, value: unknown) => {
  storage[key] = value;
};

const removeItem = (key: string) => {
  delete storage[key];
};

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem,
    setItem,
    removeItem,
  }),
}));

// ======================================================
// 2. Mock react-toastify
// ======================================================

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  },
}));

const TestComponent = (): JSX.Element => <div>Test Protected Content</div>;

describe('SecuredRouteForUser', () => {
  const originalLocation = window.location;
  let hrefValue = '';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // reset our in-memory "local storage"
    storage = {};

    // Mock window.location so redirects can be asserted
    hrefValue = '';
    const mockLocation = {
      get href() {
        return hrefValue;
      },
      set href(value: string) {
        hrefValue = value;
      },
      assign(url: string | URL) {
        hrefValue = typeof url === 'string' ? url : url.toString();
      },
    };

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: mockLocation,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();

    // restore original window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  // ======================================================
  // Authentication / Authorization tests
  // ======================================================

  describe('Authentication and Authorization', () => {
    it('renders the route when the user is logged in', () => {
      setItem('IsLoggedIn', 'TRUE');
      removeItem('AdminFor');

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

  // ======================================================
  // User activity / session timeout tests
  // ======================================================

  describe('User Activity Tracking', () => {
    it('should update lastActive on mouse movement', () => {
      setItem('IsLoggedIn', 'TRUE');
      removeItem('AdminFor');

      render(
        <MemoryRouter initialEntries={['/user/organizations']}>
          <Routes>
            <Route element={<SecuredRouteForUser />}>
              <Route path="/user/organizations" element={<TestComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      fireEvent(document, new Event('mousemove'));

      expect(screen.getByText('Test Protected Content')).toBeInTheDocument();
    });

    it('should clear user session data after timeout', () => {
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

      // Fast-forward past the inactivity timeout used by the component
      vi.advanceTimersByTime(15 * 60 * 1000 + 1000);
      vi.advanceTimersByTime(1 * 60 * 1000);

      expect(toast.warn).toHaveBeenCalledWith(
        'Kindly relogin as session has expired',
      );

      // Our mocked "local storage" should now reflect a cleared session
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
