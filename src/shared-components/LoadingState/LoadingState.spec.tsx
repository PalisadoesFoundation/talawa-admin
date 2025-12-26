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
});
