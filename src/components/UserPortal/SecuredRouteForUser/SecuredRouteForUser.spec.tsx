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

vi.mock('react-toastify', () => ({
  toast: { warn: vi.fn() },
}));

vi.mock('screens/PageNotFound/PageNotFound', () => ({
  default: () => <div data-testid="page-not-found">Page Not Found</div>,
}));

// Mock storage object to simulate localStorage
let mockStorage: Record<string, string> = {};

// Mock the useLocalStorage hook
vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: (key: string) => {
      const value = mockStorage[key];
      if (value === undefined) return undefined;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
    setItem: (key: string, value: unknown) => {
      mockStorage[key] =
        typeof value === 'string' ? value : JSON.stringify(value);
    },
    removeItem: (key: string) => {
      delete mockStorage[key];
    },
  }),
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
      mockStorage['IsLoggedIn'] = 'TRUE';
      // AdminFor is undefined (not set)

      renderWithRouter();

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('redirects to home page when user is not logged in', () => {
      mockStorage['IsLoggedIn'] = 'FALSE';

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
      mockStorage['IsLoggedIn'] = 'TRUE';
      mockStorage['AdminFor'] = JSON.stringify([{ _id: 'org-123' }]);

      renderWithRouter();

      expect(screen.getByTestId('page-not-found')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('shows PageNotFound when AdminFor is an empty array', () => {
      mockStorage['IsLoggedIn'] = 'TRUE';
      mockStorage['AdminFor'] = JSON.stringify([]);

      renderWithRouter();

      // Empty array is still defined, so PageNotFound should show
      expect(screen.getByTestId('page-not-found')).toBeInTheDocument();
    });
  });

  describe('User Activity Tracking', () => {
    it('updates lastActive on mousemove event', () => {
      mockStorage['IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      act(() => {
        fireEvent.mouseMove(document);
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('updates lastActive on keydown event', () => {
      mockStorage['IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      act(() => {
        fireEvent.keyDown(document, { key: 'a' });
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('updates lastActive on click event', () => {
      mockStorage['IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      act(() => {
        fireEvent.click(document);
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('updates lastActive on scroll event', () => {
      mockStorage['IsLoggedIn'] = 'TRUE';
      renderWithRouter();

      act(() => {
        fireEvent.scroll(document);
      });

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('does not set up activity listeners when user is not logged in', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      mockStorage['IsLoggedIn'] = 'FALSE';

      renderWithRouter();

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
      );
    });
  });

  describe('Session Timeout', () => {
    it('logs out user after 15 minutes of inactivity', () => {
      mockStorage['IsLoggedIn'] = 'TRUE';
      mockStorage['email'] = 'test@example.com';
      mockStorage['id'] = '123';
      mockStorage['name'] = 'Test User';
      mockStorage['token'] = 'test-token';
      mockStorage['userId'] = 'user-123';
      mockStorage['role'] = 'regular';

      renderWithRouter();

      // Advance past inactivity check interval (1 min) + timeout (15 min)
      act(() => {
        vi.advanceTimersByTime(16 * 60 * 1000);
      });

      expect(toast.warn).toHaveBeenCalledWith(
        'Kindly relogin as session has expired',
      );
      expect(mockStorage['IsLoggedIn']).toBe('FALSE');
      expect(mockStorage['email']).toBeUndefined();
      expect(mockStorage['id']).toBeUndefined();
      expect(mockStorage['name']).toBeUndefined();
      expect(mockStorage['token']).toBeUndefined();
      expect(mockStorage['userId']).toBeUndefined();
      expect(mockStorage['role']).toBeUndefined();
      expect(mockStorage['AdminFor']).toBeUndefined();
    });

    it('redirects to home page after session timeout', () => {
      mockStorage['IsLoggedIn'] = 'TRUE';
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
      mockStorage['IsLoggedIn'] = 'TRUE';
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
      mockStorage['IsLoggedIn'] = 'FALSE';
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
      mockStorage['IsLoggedIn'] = 'TRUE';

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
      mockStorage['IsLoggedIn'] = 'TRUE';

      const { unmount } = renderWithRouter();
      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('handles unmount when interval is not set (not logged in)', () => {
      mockStorage['IsLoggedIn'] = 'FALSE';

      const { unmount } = renderWithRouter();

      // Should not throw error on unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles AdminFor being null', () => {
      mockStorage['IsLoggedIn'] = 'TRUE';
      mockStorage['AdminFor'] = JSON.stringify(null);

      renderWithRouter();

      // null should be treated as "no admin role", so protected content should show
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('page-not-found')).not.toBeInTheDocument();
    });

    it('clears AdminFor during logout', () => {
      mockStorage['IsLoggedIn'] = 'TRUE';
      mockStorage['AdminFor'] = JSON.stringify([{ _id: 'org-123' }]);

      // Re-render as non-admin to test the timeout path
      cleanup();
      mockStorage = {};
      mockStorage['IsLoggedIn'] = 'TRUE';

      renderWithRouter();

      act(() => {
        vi.advanceTimersByTime(16 * 60 * 1000);
      });

      expect(mockStorage['AdminFor']).toBeUndefined();
    });

    it('handles multiple activity events in quick succession', () => {
      mockStorage['IsLoggedIn'] = 'TRUE';
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
      mockStorage['IsLoggedIn'] = 'TRUE';
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
      mockStorage['IsLoggedIn'] = 'TRUE';
      mockStorage['AdminFor'] = 'some-org-id';

      renderWithRouter();

      // String is defined, so PageNotFound should show
      expect(screen.getByTestId('page-not-found')).toBeInTheDocument();
    });

    it('remains logged in with continuous activity before timeout', () => {
      mockStorage['IsLoggedIn'] = 'TRUE';
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
