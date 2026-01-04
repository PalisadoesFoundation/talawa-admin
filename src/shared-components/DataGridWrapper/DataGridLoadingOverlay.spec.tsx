/**
 * Test suite for DataGridLoadingOverlay component.
 *
 * Tests cover:
 * - Rendering LoadingState component
 * - Correct props passed to LoadingState
 * - Proper variant, size, and loading state
 * - Empty children rendering
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataGridLoadingOverlay } from './DataGridLoadingOverlay';

// Mock LoadingState component
vi.mock('../LoadingState/LoadingState', () => ({
  default: ({
    isLoading,
    variant,
    size,
    children,
  }: {
    isLoading: boolean;
    variant: string;
    size: string;
    children: React.ReactNode;
  }) => (
    <div
      data-testid="loading-state"
      data-is-loading={isLoading}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </div>
  ),
}));

describe('DataGridLoadingOverlay Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render LoadingState component', () => {
    render(<DataGridLoadingOverlay />);

    const loadingState = screen.getByTestId('loading-state');
    expect(loadingState).toBeInTheDocument();
  });

  it('should pass isLoading={true} to LoadingState', () => {
    render(<DataGridLoadingOverlay />);

    const loadingState = screen.getByTestId('loading-state');
    expect(loadingState).toHaveAttribute('data-is-loading', 'true');
  });

  it('should pass variant="inline" to LoadingState', () => {
    render(<DataGridLoadingOverlay />);

    const loadingState = screen.getByTestId('loading-state');
    expect(loadingState).toHaveAttribute('data-variant', 'inline');
  });

  it('should pass size="lg" to LoadingState', () => {
    render(<DataGridLoadingOverlay />);

    const loadingState = screen.getByTestId('loading-state');
    expect(loadingState).toHaveAttribute('data-size', 'lg');
  });

  it('should render empty fragment as children', () => {
    render(<DataGridLoadingOverlay />);

    const loadingState = screen.getByTestId('loading-state');
    // Empty fragment renders as empty content
    expect(loadingState.textContent).toBe('');
    expect(loadingState.children).toHaveLength(0);
  });

  it('should be compatible with MUI DataGrid slot component interface', () => {
    // Test that the component can be rendered without any props
    // This simulates how MUI DataGrid would use it as a slot component
    expect(() => render(<DataGridLoadingOverlay />)).not.toThrow();
  });

  it('should always return JSX.Element', () => {
    const result = render(<DataGridLoadingOverlay />);
    expect(result.container).toBeInTheDocument();
  });
});
