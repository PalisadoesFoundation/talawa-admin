import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaginationControls } from './Pagination';

describe('PaginationControls', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    page: 1,
    pageSize: 10,
    totalItems: 50,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders pagination controls with range text', () => {
      render(<PaginationControls {...defaultProps} />);

      expect(screen.getByText('1–10 of 50')).toBeInTheDocument();
      expect(screen.getByLabelText('paginationPrevLabel')).toBeInTheDocument();
      expect(screen.getByLabelText('paginationNextLabel')).toBeInTheDocument();
    });

    it('does not render rows-per-page selector', () => {
      render(<PaginationControls {...defaultProps} />);

      expect(screen.queryByLabelText('Rows per page')).not.toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });
  });

  describe('Range Text Calculation', () => {
    it('displays correct range for first page', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={10}
          totalItems={50}
        />,
      );
      expect(screen.getByText('1–10 of 50')).toBeInTheDocument();
    });

    it('displays correct range for middle page', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={3}
          pageSize={10}
          totalItems={50}
        />,
      );
      expect(screen.getByText('21–30 of 50')).toBeInTheDocument();
    });

    it('displays correct range for last page', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={5}
          pageSize={10}
          totalItems={48}
        />,
      );
      expect(screen.getByText('41–48 of 48')).toBeInTheDocument();
    });

    it('displays 0–0 of 0 when totalItems is 0', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={10}
          totalItems={0}
        />,
      );
      expect(screen.getByText('0–0 of 0')).toBeInTheDocument();
    });

    it('handles single item correctly', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={10}
          totalItems={1}
        />,
      );
      expect(screen.getByText('1–1 of 1')).toBeInTheDocument();
    });
  });

  describe('Page Navigation', () => {
    it('calls onPageChange with correct page when next button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControls
          {...defaultProps}
          page={2}
          onPageChange={onPageChange}
        />,
      );

      await user.click(screen.getByLabelText('paginationNextLabel'));
      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange with correct page when previous button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControls
          {...defaultProps}
          page={2}
          onPageChange={onPageChange}
        />,
      );

      await user.click(screen.getByLabelText('paginationPrevLabel'));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('disables previous button on first page', () => {
      render(<PaginationControls {...defaultProps} page={1} />);

      const prevButton = screen.getByLabelText('paginationPrevLabel');
      expect(prevButton).toBeDisabled();
    });

    it('disables next button on last page', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={5}
          pageSize={10}
          totalItems={50}
        />,
      );

      const nextButton = screen.getByLabelText('paginationNextLabel');
      expect(nextButton).toBeDisabled();
    });

    it('enables both buttons on middle page', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={3}
          pageSize={10}
          totalItems={50}
        />,
      );

      const prevButton = screen.getByLabelText('paginationPrevLabel');
      const nextButton = screen.getByLabelText('paginationNextLabel');

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label on pagination container', () => {
      const { container } = render(<PaginationControls {...defaultProps} />);

      const paginationNav = container.querySelector('[role="navigation"]');
      expect(paginationNav).toHaveAttribute('aria-label', 'tablePagination');
    });

    it('has aria-live on range text for screen reader updates', () => {
      render(<PaginationControls {...defaultProps} />);

      const rangeText = screen.getByText('1–10 of 50');
      expect(rangeText).toHaveAttribute('aria-live', 'polite');
    });

    it('has proper aria-labels on navigation buttons', () => {
      render(<PaginationControls {...defaultProps} />);

      expect(screen.getByLabelText('paginationPrevLabel')).toBeInTheDocument();
      expect(screen.getByLabelText('paginationNextLabel')).toBeInTheDocument();
    });

    it('buttons are keyboard accessible', () => {
      const onPageChange = vi.fn();
      render(
        <PaginationControls
          {...defaultProps}
          page={2}
          onPageChange={onPageChange}
        />,
      );

      const nextButton = screen.getByLabelText('paginationNextLabel');
      nextButton.focus();
      expect(nextButton).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles very large totalItems', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={100}
          pageSize={10}
          totalItems={1000}
        />,
      );

      expect(screen.getByText('991–1000 of 1000')).toBeInTheDocument();
    });

    it('handles pageSize larger than totalItems', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={100}
          totalItems={15}
        />,
      );

      expect(screen.getByText('1–15 of 15')).toBeInTheDocument();
      expect(screen.getByLabelText('paginationNextLabel')).toBeDisabled();
    });

    it('handles single page scenario', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={10}
          totalItems={5}
        />,
      );

      expect(screen.getByText('1–5 of 5')).toBeInTheDocument();
      expect(screen.getByLabelText('paginationPrevLabel')).toBeDisabled();
      expect(screen.getByLabelText('paginationNextLabel')).toBeDisabled();
    });

    it('calculates totalPages correctly with fractional result', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={3}
          pageSize={10}
          totalItems={25}
        />,
      );

      // Last page, should be disabled
      expect(screen.getByLabelText('paginationNextLabel')).toBeDisabled();
    });
  });

  describe('Invalid input handling', () => {
    it('clamps page when greater than total pages', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={10}
          pageSize={10}
          totalItems={15}
        />,
      );

      expect(screen.getByText('11–15 of 15')).toBeInTheDocument();
      expect(screen.getByLabelText('paginationPrevLabel')).not.toBeDisabled();
      expect(screen.getByLabelText('paginationNextLabel')).toBeDisabled();
    });

    it('clamps page when below 1', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={0}
          pageSize={10}
          totalItems={50}
        />,
      );

      expect(screen.getByText('1–10 of 50')).toBeInTheDocument();
      expect(screen.getByLabelText('paginationPrevLabel')).toBeDisabled();
      expect(screen.getByLabelText('paginationNextLabel')).not.toBeDisabled();
    });

    it('handles non-positive pageSize by falling back to 1', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={0}
          totalItems={50}
        />,
      );

      expect(screen.getByText('1–1 of 50')).toBeInTheDocument();
      expect(screen.getByLabelText('paginationPrevLabel')).toBeDisabled();
      expect(screen.getByLabelText('paginationNextLabel')).not.toBeDisabled();
    });

    it('handles fractional pageSize by flooring to integer', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={2.5 as unknown as number}
          totalItems={50}
        />,
      );

      expect(screen.getByText('1–2 of 50')).toBeInTheDocument();
    });

    it('clamps negative totalItems to zero', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={10}
          totalItems={-5}
        />,
      );

      expect(screen.getByText('0–0 of 0')).toBeInTheDocument();
      expect(screen.getByLabelText('paginationPrevLabel')).toBeDisabled();
      expect(screen.getByLabelText('paginationNextLabel')).toBeDisabled();
    });

    it('handles NaN totalItems by treating as 0', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={10}
          totalItems={NaN}
        />,
      );

      expect(screen.getByText('0–0 of 0')).toBeInTheDocument();
      expect(screen.getByLabelText('paginationPrevLabel')).toBeDisabled();
      expect(screen.getByLabelText('paginationNextLabel')).toBeDisabled();
    });

    it('handles Infinity totalItems by treating as 0', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={10}
          totalItems={Infinity}
        />,
      );

      expect(screen.getByText('0–0 of 0')).toBeInTheDocument();
    });

    it('handles NaN pageSize by treating as 1', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={NaN}
          totalItems={50}
        />,
      );

      expect(screen.getByText('1–1 of 50')).toBeInTheDocument();
    });

    it('handles Infinity pageSize by treating as 1', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={Infinity}
          totalItems={50}
        />,
      );

      expect(screen.getByText('1–1 of 50')).toBeInTheDocument();
    });

    it('handles negative pageSize by clamping to 1', () => {
      render(
        <PaginationControls
          {...defaultProps}
          page={1}
          pageSize={-10}
          totalItems={50}
        />,
      );

      expect(screen.getByText('1–1 of 50')).toBeInTheDocument();
    });
  });
});
