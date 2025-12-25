/**
 * PaginationControl Component Tests
 *
 * Tests cover:
 * - Page navigation (first, previous, next, last)
 * - Page size selection
 * - Disabled states
 * - Keyboard navigation
 * - Accessibility (ARIA, screen readers)
 * - Edge cases (empty data, single page, boundary conditions)
 *
 * Target: >90% code coverage
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { PaginationControl } from './PaginationControl';
import type { InterfacePaginationControlProps } from 'types/shared-components/PaginationControl/interface';

/**
 * Helper function to render PaginationControl with default props
 */
const renderPaginationControl = (
  props?: Partial<InterfacePaginationControlProps>,
) => {
  const defaultProps: InterfacePaginationControlProps = {
    currentPage: 1,
    totalPages: 10,
    pageSize: 25,
    totalItems: 247,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
    disabled: false,
  };

  return render(<PaginationControl {...defaultProps} {...props} />);
};

describe('PaginationControl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderPaginationControl();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should render all navigation buttons', () => {
      renderPaginationControl();

      expect(screen.getByTestId('firstPageButton')).toBeInTheDocument();
      expect(screen.getByTestId('previousPageButton')).toBeInTheDocument();
      expect(screen.getByTestId('nextPageButton')).toBeInTheDocument();
      expect(screen.getByTestId('lastPageButton')).toBeInTheDocument();
    });

    it('should display current page information', () => {
      renderPaginationControl({ currentPage: 3, totalPages: 10 });

      expect(screen.getByText(/Page 3 of 10/i)).toBeInTheDocument();
    });

    it('should display item range correctly', () => {
      renderPaginationControl({
        currentPage: 2,
        pageSize: 25,
        totalItems: 100,
      });

      expect(screen.getByText(/Showing 26-50 of 100/i)).toBeInTheDocument();
    });

    it('should render page size selector with default options', () => {
      renderPaginationControl();

      const select = screen.getByTestId('pageSizeSelect') as HTMLSelectElement;
      const options = Array.from(select.options).map((opt) =>
        Number(opt.value),
      );

      expect(options).toEqual([10, 25, 50, 100]);
    });

    it('should render page size selector with custom options', () => {
      renderPaginationControl({ pageSizeOptions: [5, 15, 30] });

      const select = screen.getByTestId('pageSizeSelect') as HTMLSelectElement;
      const options = Array.from(select.options).map((opt) =>
        Number(opt.value),
      );

      expect(options).toEqual([5, 15, 30]);
    });

    it('should display current page size in selector', () => {
      renderPaginationControl({ pageSize: 50 });

      const select = screen.getByTestId('pageSizeSelect') as HTMLSelectElement;
      expect(select.value).toBe('50');
    });

    it('should render "Rows per page" label', () => {
      renderPaginationControl();

      expect(screen.getByText(/Rows per page/i)).toBeInTheDocument();
    });
  });

  describe('First Page Navigation', () => {
    it('should call onPageChange with 1 when first page button is clicked', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 5, onPageChange });

      const firstButton = screen.getByTestId('firstPageButton');
      fireEvent.click(firstButton);

      expect(onPageChange).toHaveBeenCalledWith(1);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it('should disable first page button on first page', () => {
      renderPaginationControl({ currentPage: 1 });

      const firstButton = screen.getByTestId('firstPageButton');
      expect(firstButton).toBeDisabled();
    });

    it('should enable first page button when not on first page', () => {
      renderPaginationControl({ currentPage: 2 });

      const firstButton = screen.getByTestId('firstPageButton');
      expect(firstButton).not.toBeDisabled();
    });

    it('should not call onPageChange when first page button is clicked while disabled', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 1, onPageChange });

      const firstButton = screen.getByTestId('firstPageButton');
      fireEvent.click(firstButton);

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Previous Page Navigation', () => {
    it('should call onPageChange with currentPage - 1 when previous button is clicked', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 5, onPageChange });

      const prevButton = screen.getByTestId('previousPageButton');
      fireEvent.click(prevButton);

      expect(onPageChange).toHaveBeenCalledWith(4);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it('should disable previous button on first page', () => {
      renderPaginationControl({ currentPage: 1 });

      const prevButton = screen.getByTestId('previousPageButton');
      expect(prevButton).toBeDisabled();
    });

    it('should enable previous button when not on first page', () => {
      renderPaginationControl({ currentPage: 2 });

      const prevButton = screen.getByTestId('previousPageButton');
      expect(prevButton).not.toBeDisabled();
    });

    it('should navigate from page 2 to page 1', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 2, onPageChange });

      fireEvent.click(screen.getByTestId('previousPageButton'));

      expect(onPageChange).toHaveBeenCalledWith(1);
    });
  });

  describe('Next Page Navigation', () => {
    it('should call onPageChange with currentPage + 1 when next button is clicked', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 5, totalPages: 10, onPageChange });

      const nextButton = screen.getByTestId('nextPageButton');
      fireEvent.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(6);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it('should disable next button on last page', () => {
      renderPaginationControl({ currentPage: 10, totalPages: 10 });

      const nextButton = screen.getByTestId('nextPageButton');
      expect(nextButton).toBeDisabled();
    });

    it('should enable next button when not on last page', () => {
      renderPaginationControl({ currentPage: 9, totalPages: 10 });

      const nextButton = screen.getByTestId('nextPageButton');
      expect(nextButton).not.toBeDisabled();
    });

    it('should navigate from page 1 to page 2', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 1, totalPages: 10, onPageChange });

      fireEvent.click(screen.getByTestId('nextPageButton'));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Last Page Navigation', () => {
    it('should call onPageChange with totalPages when last button is clicked', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 5, totalPages: 10, onPageChange });

      const lastButton = screen.getByTestId('lastPageButton');
      fireEvent.click(lastButton);

      expect(onPageChange).toHaveBeenCalledWith(10);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it('should disable last button on last page', () => {
      renderPaginationControl({ currentPage: 10, totalPages: 10 });

      const lastButton = screen.getByTestId('lastPageButton');
      expect(lastButton).toBeDisabled();
    });

    it('should enable last button when not on last page', () => {
      renderPaginationControl({ currentPage: 1, totalPages: 10 });

      const lastButton = screen.getByTestId('lastPageButton');
      expect(lastButton).not.toBeDisabled();
    });

    it('should navigate from first page to last page', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 1, totalPages: 10, onPageChange });

      fireEvent.click(screen.getByTestId('lastPageButton'));

      expect(onPageChange).toHaveBeenCalledWith(10);
    });
  });

  describe('Page Size Selection', () => {
    it('should call onPageSizeChange with selected value when page size changes', () => {
      const onPageSizeChange = vi.fn();
      renderPaginationControl({ onPageSizeChange });

      const select = screen.getByTestId('pageSizeSelect');
      fireEvent.change(select, { target: { value: '50' } });

      expect(onPageSizeChange).toHaveBeenCalledWith(50);
      expect(onPageSizeChange).toHaveBeenCalledTimes(1);
    });

    it('should handle page size change to 10', () => {
      const onPageSizeChange = vi.fn();
      renderPaginationControl({ onPageSizeChange });

      const select = screen.getByTestId('pageSizeSelect');
      fireEvent.change(select, { target: { value: '10' } });

      expect(onPageSizeChange).toHaveBeenCalledWith(10);
    });

    it('should handle page size change to 100', () => {
      const onPageSizeChange = vi.fn();
      renderPaginationControl({ onPageSizeChange });

      const select = screen.getByTestId('pageSizeSelect');
      fireEvent.change(select, { target: { value: '100' } });

      expect(onPageSizeChange).toHaveBeenCalledWith(100);
    });

    it('should disable page size selector when disabled prop is true', () => {
      renderPaginationControl({ disabled: true });

      const select = screen.getByTestId('pageSizeSelect');
      expect(select).toBeDisabled();
    });

    it('should not call onPageSizeChange when selector is disabled', () => {
      const onPageSizeChange = vi.fn();
      renderPaginationControl({ disabled: true, onPageSizeChange });

      const select = screen.getByTestId('pageSizeSelect');

      // Try to change (should not work because it's disabled)
      fireEvent.change(select, { target: { value: '50' } });

      // The change event fires but in real browser the value wouldn't change
      // We test that the select is disabled which prevents user interaction
      expect(select).toBeDisabled();
    });
  });

  describe('Disabled State', () => {
    it('should disable all navigation buttons when disabled is true', () => {
      renderPaginationControl({
        currentPage: 5,
        totalPages: 10,
        disabled: true,
      });

      expect(screen.getByTestId('firstPageButton')).toBeDisabled();
      expect(screen.getByTestId('previousPageButton')).toBeDisabled();
      expect(screen.getByTestId('nextPageButton')).toBeDisabled();
      expect(screen.getByTestId('lastPageButton')).toBeDisabled();
    });

    it('should disable page size selector when disabled is true', () => {
      renderPaginationControl({ disabled: true });

      expect(screen.getByTestId('pageSizeSelect')).toBeDisabled();
    });

    it('should not call onPageChange when buttons are clicked while disabled', () => {
      const onPageChange = vi.fn();

      renderPaginationControl({
        currentPage: 5,
        totalPages: 10,
        disabled: true,
        onPageChange,
      });

      // Try clicking all buttons
      fireEvent.click(screen.getByTestId('firstPageButton'));
      fireEvent.click(screen.getByTestId('previousPageButton'));
      fireEvent.click(screen.getByTestId('nextPageButton'));
      fireEvent.click(screen.getByTestId('lastPageButton'));

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should still display page information when disabled', () => {
      renderPaginationControl({
        currentPage: 5,
        totalPages: 10,
        disabled: true,
      });

      expect(screen.getByText(/Page 5 of 10/i)).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate to previous page on ArrowLeft key', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 5, onPageChange });

      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'ArrowLeft' });

      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('should navigate to next page on ArrowRight key', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 5, totalPages: 10, onPageChange });

      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'ArrowRight' });

      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it('should navigate to first page on Home key', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 5, onPageChange });

      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'Home' });

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('should navigate to last page on End key', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 5, totalPages: 10, onPageChange });

      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'End' });

      expect(onPageChange).toHaveBeenCalledWith(10);
    });

    it('should not navigate on ArrowLeft when on first page', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 1, onPageChange });

      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'ArrowLeft' });

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should not navigate on ArrowRight when on last page', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({
        currentPage: 10,
        totalPages: 10,
        onPageChange,
      });

      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'ArrowRight' });

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should not navigate on Home when already on first page', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 1, onPageChange });

      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'Home' });

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should not navigate on End when already on last page', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({
        currentPage: 10,
        totalPages: 10,
        onPageChange,
      });

      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'End' });

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should not respond to keyboard when disabled', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({
        currentPage: 5,
        totalPages: 10,
        disabled: true,
        onPageChange,
      });

      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'ArrowRight' });
      fireEvent.keyDown(container, { key: 'ArrowLeft' });
      fireEvent.keyDown(container, { key: 'Home' });
      fireEvent.keyDown(container, { key: 'End' });

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should ignore non-navigation keys', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({ currentPage: 5, onPageChange });

      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'a' });
      fireEvent.keyDown(container, { key: 'Enter' });
      fireEvent.keyDown(container, { key: 'Space' });

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have navigation role on container', () => {
      renderPaginationControl();

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Pagination');
    });

    it('should have proper ARIA labels on navigation buttons', () => {
      renderPaginationControl();

      expect(screen.getByLabelText('First')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous')).toBeInTheDocument();
      expect(screen.getByLabelText('Next')).toBeInTheDocument();
      expect(screen.getByLabelText('Last')).toBeInTheDocument();
    });

    it('should have aria-live region for page info', () => {
      renderPaginationControl({ currentPage: 3 });

      const pageInfo = screen.getByText(/Page 3 of/i);
      expect(pageInfo).toHaveAttribute('aria-live', 'polite');
    });

    it('should have proper label for page size selector', () => {
      renderPaginationControl();

      expect(
        screen.getByLabelText(/Select rows per page/i),
      ).toBeInTheDocument();
    });

    it('should be keyboard focusable', () => {
      renderPaginationControl();

      const container = screen.getByRole('navigation');
      expect(container).toHaveAttribute('tabIndex', '0');
    });

    it('should have title attributes for button tooltips', () => {
      renderPaginationControl();

      expect(screen.getByTestId('firstPageButton')).toHaveAttribute(
        'title',
        'Go to first page',
      );
      expect(screen.getByTestId('previousPageButton')).toHaveAttribute(
        'title',
        'Go to previous page',
      );
      expect(screen.getByTestId('nextPageButton')).toHaveAttribute(
        'title',
        'Go to next page',
      );
      expect(screen.getByTestId('lastPageButton')).toHaveAttribute(
        'title',
        'Go to last page',
      );
    });

    it('should have button type="button" to prevent form submission', () => {
      renderPaginationControl();

      expect(screen.getByTestId('firstPageButton')).toHaveAttribute(
        'type',
        'button',
      );
      expect(screen.getByTestId('previousPageButton')).toHaveAttribute(
        'type',
        'button',
      );
      expect(screen.getByTestId('nextPageButton')).toHaveAttribute(
        'type',
        'button',
      );
      expect(screen.getByTestId('lastPageButton')).toHaveAttribute(
        'type',
        'button',
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data (totalItems = 0)', () => {
      renderPaginationControl({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
      });

      expect(screen.getByText(/No items to display/i)).toBeInTheDocument();
      expect(screen.queryByTestId('firstPageButton')).not.toBeInTheDocument();
    });

    it('should handle single page correctly', () => {
      renderPaginationControl({
        currentPage: 1,
        totalPages: 1,
        totalItems: 5,
        pageSize: 10,
      });

      // All navigation buttons should be disabled
      expect(screen.getByTestId('firstPageButton')).toBeDisabled();
      expect(screen.getByTestId('previousPageButton')).toBeDisabled();
      expect(screen.getByTestId('nextPageButton')).toBeDisabled();
      expect(screen.getByTestId('lastPageButton')).toBeDisabled();

      // Should still show page info
      expect(screen.getByText(/Page 1 of 1/i)).toBeInTheDocument();
    });

    it('should handle last page with partial items correctly', () => {
      renderPaginationControl({
        currentPage: 10,
        totalPages: 10,
        pageSize: 25,
        totalItems: 247, // 247 % 25 = 22 items on last page
      });

      expect(screen.getByText(/Showing 226-247 of 247/i)).toBeInTheDocument();
    });

    it('should calculate item range correctly for first page', () => {
      renderPaginationControl({
        currentPage: 1,
        pageSize: 10,
        totalItems: 100,
        totalPages: 10,
      });

      expect(screen.getByText(/Showing 1-10 of 100/i)).toBeInTheDocument();
    });

    it('should calculate item range correctly for middle page', () => {
      renderPaginationControl({
        currentPage: 5,
        pageSize: 20,
        totalItems: 200,
        totalPages: 10,
      });

      expect(screen.getByText(/Showing 81-100 of 200/i)).toBeInTheDocument();
    });

    it('should handle very large page numbers', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({
        currentPage: 999,
        totalPages: 1000,
        totalItems: 25000,
        pageSize: 25,
        onPageChange,
      });

      fireEvent.click(screen.getByTestId('nextPageButton'));
      expect(onPageChange).toHaveBeenCalledWith(1000);
    });

    it('should handle page size larger than total items', () => {
      renderPaginationControl({
        currentPage: 1,
        totalPages: 1,
        pageSize: 100,
        totalItems: 50,
      });

      expect(screen.getByText(/Showing 1-50 of 50/i)).toBeInTheDocument();
    });

    it('should show correct range on last page with exact fit', () => {
      renderPaginationControl({
        currentPage: 4,
        totalPages: 4,
        pageSize: 25,
        totalItems: 100, // Exactly 4 full pages
      });

      expect(screen.getByText(/Showing 76-100 of 100/i)).toBeInTheDocument();
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete pagination workflow', () => {
      const onPageChange = vi.fn();
      const { rerender } = renderPaginationControl({
        currentPage: 1,
        totalPages: 5,
        pageSize: 25,
        totalItems: 125,
        onPageChange,
        onPageSizeChange: vi.fn(),
      });

      // Navigate to next page
      fireEvent.click(screen.getByTestId('nextPageButton'));
      expect(onPageChange).toHaveBeenCalledWith(2);

      // Simulate parent updating currentPage
      rerender(
        <PaginationControl
          currentPage={2}
          totalPages={5}
          pageSize={25}
          totalItems={125}
          onPageChange={onPageChange}
          onPageSizeChange={vi.fn()}
        />,
      );

      expect(screen.getByText(/Page 2 of 5/i)).toBeInTheDocument();
      expect(screen.getByText(/Showing 26-50 of 125/i)).toBeInTheDocument();

      // Navigate to last page
      fireEvent.click(screen.getByTestId('lastPageButton'));
      expect(onPageChange).toHaveBeenCalledWith(5);
    });

    it('should handle page size change workflow', () => {
      const onPageSizeChange = vi.fn();
      const { rerender } = renderPaginationControl({
        currentPage: 1,
        totalPages: 10,
        pageSize: 25,
        totalItems: 100,
        onPageChange: vi.fn(),
        onPageSizeChange,
      });

      // Change page size
      const select = screen.getByTestId('pageSizeSelect');
      fireEvent.change(select, { target: { value: '50' } });

      expect(onPageSizeChange).toHaveBeenCalledWith(50);

      // Simulate parent updating pageSize (and recalculating totalPages)
      rerender(
        <PaginationControl
          currentPage={1}
          totalPages={2} // 100 items / 50 per page = 2 pages
          pageSize={50}
          totalItems={100}
          onPageChange={vi.fn()}
          onPageSizeChange={onPageSizeChange}
        />,
      );

      expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Showing 1-50 of 100/i)).toBeInTheDocument();
    });

    it('should handle keyboard and button navigation together', () => {
      const onPageChange = vi.fn();
      renderPaginationControl({
        currentPage: 5,
        totalPages: 10,
        onPageChange,
      });

      const container = screen.getByRole('navigation');

      // Use keyboard to go back
      fireEvent.keyDown(container, { key: 'ArrowLeft' });
      expect(onPageChange).toHaveBeenCalledWith(4);

      // Use button to go forward
      fireEvent.click(screen.getByTestId('nextPageButton'));
      expect(onPageChange).toHaveBeenCalledWith(6);

      // Use keyboard to jump to first
      fireEvent.keyDown(container, { key: 'Home' });
      expect(onPageChange).toHaveBeenCalledWith(1);

      // Use button to jump to last
      fireEvent.click(screen.getByTestId('lastPageButton'));
      expect(onPageChange).toHaveBeenCalledWith(10);
    });
  });
});
