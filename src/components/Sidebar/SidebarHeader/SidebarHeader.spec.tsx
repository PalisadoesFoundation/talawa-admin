/**
 * Unit tests for SidebarHeader component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SidebarHeader from './SidebarHeader';
import useLocalStorage from 'utils/useLocalstorage';

vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(),
}));

describe('SidebarHeader Component', () => {
  const mockSetHideDrawer = vi.fn();
  const mockSetItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLocalStorage).mockReturnValue({
      setItem: mockSetItem,
      getItem: vi.fn(),
      removeItem: vi.fn(),
      getStorageKey: vi.fn(),
    });
  });

  it('should render with expanded state', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={false}
      />,
    );

    expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render with collapsed state', () => {
    const { container } = render(
      <SidebarHeader
        hideDrawer={true}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={false}
      />,
    );

    // Title should be hidden via CSS display: none
    const titleContainer = container.querySelector(
      'div[style*="display: none"]',
    );
    expect(titleContainer).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should toggle sidebar on button click', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={false}
      />,
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    expect(mockSetItem).not.toHaveBeenCalled();
  });

  it('should persist state to localStorage when persistState is true', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={true}
      />,
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
    expect(mockSetItem).toHaveBeenCalledWith('sidebar', 'true');
  });

  it('should toggle sidebar on Enter key press', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={false}
      />,
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.keyDown(toggleButton, { key: 'Enter' });

    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
  });

  it('should toggle sidebar on Space key press', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={false}
      />,
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.keyDown(toggleButton, { key: ' ' });

    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
  });

  it('should not toggle sidebar on other key press', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={false}
      />,
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.keyDown(toggleButton, { key: 'a' });

    expect(mockSetHideDrawer).not.toHaveBeenCalled();
  });

  it('should have correct accessibility attributes', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={false}
      />,
    );

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveAttribute('aria-label', 'Toggle sidebar');
    expect(toggleButton).toHaveAttribute('tabIndex', '0');
  });

  it('should persist state when toggling from collapsed to expanded', () => {
    render(
      <SidebarHeader
        hideDrawer={true}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={true}
      />,
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(mockSetHideDrawer).toHaveBeenCalledWith(false);
    expect(mockSetItem).toHaveBeenCalledWith('sidebar', 'false');
  });

  it('should render logo and portal title', () => {
    const { container } = render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={false}
      />,
    );

    // Logo is an SVG component, check for its presence
    const logoSvg = container.querySelector('svg');
    expect(logoSvg).toBeInTheDocument();
    expect(screen.getByText('Talawa Admin Portal')).toBeInTheDocument();
  });

  it('should handle multiple rapid toggles', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={true}
      />,
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);

    expect(mockSetHideDrawer).toHaveBeenCalledTimes(3);
    expect(mockSetItem).toHaveBeenCalledTimes(3);
  });

  it('should render with different portal titles', () => {
    const { rerender } = render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Admin Portal"
        persistState={false}
      />,
    );

    expect(screen.getByText('Admin Portal')).toBeInTheDocument();

    rerender(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="User Portal"
        persistState={false}
      />,
    );

    expect(screen.getByText('User Portal')).toBeInTheDocument();
  });

  it('should maintain button type attribute', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={false}
      />,
    );

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveAttribute('type', 'button');
  });

  it('should handle keyboard and mouse events correctly', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={false}
      />,
    );

    const toggleButton = screen.getByRole('button');

    // Mouse click
    fireEvent.click(toggleButton);
    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);

    mockSetHideDrawer.mockClear();

    // Keyboard Enter
    fireEvent.keyDown(toggleButton, { key: 'Enter' });
    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
  });

  it('should not persist when persistState is false', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
        persistState={false}
      />,
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(mockSetItem).not.toHaveBeenCalled();
  });

  it('should handle undefined persistState prop', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Talawa Admin Portal"
      />,
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
  });
});
