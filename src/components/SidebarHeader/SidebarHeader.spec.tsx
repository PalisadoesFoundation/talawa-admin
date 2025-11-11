import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import SidebarHeader from './SidebarHeader';

/**
 * Unit tests for the `SidebarHeader` component.
 *
 * The tests ensure the `SidebarHeader` component renders correctly with various props.
 * Mocked dependencies are used to isolate the component and verify its behavior.
 *
 */

vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(() => ({
    setItem: vi.fn(),
    getItem: vi.fn(),
  })),
}));

describe('SidebarHeader Component', () => {
  const mockSetHideDrawer = vi.fn();

  test('should render correctly with portal title', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Test Portal"
      />,
    );

    expect(screen.getByText('Test Portal')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('should handle toggle button click', () => {
    render(
      <SidebarHeader
        hideDrawer={false}
        setHideDrawer={mockSetHideDrawer}
        portalTitle="Test Portal"
      />,
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(mockSetHideDrawer).toHaveBeenCalled();
  });
});
