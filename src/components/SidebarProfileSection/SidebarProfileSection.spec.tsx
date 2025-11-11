import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import SidebarProfileSection from './SidebarProfileSection';

/**
 * Unit tests for the `SidebarProfileSection` component.
 *
 * The tests ensure the `SidebarProfileSection` component renders correctly with various props.
 * Mocked dependencies are used to isolate the component and verify its behavior.
 *
 */

describe('SidebarProfileSection Component', () => {
  test('should render when expanded', () => {
    render(<SidebarProfileSection hideDrawer={false} />);

    // Component should render without errors
    expect(screen.getByTestId('sidebar-profile-section')).toBeInTheDocument();
  });

  test('should render when collapsed', () => {
    render(<SidebarProfileSection hideDrawer={true} />);

    // Component should render without errors even when collapsed
    expect(screen.getByTestId('sidebar-profile-section')).toBeInTheDocument();
  });
});
