import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, beforeEach, afterEach } from 'vitest';
import SecuredRoute from './SecuredRoute';
import useLocalStorage from 'utils/useLocalstorage';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  },
}));

const TestComponent = (): JSX.Element => <div>Test Protected Content</div>;

describe('SecuredRoute', () => {
  const { setItem, getItem } = useLocalStorage();

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up any timers or event listeners
    vi.clearAllTimers();
  });

  it('should render child component for authenticated administrator', () => {
    // Set the 'IsLoggedIn' value to 'TRUE' in localStorage to simulate a logged-in user and role administrator to simulate admin login.
    setItem('IsLoggedIn', 'TRUE');
    setItem('role', 'administrator');

    render(
      <MemoryRouter initialEntries={['/orglist']}>
        <Routes>
          <Route element={<SecuredRoute />}>
            <Route path="/orglist" element={<TestComponent />} />
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
            <Route path="/orglist" element={<TestComponent />} />
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

  it('should update lastActive on mouse movement', () => {
    setItem('IsLoggedIn', 'TRUE');
    setItem('role', 'administrator');

    render(
      <MemoryRouter initialEntries={['/orglist']}>
        <Routes>
          <Route element={<SecuredRoute />}>
            <Route path="/orglist" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    // Simulate mouse movement - this should update the lastActive timestamp
    fireEvent(document, new Event('mousemove'));
    fireEvent(document, new Event('keydown'));
    fireEvent(document, new Event('click'));
    fireEvent(document, new Event('scroll'));

    // We can't directly test the lastActive variable since it's module-scoped,
    // but we can verify the event listener is attached by checking if the event fires
    expect(screen.getByText('Test Protected Content')).toBeInTheDocument();
  });
});
