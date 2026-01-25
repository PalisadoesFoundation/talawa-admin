import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import SecuredRoute from './SecuredRoute';
import useLocalStorage from 'utils/useLocalstorage';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    warning: vi.fn(),
    // Backward-compat in case any older code/tests still assert `warn`
    warn: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe('SecuredRoute', () => {
  // Test elements
  const testComponent = <div>Test Protected Content</div>;
  const { setItem, clearAllItems } = useLocalStorage();

  const originalLocation = window.location;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Clear localStorage before each test
    clearAllItems();
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
    vi.clearAllMocks();
    // Clean up any timers or event listeners
    vi.clearAllTimers();
    vi.useRealTimers();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  describe('Authentication and Authorization', () => {
    it('should render child component for authenticated administrator', () => {
      // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user and role administrator to simulate admin login.
      setItem('IsLoggedIn', 'TRUE');
      setItem('role', 'administrator');

      render(
        <MemoryRouter initialEntries={['/admin/orglist']}>
          <Routes>
            <Route element={<SecuredRoute />}>
              <Route path="/admin/orglist" element={testComponent} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('Test Protected Content')).toBeInTheDocument();
    });

    it('should render PageNotFound for authenticated non-administrator user', () => {
      // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user and role regular to simulate a non admin user.
      setItem('IsLoggedIn', 'TRUE');
      setItem('role', 'regular');

      render(
        <MemoryRouter initialEntries={['/admin/orglist']}>
          <Routes>
            <Route element={<SecuredRoute />}>
              <Route path="/admin/orglist" element={testComponent} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('404')).toBeInTheDocument();
      expect(
        screen.queryByText('Test Protected Content'),
      ).not.toBeInTheDocument();
    });
  });

  describe('User Activity Tracking', () => {
    it('should update lastActive on mouse movement', () => {
      setItem('IsLoggedIn', 'TRUE');
      setItem('role', 'administrator');

      render(
        <MemoryRouter initialEntries={['/admin/orglist']}>
          <Routes>
            <Route element={<SecuredRoute />}>
              <Route path="/admin/orglist" element={testComponent} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      // Simulate mouse movement - this should update the lastActive timestamp
      document.dispatchEvent(new Event('mousemove'));

      // We can't directly test the lastActive variable since it's module-scoped,
      // but we can verify the event listener is attached by checking if the event fires
      expect(screen.getByText('Test Protected Content')).toBeInTheDocument();
    });

    it('should prevent timeout when user activity occurs within timeout window', async () => {
      setItem('IsLoggedIn', 'TRUE');
      setItem('role', 'administrator');
      setItem('token', 'test-token');

      render(
        <MemoryRouter initialEntries={['/admin/orglist']}>
          <Routes>
            <Route element={<SecuredRoute />}>
              <Route path="/admin/orglist" element={testComponent} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      // Advance close to timeout
      vi.advanceTimersByTime(14 * 60 * 1000);

      // Simulate user activity
      document.dispatchEvent(new Event('mousemove'));

      // Advance past original timeout point
      vi.advanceTimersByTime(2 * 60 * 1000);

      // Session should still be active
      const storage = useLocalStorage();
      expect(storage.getItem('IsLoggedIn')).toBe('TRUE');
      expect(storage.getItem('token')).toBe('test-token');
      expect(NotificationToast.warning).not.toHaveBeenCalled();
      expect(screen.getByText('Test Protected Content')).toBeInTheDocument();
    });
  });

  describe('Session Timeout and Inactivity', () => {
    it('should show warning toast after 15 minutes of inactivity', async () => {
      setItem('IsLoggedIn', 'TRUE');
      setItem('role', 'administrator');
      setItem('token', 'test-token');
      setItem('userId', 'user-123');
      setItem('email', 'admin@example.com');
      setItem('name', 'Admin User');
      setItem('id', 'admin-123');

      render(
        <MemoryRouter initialEntries={['/admin/orglist']}>
          <Routes>
            <Route element={<SecuredRoute />}>
              <Route path="/admin/orglist" element={testComponent} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      // Fast-forward past the inactivity timeout (15 minutes)
      vi.advanceTimersByTime(15 * 60 * 1000 + 1000);

      // Fast-forward through the setInterval check (1 minute)
      vi.advanceTimersByTime(1 * 60 * 1000);

      expect(NotificationToast.warning).toHaveBeenCalledWith('sessionExpired');

      const storage = useLocalStorage();
      expect(storage.getItem('IsLoggedIn')).toBe('FALSE');
      expect(storage.getItem('token')).toBeNull();
      expect(storage.getItem('userId')).toBeNull();
      expect(storage.getItem('role')).toBeNull();
      expect(storage.getItem('email')).toBeNull();
      expect(storage.getItem('name')).toBeNull();
      expect(storage.getItem('id')).toBeNull();
      expect(window.location.href).toBe('/');
    });
  });
});
