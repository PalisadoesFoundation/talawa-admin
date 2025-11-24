import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { toast } from 'react-toastify';
import SecuredRouteForUser from './SecuredRouteForUser';

const PREFIX = 'Talawa-admin';
let storage: Record<string, string> = {};

// Write (stringify like real localStorage)
const setItem = (key: string, value: unknown) => {
  const fullKey = `${PREFIX}_${key}`;
  storage[fullKey] = JSON.stringify(value);
};

// Read (parse like real localStorage)
const getItem = (key: string) => {
  const fullKey = `${PREFIX}_${key}`;
  if (!Object.prototype.hasOwnProperty.call(storage, fullKey)) return null;

  try {
    return JSON.parse(storage[fullKey]);
  } catch {
    return null;
  }
};

// Remove
const removeItem = (key: string) => {
  const fullKey = `${PREFIX}_${key}`;
  delete storage[fullKey];
};

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem,
    setItem,
    removeItem,
  }),
}));

// Mock toast
vi.mock('react-toastify', () => ({
  toast: { warn: vi.fn() },
}));

const TestComponent = () => <div>Test Protected Content</div>;

describe('SecuredRouteForUser', () => {
  const originalLocation = window.location;
  let hrefValue = '';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    storage = {};

    hrefValue = '';
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        get href() {
          return hrefValue;
        },
        set href(v: string) {
          hrefValue = v;
        },
        assign(url: string | URL) {
          hrefValue = typeof url === 'string' ? url : url.toString();
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('renders the route when logged in', () => {
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

  it('redirects when NOT logged in', () => {
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

  // ---------------------------
  // Mouse Activity Tracking
  // ---------------------------
  it('registers activity tracking handlers on mount', () => {
    setItem('IsLoggedIn', 'TRUE');
    removeItem('AdminFor');

    const addEventSpy = vi.spyOn(document, 'addEventListener');

    render(
      <MemoryRouter initialEntries={['/user/organizations']}>
        <Routes>
          <Route element={<SecuredRouteForUser />}>
            <Route path="/user/organizations" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // Verify activity listeners were registered
    expect(addEventSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(addEventSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(addEventSpy).toHaveBeenCalledWith('click', expect.any(Function));
    expect(addEventSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    // Optional cleanup check
    addEventSpy.mockRestore();
  });

  it('clears session after timeout', () => {
    setItem('IsLoggedIn', 'TRUE');
    setItem('email', 'test@example.com');
    setItem('id', '123');
    setItem('name', 'Test User');
    setItem('role', 'regular');
    setItem('token', 'test-token');
    setItem('userId', 'user-123');
    setItem('AdminFor', [{ _id: 'org-123' }]);

    render(
      <MemoryRouter initialEntries={['/user/organizations']}>
        <Routes>
          <Route element={<SecuredRouteForUser />}>
            <Route path="/user/organizations" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // fire inactivity timeout
    vi.advanceTimersByTime(16 * 60 * 1000);

    expect(toast.warn).toHaveBeenCalledWith(
      'Kindly relogin as session has expired',
    );

    // fire the 1-second redirect timeout
    vi.advanceTimersByTime(1000);

    expect(window.location.href).toBe('/');

    expect(getItem('IsLoggedIn')).toBe('FALSE');
    expect(getItem('email')).toBeNull();
    expect(getItem('id')).toBeNull();
    expect(getItem('name')).toBeNull();
    expect(getItem('role')).toBeNull();
    expect(getItem('token')).toBeNull();
    expect(getItem('userId')).toBeNull();
    expect(getItem('AdminFor')).toBeNull();
  });
});
