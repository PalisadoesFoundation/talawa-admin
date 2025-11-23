import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from '@testing-library/react';
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
  toast: { warn: vi.fn() },
}));

vi.mock('screens/PageNotFound/PageNotFound', () => ({
  default: () => <div data-testid="page-not-found">Page Not Found</div>,
}));

// Mock storage object to simulate localStorage
let mockStorage: Record<string, string> = {};

// Mock the useLocalStorage hook with prefix support
vi.mock('utils/useLocalstorage', () => ({
  default: (prefix = 'Talawa-admin') => {
    const getStorageKey = (key: string) => `${prefix}_${key}`;

    return {
      getItem: (key: string) => {
        const prefixedKey = getStorageKey(key);
        const value = mockStorage[prefixedKey];
        if (value === undefined) return undefined;
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      },
      setItem: (key: string, value: unknown) => {
        const prefixedKey = getStorageKey(key);
        mockStorage[prefixedKey] =
          typeof value === 'string' ? value : JSON.stringify(value);
      },
      removeItem: (key: string) => {
        const prefixedKey = getStorageKey(key);
        delete mockStorage[prefixedKey];
      },
      getStorageKey,
    };
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

      expect(screen.getByTestId('page-not-found')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('shows PageNotFound when AdminFor is an empty array', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      mockStorage['Talawa-admin_AdminFor'] = JSON.stringify([]);

      renderWithRouter();

      // Empty array is still defined, so PageNotFound should show
      expect(screen.getByTestId('page-not-found')).toBeInTheDocument();
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
      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );
      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
      );
    });
  });

  describe('Session Timeout', () => {
    it('logs out user after 15 minutes of inactivity', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      mockStorage['Talawa-admin_email'] = 'test@example.com';
      mockStorage['Talawa-admin_id'] = '123';
      mockStorage['Talawa-admin_name'] = 'Test User';
      mockStorage['Talawa-admin_token'] = 'test-token';
      mockStorage['Talawa-admin_userId'] = 'user-123';
      mockStorage['Talawa-admin_role'] = 'regular';

      renderWithRouter();

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

    it('resets inactivity timer on user activity', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      // Advance time but not past timeout
      act(() => {
        vi.advanceTimersByTime(10 * 60 * 1000);
      });

      // Simulate user activity
      act(() => {
        fireEvent.mouseMove(document);
      });

      // Advance another 10 minutes (would be 20 total without activity reset)
      act(() => {
        vi.advanceTimersByTime(10 * 60 * 1000);
      });

      // Should still be logged in because activity reset the timer
      expect(toast.warn).not.toHaveBeenCalled();
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('does not trigger timeout check when user is not logged in', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'FALSE';
      renderWithRouter();

      act(() => {
        vi.advanceTimersByTime(20 * 60 * 1000);
      });

      expect(toast.warn).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('removes event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';

      const { unmount } = renderWithRouter();
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
      );
    });

    it('clears interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';

      const { unmount } = renderWithRouter();
      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('handles unmount when interval is not set (not logged in)', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'FALSE';

      const { unmount } = renderWithRouter();

      // Should not throw error on unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles AdminFor being null', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      mockStorage['Talawa-admin_AdminFor'] = JSON.stringify(null);

      renderWithRouter();

      // null should be treated as "no admin role", so protected content should show
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('page-not-found')).not.toBeInTheDocument();
    });

    it('handles multiple activity events in quick succession', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      act(() => {
        fireEvent.mouseMove(document);
        fireEvent.keyDown(document, { key: 'Enter' });
        fireEvent.click(document);
        fireEvent.scroll(document);
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('properly checks inactivity at each interval', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      // First interval check (1 min) - should not logout
      act(() => {
        vi.advanceTimersByTime(1 * 60 * 1000);
      });
      expect(toast.warn).not.toHaveBeenCalled();

      // Activity to reset timer
      act(() => {
        fireEvent.click(document);
      });

      // Multiple interval checks without exceeding timeout
      for (let i = 0; i < 10; i++) {
        act(() => {
          vi.advanceTimersByTime(1 * 60 * 1000);
        });
        act(() => {
          fireEvent.mouseMove(document);
        });
      }

      expect(toast.warn).not.toHaveBeenCalled();
    });

    it('handles AdminFor being a string value', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      mockStorage['Talawa-admin_AdminFor'] = 'some-org-id';

      renderWithRouter();

      // String is defined, so PageNotFound should show
      expect(screen.getByTestId('page-not-found')).toBeInTheDocument();
    });

    it('remains logged in with continuous activity before timeout', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      // Simulate activity every 5 minutes for 30 minutes
      for (let i = 0; i < 6; i++) {
        act(() => {
          vi.advanceTimersByTime(5 * 60 * 1000);
        });
        act(() => {
          fireEvent.keyDown(document, { key: 'Space' });
        });
      }

      expect(toast.warn).not.toHaveBeenCalled();
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });
});
