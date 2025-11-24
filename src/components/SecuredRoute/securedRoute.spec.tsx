import React from 'react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';

vi.mock('screens/PageNotFound/PageNotFound', () => ({
  default: () => (
    <div>
      <span>talawaUser</span>
      <span>404</span>
    </div>
  ),
}));

import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen, fireEvent } from '@testing-library/react';
import SecuredRoute from './SecuredRoute';
import useLocalStorage from 'utils/useLocalstorage';
import { toast } from 'react-toastify';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  },
}));

describe('SecuredRoute', () => {
  const testComponent = <div>Test Protected Content</div>;
  const homeComponent = <div>Home Page</div>;
  const { setItem } = useLocalStorage();

  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();

    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { href: '' },
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  describe('Authentication and Authorization', () => {
    it('should render child component for authenticated administrator', () => {
      setItem('IsLoggedIn', 'TRUE');
      setItem('role', 'administrator');

      render(
        <MemoryRouter initialEntries={['/orglist']}>
          <Routes>
            <Route element={<SecuredRoute />}>
              <Route path="/orglist" element={testComponent} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('Test Protected Content')).toBeInTheDocument();
    });

    it('should render PageNotFound for authenticated non-administrator user', async () => {
      vi.useRealTimers();

      setItem('IsLoggedIn', 'TRUE');
      setItem('role', 'regular');

      render(
        <MemoryRouter initialEntries={['/orglist']}>
          <Routes>
            <Route element={<SecuredRoute />}>
              <Route path="/orglist" element={testComponent} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(await screen.findByText(/talawaUser/i)).toBeInTheDocument();
      expect(await screen.findByText(/404/i)).toBeInTheDocument();
      expect(
        screen.queryByText('Test Protected Content'),
      ).not.toBeInTheDocument();

      vi.useFakeTimers();
    });

    it('should redirect to home page for unauthenticated user', () => {
      render(
        <MemoryRouter initialEntries={['/orglist']}>
          <Routes>
            <Route path="/" element={homeComponent} />
            <Route element={<SecuredRoute />}>
              <Route path="/orglist" element={testComponent} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('Home Page')).toBeInTheDocument();
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
        <MemoryRouter initialEntries={['/orglist']}>
          <Routes>
            <Route element={<SecuredRoute />}>
              <Route path="/orglist" element={testComponent} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      fireEvent(document, new Event('mousemove'));

      expect(screen.getByText('Test Protected Content')).toBeInTheDocument();
    });

    it('should prevent timeout when user activity occurs within timeout window', () => {
      setItem('IsLoggedIn', 'TRUE');
      setItem('role', 'administrator');
      setItem('token', 'test-token');

      render(
        <MemoryRouter initialEntries={['/orglist']}>
          <Routes>
            <Route element={<SecuredRoute />}>
              <Route path="/orglist" element={testComponent} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      vi.advanceTimersByTime(14 * 60 * 1000);
      fireEvent(document, new Event('mousemove'));
      vi.advanceTimersByTime(2 * 60 * 1000);

      const storage = useLocalStorage();
      expect(storage.getItem('IsLoggedIn')).toBe('TRUE');
      expect(storage.getItem('token')).toBe('test-token');
      expect(toast.warn).not.toHaveBeenCalled();
    });
  });

  describe('Session Timeout and Inactivity', () => {
    it('should show warning toast after 15 minutes of inactivity', () => {
      setItem('IsLoggedIn', 'TRUE');
      setItem('role', 'administrator');
      setItem('token', 'test-token');
      setItem('userId', 'user-123');
      setItem('email', 'admin@example.com');
      setItem('name', 'Admin User');
      setItem('id', 'admin-123');

      render(
        <MemoryRouter initialEntries={['/orglist']}>
          <Routes>
            <Route element={<SecuredRoute />}>
              <Route path="/orglist" element={testComponent} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      vi.advanceTimersByTime(15 * 60 * 1000 + 1000);
      vi.advanceTimersByTime(1 * 60 * 1000);

      expect(toast.warn).toHaveBeenCalledWith(
        'Kindly relogin as sessison has expired',
      );

      const storage = useLocalStorage();
      expect(storage.getItem('IsLoggedIn')).toBe('FALSE');
      expect(storage.getItem('token')).toBeNull();
      expect(window.location.href).toBe('/');
    });
  });
});
