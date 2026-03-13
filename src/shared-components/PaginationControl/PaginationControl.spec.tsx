import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaginationControl } from './PaginationControl';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      const map: Record<string, string> = {
        paginationControl: 'Pagination',
        paginationFirst: '«',
        paginationFirstLabel: 'First',
        paginationPreviousChar: '‹',
        paginationPrevLabel: 'Previous',
        paginationPageOf: `Page ${opts?.page} of ${opts?.total}`,
        paginationNextChar: '›',
        paginationNextLabel: 'Next',
        paginationLastLabel: 'Last',
        paginationLast: '»',
        paginationRowsPerPage: 'Rows per page',
        paginationShowing: `Showing ${opts?.start}–${opts?.end} of ${opts?.total}`,
        jumpToPage: 'Jump to page',
      };
      return map[key] ?? key;
    },
  }),
}));

const defaultProps = {
  currentPage: 2,
  totalPages: 5,
  pageSize: 10,
  totalItems: 50,
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
};

describe('PaginationControl', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders all navigation buttons', () => {
      render(<PaginationControl {...defaultProps} />);
      expect(screen.getByLabelText('First')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous')).toBeInTheDocument();
      expect(screen.getByLabelText('Next')).toBeInTheDocument();
      expect(screen.getByLabelText('Last')).toBeInTheDocument();
    });

    it('renders rows-per-page selector with default options', () => {
      render(<PaginationControl {...defaultProps} />);
      const select = screen.getByLabelText('Rows per page');
      expect(select).toBeInTheDocument();

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(4);
      expect(options.map((o) => o.textContent)).toEqual([
        '10',
        '25',
        '50',
        '100',
      ]);
    });

    it('renders custom pageSizeOptions', () => {
      render(
        <PaginationControl {...defaultProps} pageSizeOptions={[5, 20, 100]} />,
      );
      const options = screen.getAllByRole('option');
      expect(options.map((o) => o.textContent)).toEqual(['5', '20', '100']);
    });

    it('renders page-info span with aria-live polite', () => {
      render(<PaginationControl {...defaultProps} />);
      const pageInfo = screen.getByTestId('pagination-page-info');
      expect(pageInfo).toHaveAttribute('aria-live', 'polite');
      expect(pageInfo).toHaveTextContent('Page 2 of 5');
    });

    it('renders "Showing X–Y of Z" range info', () => {
      render(<PaginationControl {...defaultProps} />);
      expect(screen.getByTestId('pagination-range')).toHaveTextContent(
        'Showing 11–20 of 50',
      );
    });

    it('has role=navigation with aria-label Pagination', () => {
      const { container } = render(<PaginationControl {...defaultProps} />);
      const nav = container.querySelector('[role="navigation"]');
      expect(nav).toHaveAttribute('aria-label', 'Pagination');
    });
  });

  describe('Page Navigation', () => {
    it('calls onPageChange(1) when First button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControl {...defaultProps} onPageChange={onPageChange} />,
      );
      await user.click(screen.getByLabelText('First'));
      await waitFor(() => {
        expect(onPageChange).toHaveBeenCalledWith(1);
      });
    });

    it('calls onPageChange(currentPage - 1) when Previous is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControl
          {...defaultProps}
          currentPage={3}
          onPageChange={onPageChange}
        />,
      );
      await user.click(screen.getByLabelText('Previous'));
      await waitFor(() => {
        expect(onPageChange).toHaveBeenCalledWith(2);
      });
    });

    it('calls onPageChange(currentPage + 1) when Next is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControl
          {...defaultProps}
          currentPage={2}
          onPageChange={onPageChange}
        />,
      );
      await user.click(screen.getByLabelText('Next'));
      await waitFor(() => {
        expect(onPageChange).toHaveBeenCalledWith(3);
      });
    });

    it('calls onPageChange(totalPages) when Last is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControl
          {...defaultProps}
          currentPage={3}
          onPageChange={onPageChange}
        />,
      );
      await user.click(screen.getByLabelText('Last'));
      await waitFor(() => {
        expect(onPageChange).toHaveBeenCalledWith(5);
      });
    });
  });

  describe('Disabled states', () => {
    it('disables First and Previous when on first page', () => {
      render(<PaginationControl {...defaultProps} currentPage={1} />);
      expect(screen.getByLabelText('First')).toBeDisabled();
      expect(screen.getByLabelText('Previous')).toBeDisabled();
      expect(screen.getByLabelText('Next')).not.toBeDisabled();
      expect(screen.getByLabelText('Last')).not.toBeDisabled();
    });

    it('disables Next and Last when on last page', () => {
      render(<PaginationControl {...defaultProps} currentPage={5} />);
      expect(screen.getByLabelText('First')).not.toBeDisabled();
      expect(screen.getByLabelText('Previous')).not.toBeDisabled();
      expect(screen.getByLabelText('Next')).toBeDisabled();
      expect(screen.getByLabelText('Last')).toBeDisabled();
    });

    it('enables all buttons on a middle page', () => {
      render(<PaginationControl {...defaultProps} currentPage={3} />);
      expect(screen.getByLabelText('First')).not.toBeDisabled();
      expect(screen.getByLabelText('Previous')).not.toBeDisabled();
      expect(screen.getByLabelText('Next')).not.toBeDisabled();
      expect(screen.getByLabelText('Last')).not.toBeDisabled();
    });

    it('disables all controls when disabled prop is true', () => {
      render(<PaginationControl {...defaultProps} currentPage={3} disabled />);
      expect(screen.getByLabelText('First')).toBeDisabled();
      expect(screen.getByLabelText('Previous')).toBeDisabled();
      expect(screen.getByLabelText('Next')).toBeDisabled();
      expect(screen.getByLabelText('Last')).toBeDisabled();
      expect(screen.getByLabelText('Rows per page')).toBeDisabled();
    });

    it('does not call onPageChange when disabled', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControl
          {...defaultProps}
          currentPage={3}
          disabled
          onPageChange={onPageChange}
        />,
      );
      await user.click(screen.getByLabelText('Next'));
      await waitFor(() => {
        expect(onPageChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('Rows per page selector', () => {
    it('calls onPageSizeChange with the selected value', async () => {
      const user = userEvent.setup();
      const onPageSizeChange = vi.fn();
      render(
        <PaginationControl
          {...defaultProps}
          onPageSizeChange={onPageSizeChange}
        />,
      );
      await user.selectOptions(screen.getByLabelText('Rows per page'), '25');
      await waitFor(() => {
        expect(onPageSizeChange).toHaveBeenCalledWith(25);
      });
    });

    it('shows the current pageSize as selected', () => {
      render(<PaginationControl {...defaultProps} pageSize={25} />);
      const select = screen.getByLabelText(
        'Rows per page',
      ) as HTMLSelectElement;
      expect(select.value).toBe('25');
    });
  });

  describe('Jump to page', () => {
    it('renders the jump-to-page input when enableJumpToPage is true', () => {
      render(<PaginationControl {...defaultProps} enableJumpToPage />);
      expect(screen.getByLabelText('Jump to page')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-jump')).toHaveValue(2);
    });

    it('calls onJumpToPage with clamped value when Enter is pressed', async () => {
      const user = userEvent.setup();
      const onJumpToPage = vi.fn();
      render(
        <PaginationControl
          {...defaultProps}
          enableJumpToPage
          onJumpToPage={onJumpToPage}
        />,
      );

      const input = screen.getByTestId('pagination-jump');
      await user.clear(input);
      await user.type(input, '4{Enter}');

      await waitFor(() => {
        expect(onJumpToPage).toHaveBeenCalledWith(4);
      });
    });

    it('calls onJumpToPage with clamped value on blur', async () => {
      const user = userEvent.setup();
      const onJumpToPage = vi.fn();
      render(
        <PaginationControl
          {...defaultProps}
          enableJumpToPage
          onJumpToPage={onJumpToPage}
          totalPages={10}
        />,
      );

      const input = screen.getByTestId('pagination-jump');
      await user.clear(input);
      await user.type(input, '15');
      input.blur(); // Trigger blur

      await waitFor(() => {
        expect(onJumpToPage).toHaveBeenCalledWith(10);
      });
      // Verify input state is also synced back to clamped value
      expect(input).toHaveValue(10);
    });

    it('falls back to onPageChange if onJumpToPage is not provided', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControl
          {...defaultProps}
          enableJumpToPage
          onPageChange={onPageChange}
        />,
      );

      const input = screen.getByTestId('pagination-jump');
      await user.clear(input);
      await user.type(input, '3{Enter}');

      await waitFor(() => {
        expect(onPageChange).toHaveBeenCalledWith(3);
      });
    });

    it('disables input when disabled prop is true', () => {
      render(<PaginationControl {...defaultProps} enableJumpToPage disabled />);
      const input = screen.getByTestId('pagination-jump');
      expect(input).toBeDisabled();
    });

    it('reverts to safePage on invalid input', async () => {
      const user = userEvent.setup();
      render(<PaginationControl {...defaultProps} enableJumpToPage />);

      const input = screen.getByTestId('pagination-jump');
      await user.clear(input);
      await user.type(input, 'abc{Enter}');

      expect(input).toHaveValue(2);
    });

    it('syncs input value with safePage changes', async () => {
      const { rerender } = render(
        <PaginationControl
          {...defaultProps}
          enableJumpToPage
          currentPage={2}
        />,
      );
      const input = screen.getByTestId('pagination-jump');
      expect(input).toHaveValue(2);

      rerender(
        <PaginationControl
          {...defaultProps}
          enableJumpToPage
          currentPage={4}
        />,
      );
      expect(input).toHaveValue(4);
    });
  });

  // ---------------------------------------------------------------------------
  // Keyboard navigation
  // ---------------------------------------------------------------------------
  describe('Keyboard navigation', () => {
    it('calls onPageChange with next page on ArrowRight', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControl {...defaultProps} onPageChange={onPageChange} />,
      );
      screen.getByRole('navigation').focus();
      await user.keyboard('{ArrowRight}');
      await waitFor(() => {
        expect(onPageChange).toHaveBeenCalledWith(3);
      });
    });

    it('calls onPageChange with prev page on ArrowLeft', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControl {...defaultProps} onPageChange={onPageChange} />,
      );
      screen.getByRole('navigation').focus();
      await user.keyboard('{ArrowLeft}');
      await waitFor(() => {
        expect(onPageChange).toHaveBeenCalledWith(1);
      });
    });

    it('does not navigate past first page with ArrowLeft', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControl
          {...defaultProps}
          currentPage={1}
          onPageChange={onPageChange}
        />,
      );
      screen.getByRole('navigation').focus();
      await user.keyboard('{ArrowLeft}');
      await waitFor(() => {
        expect(onPageChange).not.toHaveBeenCalled();
      });
    });

    it('does not navigate past last page with ArrowRight', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControl
          {...defaultProps}
          currentPage={5}
          onPageChange={onPageChange}
        />,
      );
      screen.getByRole('navigation').focus();
      await user.keyboard('{ArrowRight}');
      await waitFor(() => {
        expect(onPageChange).not.toHaveBeenCalled();
      });
    });

    it('does not navigate when disabled and ArrowRight pressed', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControl
          {...defaultProps}
          disabled
          onPageChange={onPageChange}
        />,
      );
      screen.getByRole('navigation').focus();
      await user.keyboard('{ArrowRight}');
      await waitFor(() => {
        expect(onPageChange).not.toHaveBeenCalled();
      });
    });

    it('does not navigate when focus is inside a select element', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <PaginationControl {...defaultProps} onPageChange={onPageChange} />,
      );
      // Click to focus the select — keyboard events then fire with e.target === select,
      // triggering the SELECT guard in the component's keydown handler.
      await user.click(screen.getByLabelText('Rows per page'));
      await user.keyboard('{ArrowRight}');
      await waitFor(() => {
        expect(onPageChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('Range info display', () => {
    it('shows correct range on first page', () => {
      render(
        <PaginationControl
          {...defaultProps}
          currentPage={1}
          pageSize={10}
          totalItems={50}
        />,
      );
      expect(screen.getByTestId('pagination-range')).toHaveTextContent(
        'Showing 1–10 of 50',
      );
    });

    it('shows correct range on last partial page', () => {
      render(
        <PaginationControl
          {...defaultProps}
          currentPage={5}
          pageSize={10}
          totalItems={43}
        />,
      );
      expect(screen.getByTestId('pagination-range')).toHaveTextContent(
        'Showing 41–43 of 43',
      );
    });

    it('shows 0–0 of 0 when totalItems is 0', () => {
      render(
        <PaginationControl
          {...defaultProps}
          currentPage={1}
          pageSize={10}
          totalItems={0}
        />,
      );
      expect(screen.getByTestId('pagination-range')).toHaveTextContent(
        'Showing 0–0 of 0',
      );
    });
  });

  describe('Edge cases', () => {
    it('clamps currentPage below 1 to 1', () => {
      render(<PaginationControl {...defaultProps} currentPage={0} />);
      expect(screen.getByTestId('pagination-page-info')).toHaveTextContent(
        'Page 1 of 5',
      );
    });

    it('clamps currentPage above totalPages to totalPages', () => {
      render(<PaginationControl {...defaultProps} currentPage={99} />);
      expect(screen.getByTestId('pagination-page-info')).toHaveTextContent(
        'Page 5 of 5',
      );
    });

    it('handles single page (totalPages=1) disabling all nav buttons', () => {
      render(
        <PaginationControl
          {...defaultProps}
          currentPage={1}
          totalPages={1}
          totalItems={5}
        />,
      );
      expect(screen.getByLabelText('First')).toBeDisabled();
      expect(screen.getByLabelText('Previous')).toBeDisabled();
      expect(screen.getByLabelText('Next')).toBeDisabled();
      expect(screen.getByLabelText('Last')).toBeDisabled();
    });

    it('treats totalPages < 1 as 1', () => {
      render(<PaginationControl {...defaultProps} totalPages={0} />);
      expect(screen.getByTestId('pagination-page-info')).toHaveTextContent(
        'Page 1 of 1',
      );
    });

    it('treats negative totalItems as 0', () => {
      render(<PaginationControl {...defaultProps} totalItems={-5} />);
      expect(screen.getByTestId('pagination-range')).toHaveTextContent('of 0');
    });
  });
});
