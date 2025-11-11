import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SidebarMenuItem from './SidebarMenuItem';
import { FaHome } from 'react-icons/fa';

/**
 * Unit tests for the `SidebarMenuItem` component.
 *
 * The tests ensure the `SidebarMenuItem` component renders correctly with various props.
 * Mocked dependencies are used to isolate the component and verify its behavior.
 *
 */

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SidebarMenuItem Component', () => {
  const defaultProps = {
    to: '/dashboard',
    icon: <FaHome data-testid="home-icon" />,
    label: 'Dashboard',
    testId: 'dashboardBtn',
    hideDrawer: false,
    variant: 'admin' as const,
  };

  test('should render admin variant correctly', () => {
    renderWithRouter(<SidebarMenuItem {...defaultProps} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('dashboardBtn')).toBeInTheDocument();
  });

  test('should render user variant correctly', () => {
    renderWithRouter(<SidebarMenuItem {...defaultProps} variant="user" />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  test('should navigate to correct path', () => {
    renderWithRouter(<SidebarMenuItem {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
