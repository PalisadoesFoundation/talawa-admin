/**
 * Test suite for LoadingState component.
 *
 * Tests cover:
 * - Rendering children when not loading
 * - Showing spinner when loading
 * - Different variants (spinner, inline)
 * - Different sizes (sm, lg, xl)
 * - Accessibility attributes
 * - Interaction blocking
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LoadingState from './LoadingState';
import { InterfaceTableLoader } from 'components/TableLoader/TableLoader';

// Mock TableLoader component
vi.mock('components/TableLoader/TableLoader', () => ({
  default: ({
    noOfRows,
    headerTitles,
    'data-testid': dataTestId,
  }: InterfaceTableLoader) => (
    <div data-testid={dataTestId || 'mock-table-loader'}>
      <div data-testid="table-headers">{JSON.stringify(headerTitles)}</div>
      <div data-testid="table-rows-count">{noOfRows}</div>
    </div>
  ),
}));

describe('LoadingState Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render children when not loading', () => {
      render(
        <LoadingState isLoading={false}>
          <div data-testid="test-content">Test Content</div>
        </LoadingState>,
      );

      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('should show spinner when loading', () => {
      render(
        <LoadingState isLoading={true}>
          <div data-testid="test-content">Test Content</div>
        </LoadingState>,
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    });

    it('should use custom data-testid when provided', () => {
      render(
        <LoadingState isLoading={true} data-testid="custom-loading">
          <div>Content</div>
        </LoadingState>,
      );

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render spinner variant by default', () => {
      render(
        <LoadingState isLoading={true}>
          <div data-testid="test-content">Test Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByTestId('loading-state');
      expect(loadingState).toBeInTheDocument();
      // Spinner variant should have the loading container class
      expect(loadingState.className).toContain('loadingContainer');
    });

    it('should render spinner variant when explicitly specified', () => {
      render(
        <LoadingState isLoading={true} variant="spinner">
          <div data-testid="test-content">Test Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByTestId('loading-state');
      expect(loadingState).toBeInTheDocument();
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should render inline variant', () => {
      render(
        <LoadingState isLoading={true} variant="inline">
          <div data-testid="test-content">Test Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByTestId('loading-state');
      expect(loadingState).toBeInTheDocument();
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      // Inline variant should not have children rendered
      expect(screen.queryByTestId('test-content')).not.toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render with xl size by default', () => {
      render(
        <LoadingState isLoading={true}>
          <div>Content</div>
        </LoadingState>,
      );

      const spinner = screen.getByTestId('spinner');
      expect(spinner.className).toContain('spinnerXl');
    });

    it('should render with sm size', () => {
      render(
        <LoadingState isLoading={true} size="sm">
          <div>Content</div>
        </LoadingState>,
      );

      const spinner = screen.getByTestId('spinner');
      expect(spinner.className).toContain('spinnerSm');
    });

    it('should render with lg size', () => {
      render(
        <LoadingState isLoading={true} size="lg">
          <div>Content</div>
        </LoadingState>,
      );

      const spinner = screen.getByTestId('spinner');
      expect(spinner.className).toContain('spinnerLg');
    });

    it('should render with xl size when explicitly specified', () => {
      render(
        <LoadingState isLoading={true} size="xl">
          <div>Content</div>
        </LoadingState>,
      );

      const spinner = screen.getByTestId('spinner');
      expect(spinner.className).toContain('spinnerXl');
    });
  });

  describe('Table Variant', () => {
    it('should render table variant', () => {
      render(
        <LoadingState isLoading={true} variant="table">
          <div>Content</div>
        </LoadingState>,
      );

      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
      // Verify mock table loader is present
      expect(screen.getByTestId('table-rows-count')).toBeInTheDocument();
    });

    it('should pass correct props to TableLoader', () => {
      const titles = ['Col 1', 'Col 2'];
      render(
        <LoadingState
          isLoading={true}
          variant="table"
          noOfRows={10}
          tableHeaderTitles={titles}
        >
          <div>Content</div>
        </LoadingState>,
      );

      expect(screen.getByTestId('table-rows-count')).toHaveTextContent('10');
      expect(screen.getByTestId('table-headers')).toHaveTextContent(
        JSON.stringify(titles),
      );
    });

    it('should use default rows if not provided', () => {
      render(
        <LoadingState isLoading={true} variant="table">
          <div>Content</div>
        </LoadingState>,
      );

      // Default is 5 rows
      expect(screen.getByTestId('table-rows-count')).toHaveTextContent('5');
    });
  });

  describe('Skeleton Variant', () => {
    it('should render skeleton variant with defaults', () => {
      render(
        <LoadingState isLoading={true} variant="skeleton">
          <div>Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByTestId('loading-state');
      expect(loadingState).toBeInTheDocument();
      expect(loadingState.className).toContain('w-100');

      // Check default rows (5)
      const rows = loadingState.children;
      expect(rows).toHaveLength(5);

      // Check default cols (4) in first row
      const firstRowCols = rows[0].children;
      expect(firstRowCols).toHaveLength(4);

      // Check classes
      expect(firstRowCols[0].className).toContain('loadingItem');
      expect(firstRowCols[0].className).toContain('shimmer');
    });

    it('should render skeleton variant with custom rows and columns', () => {
      render(
        <LoadingState
          isLoading={true}
          variant="skeleton"
          skeletonRows={3}
          skeletonCols={2}
        >
          <div>Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByTestId('loading-state');
      const rows = loadingState.children;
      expect(rows).toHaveLength(3);

      const firstRowCols = rows[0].children;
      expect(firstRowCols).toHaveLength(2);
    });

    it('should have correct structure and styling', () => {
      render(
        <LoadingState isLoading={true} variant="skeleton">
          <div>Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByTestId('loading-state');
      const row = loadingState.children[0];

      // Row styling
      expect(row.className).toContain('d-flex');
      expect(row.className).toContain('mb-3');
      expect(row.className).toContain('gap-3');
    });

    it('should render children when not loading in skeleton variant', () => {
      render(
        <LoadingState isLoading={false} variant="skeleton">
          <div data-testid="skeleton-content">Real Content</div>
        </LoadingState>,
      );

      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
      expect(screen.getByTestId('skeleton-content')).toBeInTheDocument();
    });

    it('should handle edge cases for rows and cols', () => {
      render(
        <LoadingState
          isLoading={true}
          variant="skeleton"
          skeletonRows={0}
          skeletonCols={-1}
        >
          <div>Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByTestId('loading-state');
      expect(loadingState.children).toHaveLength(0);
    });

    it('should handle large number of rows/cols safely', () => {
      render(
        <LoadingState
          isLoading={true}
          variant="skeleton"
          skeletonRows={50}
          skeletonCols={1}
        >
          <div>Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByTestId('loading-state');
      expect(loadingState.children).toHaveLength(50);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for spinner variant', () => {
      render(
        <LoadingState isLoading={true} variant="spinner">
          <div>Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByRole('status');
      expect(loadingState).toHaveAttribute('aria-live', 'polite');
      expect(loadingState).toHaveAttribute('aria-label');
    });

    it('should have proper ARIA attributes for inline variant', () => {
      render(
        <LoadingState isLoading={true} variant="inline">
          <div>Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByRole('status');
      expect(loadingState).toHaveAttribute('aria-live', 'polite');
      expect(loadingState).toHaveAttribute('aria-label');
    });

    it('should have proper accessibility for table variant', () => {
      render(
        <LoadingState isLoading={true} variant="table">
          <div>Content</div>
        </LoadingState>,
      );

      // Table variant uses TableLoader which has its own accessibility
      const loadingState = screen.getByTestId('loading-state');
      expect(loadingState).toBeInTheDocument();
    });

    it('should have proper accessibility for skeleton variant', () => {
      render(
        <LoadingState isLoading={true} variant="skeleton">
          <div>Content</div>
        </LoadingState>,
      );

      // Skeleton variant provides visual loading indication
      const loadingState = screen.getByTestId('loading-state');
      expect(loadingState).toBeInTheDocument();
      expect(loadingState.className).toContain('w-100');
    });

    it('should not have ARIA attributes when not loading', () => {
      render(
        <LoadingState isLoading={false}>
          <div data-testid="test-content">Content</div>
        </LoadingState>,
      );

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('Interaction Blocking', () => {
    it('should render children with reduced opacity in spinner variant', () => {
      render(
        <LoadingState isLoading={true} variant="spinner">
          <div data-testid="test-content">Test Content</div>
        </LoadingState>,
      );

      // Children should still be in the DOM but with reduced opacity
      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
      // Content wrapper should have the loadingContent class
      expect(content.parentElement?.className).toContain('loadingContent');
    });

    it('should not render children in inline variant when loading', () => {
      render(
        <LoadingState isLoading={true} variant="inline">
          <div data-testid="test-content">Test Content</div>
        </LoadingState>,
      );

      expect(screen.queryByTestId('test-content')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple children', () => {
      render(
        <LoadingState isLoading={false}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </LoadingState>,
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should handle null children', () => {
      render(<LoadingState isLoading={false}>{null}</LoadingState>);

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('should handle string children', () => {
      render(<LoadingState isLoading={false}>Text content</LoadingState>);

      expect(screen.getByText('Text content')).toBeInTheDocument();
    });

    it('should toggle between loading and not loading states', () => {
      const { rerender } = render(
        <LoadingState isLoading={true}>
          <div data-testid="test-content">Content</div>
        </LoadingState>,
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      rerender(
        <LoadingState isLoading={false}>
          <div data-testid="test-content">Content</div>
        </LoadingState>,
      );

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });
  });

  /* eslint-disable react/no-multi-comp */
  describe('Custom Variant', () => {
    it('should render provided customLoader when loading', () => {
      const CustomLoader = () => (
        <div data-testid="custom-loader">Custom Loading...</div>
      );

      render(
        <LoadingState
          isLoading={true}
          variant="custom"
          customLoader={<CustomLoader />}
        >
          <div data-testid="test-content">Content</div>
        </LoadingState>,
      );

      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
      expect(screen.queryByTestId('test-content')).not.toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      const CustomLoader = () => <div>Loading...</div>;

      render(
        <LoadingState
          isLoading={true}
          variant="custom"
          customLoader={<CustomLoader />}
        >
          <div>Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByRole('status');
      expect(loadingState).toHaveAttribute('aria-live', 'polite');
      expect(loadingState).toHaveAttribute('aria-label');
    });

    it('should respect data-testid prop', () => {
      const CustomLoader = () => <div>Loading...</div>;

      render(
        <LoadingState
          isLoading={true}
          variant="custom"
          customLoader={<CustomLoader />}
          data-testid="my-custom-loading"
        >
          <div>Content</div>
        </LoadingState>,
      );

      expect(screen.getByTestId('my-custom-loading')).toBeInTheDocument();
    });

    it('should properly translate aria-label via i18next', () => {
      const CustomLoader = () => <div>Loading...</div>;

      render(
        <LoadingState
          isLoading={true}
          variant="custom"
          customLoader={<CustomLoader />}
        >
          <div>Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByRole('status');
      // Verify aria-label is set (exact value depends on i18next mock)
      expect(loadingState.getAttribute('aria-label')).toBeTruthy();
    });

    it('should render children when not loading in custom variant', () => {
      const CustomLoader = () => <div>Loading...</div>;

      render(
        <LoadingState
          isLoading={false}
          variant="custom"
          customLoader={<CustomLoader />}
        >
          <div data-testid="content">Content</div>
        </LoadingState>,
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should handle complex custom loaders', () => {
      const ComplexLoader = () => (
        <div data-testid="complex-loader">
          <div className="shimmer">Skeleton 1</div>
          <div className="shimmer">Skeleton 2</div>
          <div className="shimmer">Skeleton 3</div>
        </div>
      );

      render(
        <LoadingState
          isLoading={true}
          variant="custom"
          customLoader={<ComplexLoader />}
        >
          <div>Content</div>
        </LoadingState>,
      );

      const complexLoader = screen.getByTestId('complex-loader');
      expect(complexLoader).toBeInTheDocument();
      expect(complexLoader.children).toHaveLength(3);
    });

    it('should integrate properly with LoadingState wrapper', () => {
      const CustomDashboardLoader = () => (
        <>
          {[...Array(6)].map((_, index) => (
            <div key={index} data-testid={`loader-${index}`}>
              Loading card {index + 1}
            </div>
          ))}
        </>
      );

      render(
        <LoadingState
          isLoading={true}
          variant="custom"
          customLoader={<CustomDashboardLoader />}
        >
          <div>Dashboard Content</div>
        </LoadingState>,
      );

      // Verify all 6 loaders are rendered
      for (let i = 0; i < 6; i++) {
        expect(screen.getByTestId(`loader-${i}`)).toBeInTheDocument();
      }

      // Verify content is not shown
      expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
    });

    it('should toggle between loading and not loading states', () => {
      const CustomLoader = () => (
        <div data-testid="custom-loader">Loading...</div>
      );

      const { rerender } = render(
        <LoadingState
          isLoading={true}
          variant="custom"
          customLoader={<CustomLoader />}
        >
          <div data-testid="test-content">Content</div>
        </LoadingState>,
      );

      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
      expect(screen.queryByTestId('test-content')).not.toBeInTheDocument();

      rerender(
        <LoadingState
          isLoading={false}
          variant="custom"
          customLoader={<CustomLoader />}
        >
          <div data-testid="test-content">Content</div>
        </LoadingState>,
      );

      expect(screen.queryByTestId('custom-loader')).not.toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should verify aria-label translation value', () => {
      const CustomLoader = () => <div>Loading...</div>;

      render(
        <LoadingState
          isLoading={true}
          variant="custom"
          customLoader={<CustomLoader />}
        >
          <div>Content</div>
        </LoadingState>,
      );

      const loadingState = screen.getByRole('status');
      const ariaLabel = loadingState.getAttribute('aria-label');
      // Verify exact translation (i18next mock returns the key or default)
      expect(ariaLabel).toMatch(/loading/i);
    });
  });
  /* eslint-enable react/no-multi-comp */
});
