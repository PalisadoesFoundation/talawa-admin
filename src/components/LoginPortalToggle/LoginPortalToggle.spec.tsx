import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import LoginPortalToggle from './LoginPortalToggle';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Helper function to render the LoginPortalToggle component with all required providers.
 * @param onToggle - Mock function to track toggle callbacks
 * @returns The rendered component utilities
 */
const renderComponent = (onToggle: ReturnType<typeof vi.fn>) => {
  return render(
    <BrowserRouter>
      <Provider store={store}>
        <I18nextProvider i18n={i18nForTest}>
          <LoginPortalToggle onToggle={onToggle} />
        </I18nextProvider>
      </Provider>
    </BrowserRouter>,
  );
};

describe('Testing LoginPortalToggle component', () => {
  let mockOnToggle: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnToggle = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  test('Component should render properly with admin and user links', () => {
    renderComponent(mockOnToggle);

    // Verify both navigation links are rendered (case-insensitive)
    const adminLink = screen.getByText(/admin/i);
    const userLink = screen.getByText(/user/i);

    expect(adminLink).toBeInTheDocument();
    expect(userLink).toBeInTheDocument();
  });

  test('Admin link should be active by default', () => {
    renderComponent(mockOnToggle);

    const adminLink = screen.getByText(/admin/i);
    const userLink = screen.getByText(/user/i);

    // Admin link should have active class by default
    expect(adminLink.className).toContain('activeLink');
    // User link should not have active class initially
    expect(userLink.className).not.toContain('activeLink');
  });

  test('Clicking admin link should call onToggle with "admin"', () => {
    renderComponent(mockOnToggle);

    const adminLink = screen.getByText(/admin/i);
    fireEvent.click(adminLink);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith('admin');
  });

  test('Clicking user link should call onToggle with "user"', () => {
    renderComponent(mockOnToggle);

    const userLink = screen.getByText(/user/i);
    fireEvent.click(userLink);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith('user');
  });

  test('Clicking user link should update active state to user', () => {
    renderComponent(mockOnToggle);

    const adminLink = screen.getByText(/admin/i);
    const userLink = screen.getByText(/user/i);

    // Click user link
    fireEvent.click(userLink);

    // User link should now have active class
    expect(userLink.className).toContain('activeLink');
    // Admin link should no longer have active class
    expect(adminLink.className).not.toContain('activeLink');
  });

  test('Clicking admin link after user should update active state back to admin', () => {
    renderComponent(mockOnToggle);

    const adminLink = screen.getByText(/admin/i);
    const userLink = screen.getByText(/user/i);

    // First click user link
    fireEvent.click(userLink);
    expect(userLink.className).toContain('activeLink');
    expect(adminLink.className).not.toContain('activeLink');

    // Then click admin link
    fireEvent.click(adminLink);
    expect(adminLink.className).toContain('activeLink');
    expect(userLink.className).not.toContain('activeLink');

    // onToggle should have been called twice
    expect(mockOnToggle).toHaveBeenCalledTimes(2);
    expect(mockOnToggle).toHaveBeenNthCalledWith(1, 'user');
    expect(mockOnToggle).toHaveBeenNthCalledWith(2, 'admin');
  });

  test('Multiple toggles should correctly update active state', () => {
    renderComponent(mockOnToggle);

    const adminLink = screen.getByText(/admin/i);
    const userLink = screen.getByText(/user/i);

    // Toggle multiple times
    fireEvent.click(userLink);
    fireEvent.click(adminLink);
    fireEvent.click(userLink);

    // Final state should have user active
    expect(userLink.className).toContain('activeLink');
    expect(adminLink.className).not.toContain('activeLink');
    expect(mockOnToggle).toHaveBeenCalledTimes(3);
  });
});
