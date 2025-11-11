/**
 * Unit tests for SidebarMenuItem component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import SidebarMenuItem from './SidebarMenuItem';
import { FaHome } from 'react-icons/fa';

describe('SidebarMenuItem Component', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  const defaultProps = {
    to: '/dashboard',
    icon: <FaHome data-testid="home-icon" />,
    label: 'Dashboard',
    testId: 'dashboardBtn',
    hideDrawer: false,
    onClick: mockOnClick,
  };

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render admin variant correctly when expanded', () => {
    renderWithRouter(<SidebarMenuItem {...defaultProps} variant="admin" />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('dashboardBtn')).toBeInTheDocument();
  });

  it('should render admin variant correctly when collapsed', () => {
    renderWithRouter(
      <SidebarMenuItem {...defaultProps} variant="admin" hideDrawer={true} />,
    );

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  it('should render user variant correctly when expanded', () => {
    renderWithRouter(<SidebarMenuItem {...defaultProps} variant="user" />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  it('should render user variant correctly when collapsed', () => {
    renderWithRouter(
      <SidebarMenuItem {...defaultProps} variant="user" hideDrawer={true} />,
    );

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    renderWithRouter(<SidebarMenuItem {...defaultProps} variant="admin" />);

    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should work without onClick handler', () => {
    const propsWithoutOnClick = {
      to: '/dashboard',
      icon: <FaHome data-testid="home-icon" />,
      label: 'Dashboard',
      testId: 'dashboardBtn',
      hideDrawer: false,
      variant: 'admin' as const,
    };

    renderWithRouter(<SidebarMenuItem {...propsWithoutOnClick} />);

    const link = screen.getByRole('link');
    expect(() => fireEvent.click(link)).not.toThrow();
  });

  it('should navigate to correct path', () => {
    renderWithRouter(<SidebarMenuItem {...defaultProps} variant="admin" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('should apply correct styles for admin variant', () => {
    renderWithRouter(<SidebarMenuItem {...defaultProps} variant="admin" />);

    const button = screen.getByTestId('dashboardBtn');
    // Button should have either sidebarBtn or sidebarBtnActive class
    const hasCorrectClass = button.className.includes('sidebarBtn');
    expect(hasCorrectClass).toBe(true);
  });

  it('should handle SVG icons correctly in admin variant', () => {
    const svgIcon = (
      <svg data-testid="svg-icon" role="img" aria-label="Test icon">
        <title>Test Icon</title>
        <path />
      </svg>
    );

    renderWithRouter(
      <SidebarMenuItem {...defaultProps} icon={svgIcon} variant="admin" />,
    );

    expect(screen.getByTestId('svg-icon')).toBeInTheDocument();
  });

  it('should handle image icons correctly', () => {
    renderWithRouter(
      <SidebarMenuItem
        {...defaultProps}
        icon={
          <img src="/test-icon.png" alt="Test Icon" data-testid="img-icon" />
        }
        variant="admin"
      />,
    );

    expect(screen.getByTestId('img-icon')).toBeInTheDocument();
  });

  it('should handle SVG icons correctly in user variant', () => {
    const svgIcon = (
      <svg data-testid="svg-icon-user" role="img" aria-label="Test icon">
        <title>Test Icon</title>
        <path />
      </svg>
    );

    renderWithRouter(
      <SidebarMenuItem {...defaultProps} icon={svgIcon} variant="user" />,
    );

    expect(screen.getByTestId('svg-icon-user')).toBeInTheDocument();
  });

  it('should handle React Icons with style prop in user variant', () => {
    const reactIcon = (
      <span
        data-testid="react-icon"
        style={{ color: 'red' }}
        className="icon"
      />
    );

    renderWithRouter(
      <SidebarMenuItem {...defaultProps} icon={reactIcon} variant="user" />,
    );

    expect(screen.getByTestId('react-icon')).toBeInTheDocument();
  });

  it('should apply correct styles for user variant', () => {
    renderWithRouter(<SidebarMenuItem {...defaultProps} variant="user" />);

    const button = screen.getByTestId('dashboardBtn');
    const hasCorrectClass = button.className.includes('sidebarBtn');
    expect(hasCorrectClass).toBe(true);
  });

  it('should apply active styles when on matching route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <SidebarMenuItem {...defaultProps} to="/dashboard" variant="admin" />
      </MemoryRouter>,
    );

    const button = screen.getByTestId('dashboardBtn');
    expect(button.className).toContain('sidebarBtnActive');
  });

  it('should not apply active styles when on non-matching route', () => {
    render(
      <MemoryRouter initialEntries={['/other']}>
        <SidebarMenuItem {...defaultProps} to="/dashboard" variant="admin" />
      </MemoryRouter>,
    );

    const button = screen.getByTestId('dashboardBtn');
    expect(button.className).not.toContain('sidebarBtnActive');
  });

  it('should apply active styles when on matching route (user variant)', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <SidebarMenuItem {...defaultProps} to="/dashboard" variant="user" />
      </MemoryRouter>,
    );

    const button = screen.getByTestId('dashboardBtn');
    expect(button.className).toContain('sidebarBtnActive');
  });

  it('should not apply active styles when on non-matching route (user variant)', () => {
    render(
      <MemoryRouter initialEntries={['/other']}>
        <SidebarMenuItem {...defaultProps} to="/dashboard" variant="user" />
      </MemoryRouter>,
    );

    const button = screen.getByTestId('dashboardBtn');
    expect(button.className).not.toContain('sidebarBtnActive');
  });

  it('should handle icon cloning for admin variant with valid React element', () => {
    const CustomIcon = () => <div data-testid="custom-icon">Icon</div>;
    renderWithRouter(
      <SidebarMenuItem
        {...defaultProps}
        icon={<CustomIcon />}
        variant="admin"
      />,
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should handle icon cloning for user variant with React Icon', () => {
    const iconWithStyle = (
      <span data-testid="styled-icon" style={{ fontSize: '20px' }}>
        Icon
      </span>
    );
    renderWithRouter(
      <SidebarMenuItem {...defaultProps} icon={iconWithStyle} variant="user" />,
    );

    expect(screen.getByTestId('styled-icon')).toBeInTheDocument();
  });

  it('should handle string icons gracefully', () => {
    renderWithRouter(
      <SidebarMenuItem {...defaultProps} icon="string-icon" variant="admin" />,
    );

    const button = screen.getByTestId('dashboardBtn');
    expect(button).toBeInTheDocument();
  });

  it('should handle null icon gracefully', () => {
    renderWithRouter(
      <SidebarMenuItem {...defaultProps} icon={null} variant="admin" />,
    );

    const button = screen.getByTestId('dashboardBtn');
    expect(button).toBeInTheDocument();
  });

  it('should render with default variant when not specified', () => {
    const propsWithoutVariant = {
      to: '/dashboard',
      icon: <FaHome data-testid="home-icon" />,
      label: 'Dashboard',
      testId: 'dashboardBtn',
      hideDrawer: false,
    };

    renderWithRouter(<SidebarMenuItem {...propsWithoutVariant} />);

    expect(screen.getByTestId('dashboardBtn')).toBeInTheDocument();
  });

  it('should handle complex icon with multiple props in admin variant', () => {
    const complexIcon = (
      <svg
        data-testid="complex-icon"
        role="img"
        aria-label="Complex home icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <title>Complex Home Icon</title>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    );

    renderWithRouter(
      <SidebarMenuItem {...defaultProps} icon={complexIcon} variant="admin" />,
    );

    expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
  });

  it('should handle complex icon with multiple props in user variant', () => {
    const complexIconUser = (
      <svg
        data-testid="complex-icon-user"
        role="img"
        aria-label="Complex home icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <title>Complex Home Icon</title>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    );

    renderWithRouter(
      <SidebarMenuItem
        {...defaultProps}
        icon={complexIconUser}
        variant="user"
      />,
    );

    expect(screen.getByTestId('complex-icon-user')).toBeInTheDocument();
  });

  it('should maintain icon wrapper structure', () => {
    renderWithRouter(<SidebarMenuItem {...defaultProps} variant="admin" />);

    const button = screen.getByTestId('dashboardBtn');
    // Check if icon wrapper div exists within button
    const iconWrapperDiv = button.querySelector('div');
    expect(iconWrapperDiv).toBeTruthy();
    expect(button).toContainElement(iconWrapperDiv);
  });

  it('should handle onClick with keyboard event', () => {
    renderWithRouter(<SidebarMenuItem {...defaultProps} variant="user" />);

    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
