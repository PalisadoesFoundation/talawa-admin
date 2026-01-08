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
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import SecuredRouteForUser from './SecuredRouteForUser';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: { warning: vi.fn() },
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

const TestComponent = (): JSX.Element => (
  <div data-testid="protected-content">Test Protected Content</div>
);

const renderWithRouter = (initialEntry = '/user/organizations') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/"
          element={<div data-testid="home-page">Home Page</div>}
        />
        <Route element={<SecuredRouteForUser />}>
          <Route path="/user/organizations" element={<TestComponent />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
};

describe('SecuredRouteForUser', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage = {};
    vi.useFakeTimers();
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { href: '' },
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    mockStorage = {};
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  describe('Authentication and Authorization', () => {
    it('renders protected content when user is logged in and not an admin', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      // AdminFor is undefined (not set)

      renderWithRouter();

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('redirects to home page when user is not logged in', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'FALSE';

      renderWithRouter();

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('redirects to home page when IsLoggedIn is not set', () => {
      // Don't set IsLoggedIn at all

      renderWithRouter();

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('shows PageNotFound when logged-in user has admin role', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      mockStorage['Talawa-admin_AdminFor'] = JSON.stringify([
        { _id: 'org-123' },
      ]);

      renderWithRouter();

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

  describe('User Activity Tracking', () => {
    it('updates lastActive on mousemove event', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      act(() => {
        fireEvent.mouseMove(document);
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('updates lastActive on keydown event', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      act(() => {
        fireEvent.keyDown(document, { key: 'a' });
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('updates lastActive on click event', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      act(() => {
        fireEvent.click(document);
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('updates lastActive on scroll event', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      act(() => {
        fireEvent.scroll(document);
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('does not set up activity listeners when user is not logged in', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      mockStorage['Talawa-admin_IsLoggedIn'] = 'FALSE';

      renderWithRouter();

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
      );
      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
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

      // Advance past inactivity check interval (1 min) + timeout (15 min)
      act(() => {
        vi.advanceTimersByTime(16 * 60 * 1000);
      });

      expect(NotificationToast.warning).toHaveBeenCalled();
      expect(mockStorage['Talawa-admin_IsLoggedIn']).toBe('FALSE');
      expect(mockStorage['Talawa-admin_email']).toBeUndefined();
      expect(mockStorage['Talawa-admin_id']).toBeUndefined();
      expect(mockStorage['Talawa-admin_name']).toBeUndefined();
      expect(mockStorage['Talawa-admin_token']).toBeUndefined();
      expect(mockStorage['Talawa-admin_userId']).toBeUndefined();
      expect(mockStorage['Talawa-admin_role']).toBeUndefined();
      expect(mockStorage['Talawa-admin_AdminFor']).toBeUndefined();
    });

    it('redirects to home page after session timeout', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      act(() => {
        vi.advanceTimersByTime(16 * 60 * 1000);
      });

      // Wait for the 1 second delay before redirect
      act(() => {
        vi.advanceTimersByTime(1000);
      });

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
      expect(NotificationToast.warning).not.toHaveBeenCalled();
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('does not trigger timeout check when user is not logged in', () => {
      mockStorage['Talawa-admin_IsLoggedIn'] = 'FALSE';
      renderWithRouter();

      act(() => {
        vi.advanceTimersByTime(20 * 60 * 1000);
      });

      expect(NotificationToast.warning).not.toHaveBeenCalled();
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
      expect(NotificationToast.warning).not.toHaveBeenCalled();

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

      expect(NotificationToast.warning).not.toHaveBeenCalled();
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

      expect(NotificationToast.warning).not.toHaveBeenCalled();
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });
});
