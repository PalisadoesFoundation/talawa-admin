import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SidebarToggle from './SideToggle';
import styles from 'style/app-fixed.module.css';

describe('SidebarToggle', () => {
  let mockSetHideDrawer: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSetHideDrawer = vi.fn();
  });

  // Reset mock function after each test
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct classes when drawer is hidden', () => {
    render(
      <SidebarToggle hideDrawer={true} setHideDrawer={mockSetHideDrawer} />,
    );

    const button = screen.getByTestId('openMenu');
    expect(button).toHaveClass(styles.opendrawer);
  });

  it('renders with correct classes when drawer is visible', () => {
    render(
      <SidebarToggle hideDrawer={false} setHideDrawer={mockSetHideDrawer} />,
    );

    const button = screen.getByTestId('closeMenu');
    expect(button).toHaveClass(styles.collapseSidebarButton);
  });

  it('toggles drawer state when clicked (hidden to visible)', async () => {
    render(
      <SidebarToggle hideDrawer={true} setHideDrawer={mockSetHideDrawer} />,
    );

    const button = screen.getByTestId('openMenu');
    await userEvent.click(button);

    expect(mockSetHideDrawer).toHaveBeenCalledWith(false);
  });

  it('toggles drawer state when clicked (visible to hidden)', async () => {
    render(
      <SidebarToggle hideDrawer={false} setHideDrawer={mockSetHideDrawer} />,
    );

    const button = screen.getByTestId('closeMenu');
    await userEvent.click(button);

    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
  });

  it('renders correct icon when drawer is hidden', () => {
    render(
      <SidebarToggle hideDrawer={true} setHideDrawer={mockSetHideDrawer} />,
    );

    const icon = screen.getByTestId('openMenu').querySelector('i');
    expect(icon).toHaveClass('fa');
    expect(icon).toHaveClass('fa-angle-double-right');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders correct icon when drawer is visible', () => {
    render(
      <SidebarToggle hideDrawer={false} setHideDrawer={mockSetHideDrawer} />,
    );

    const icon = screen.getByTestId('closeMenu').querySelector('i');
    expect(icon).toHaveClass('fa');
    expect(icon).toHaveClass('fa-angle-double-left');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('handles null hideDrawer value', () => {
    render(
      <SidebarToggle hideDrawer={null} setHideDrawer={mockSetHideDrawer} />,
    );

    const button = screen.getByTestId('closeMenu');
    expect(button).toHaveClass(styles.collapseSidebarButton);
  });

  it('preserves button accessibility when drawer is hidden', () => {
    render(
      <SidebarToggle hideDrawer={true} setHideDrawer={mockSetHideDrawer} />,
    );

    const button = screen.getByTestId('openMenu');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toBeEnabled();
  });

  it('preserves button accessibility when drawer is visible', () => {
    render(
      <SidebarToggle hideDrawer={false} setHideDrawer={mockSetHideDrawer} />,
    );

    const button = screen.getByTestId('closeMenu');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toBeEnabled();
  });
});
