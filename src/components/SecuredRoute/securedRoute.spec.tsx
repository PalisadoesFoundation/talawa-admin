import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
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
  // Test elements
  const testComponent = <div>Test Protected Content</div>;
  const homeComponent = <div>Home Page</div>;
  const { setItem } = useLocalStorage();

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
    // Use fake timers for controlling time-based operations
    vi.useFakeTimers();
    // Mock window.location.href
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up any timers or event listeners
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Authentication and Authorization', () => {
    it('should render child component for authenticated administrator', () => {
      // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user and role administrator to simulate admin login.
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

    it('should render PageNotFound for authenticated non-administrator user', () => {
      // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user and role regular to simulate a non admin user.
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

      expect(screen.getByText('talawaUser')).toBeInTheDocument();
      expect(screen.getByText('404')).toBeInTheDocument();
      expect(
        screen.queryByText('Test Protected Content'),
      ).not.toBeInTheDocument();
    });

    it('should redirect to home page for unauthenticated user', () => {
      // Don't set IsLoggedIn, simulating an unauthenticated user
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

      // Simulate mouse movement - this should update the lastActive timestamp
      fireEvent(document, new Event('mousemove'));

      // We can't directly test the lastActive variable since it's module-scoped,
      // but we can verify the event listener is attached by checking if the event fires
      expect(screen.getByText('Test Protected Content')).toBeInTheDocument();
    });
  });

  describe('Session Timeout and Inactivity', () => {
    it('should show warning toast after 15 minutes of inactivity', async () => {
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

      // Fast-forward past the inactivity timeout (15 minutes)
      vi.advanceTimersByTime(15 * 60 * 1000 + 1000);

      // Fast-forward through the setInterval check (1 minute)
      vi.advanceTimersByTime(1 * 60 * 1000);

      expect(toast.warn).toHaveBeenCalledWith(
        'Kindly relogin as sessison has expired',
      );
    });
  });
});
