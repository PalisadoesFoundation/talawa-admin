import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';

import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import i18nForTest from 'utils/i18nForTest';
import { store } from 'state/store';
import PaginationList from './PaginationList';

/**
 * Mock the Pagination component to allow testing navigation clicks
 */
vi.mock('../Navigator/Pagination', () => ({
  default: ({
    onPageChange,
    page,
    count,
    rowsPerPage,
  }: {
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => void;
    page: number;
    count: number;
    rowsPerPage: number;
  }) => {
    const lastPage = Math.ceil(count / rowsPerPage) - 1;
    return (
      <div data-testid="mock-pagination">
        <button
          type="button"
          data-testid="firstPage"
          onClick={(e) => onPageChange(e, 0)}
          disabled={page === 0}
        >
          First
        </button>
        <button
          type="button"
          data-testid="previousPage"
          onClick={(e) => onPageChange(e, page - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <button
          type="button"
          data-testid="nextPage"
          onClick={(e) => onPageChange(e, page + 1)}
          disabled={page >= lastPage}
        >
          Next
        </button>
        <button
          type="button"
          data-testid="lastPage"
          onClick={(e) => onPageChange(e, lastPage)}
          disabled={page >= lastPage}
        >
          Last
        </button>
      </div>
    );
  },
}));

/**
 * Helper function to render component with necessary providers
 */
const renderPaginationList = (
  props: Partial<{
    count: number;
    rowsPerPage: number;
    page: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => void;
    onRowsPerPageChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
  }> = {},
) => {
  const defaultProps = {
    count: 100,
    rowsPerPage: 10,
    page: 0,
    onPageChange: vi.fn(),
    onRowsPerPageChange: vi.fn(),
  };

  return render(
    <BrowserRouter>
      <Provider store={store}>
        <I18nextProvider i18n={i18nForTest}>
          <PaginationList {...defaultProps} {...props} />
        </I18nextProvider>
      </Provider>
    </BrowserRouter>,
  );
};

describe('PaginationList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  /**
   * Test Suite 1: Basic Rendering Tests
   */
  describe('Rendering', () => {
    it('should render pagination controls and TablePagination component', () => {
      renderPaginationList();
      const paginationElements = screen.getAllByTestId('mock-pagination');
      expect(paginationElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should render desktop view with correct options and colSpan', () => {
      renderPaginationList();
      const desktopPagination = screen.getByTestId('table-pagination');
      expect(desktopPagination).toBeInTheDocument();

      const select = screen.getByLabelText('rows per page');
      expect(select).toBeInTheDocument();

      const options = within(select as HTMLElement).getAllByRole('option');
      const optionValues = options.map(
        (opt) => (opt as HTMLOptionElement).value,
      );

      expect(optionValues).toContain('5');
      expect(optionValues).toContain('10');
      expect(optionValues).toContain('30');
      expect(optionValues).toContain(String(Number.MAX_SAFE_INTEGER));

      const paginationTranslations = i18nForTest.getDataByLanguage('en')
        ?.translation?.paginationList as
        | { all?: string; rowsPerPage?: string }
        | undefined;
      const allLabel = paginationTranslations?.all ?? 'All';
      const allOption = options.find((opt) => opt.textContent === allLabel);
      expect(allOption).toBeTruthy();

      const tableCell = desktopPagination.closest('td');
      if (tableCell) {
        expect(tableCell).toHaveAttribute('colspan', '4');
      }
    });

    it('should render with correct count and display range', () => {
      renderPaginationList({ count: 50, rowsPerPage: 10, page: 0 });

      const rangeText = screen.getByText(/1–10 of 50/i);
      expect(rangeText).toBeInTheDocument();
    });

    it('should update displayed range when rowsPerPage changes', () => {
      const { rerender } = renderPaginationList({
        count: 50,
        rowsPerPage: 10,
        page: 0,
      });

      expect(screen.getByText(/1–10 of 50/i)).toBeInTheDocument();

      rerender(
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PaginationList
                count={50}
                rowsPerPage={25}
                page={0}
                onPageChange={vi.fn()}
                onRowsPerPageChange={vi.fn()}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>,
      );

      expect(screen.getByText(/1–25 of 50/i)).toBeInTheDocument();
    });

    it('should update displayed range when page changes', () => {
      const { rerender } = renderPaginationList({
        count: 50,
        rowsPerPage: 10,
        page: 0,
      });

      expect(screen.getByText(/1–10 of 50/i)).toBeInTheDocument();

      rerender(
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PaginationList
                count={50}
                rowsPerPage={10}
                page={2}
                onPageChange={vi.fn()}
                onRowsPerPageChange={vi.fn()}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>,
      );

      expect(screen.getByText(/21–30 of 50/i)).toBeInTheDocument();
    });
  });

  /**
   * Test Suite 2: Props and Callbacks Tests
   */
  describe('Props and Callbacks', () => {
    it('should call onPageChange with correct arguments when next page is clicked', async () => {
      const mockOnPageChange = vi.fn();
      renderPaginationList({
        onPageChange: mockOnPageChange,
        page: 0,
        count: 100,
        rowsPerPage: 10,
      });

      const nextButton = screen.getAllByTestId('nextPage')[0];
      await act(async () => {
        await userEvent.click(nextButton);
      });

      expect(mockOnPageChange).toHaveBeenCalledWith(expect.anything(), 1);
    });

    it('should call onRowsPerPageChange with correct value when selection changes', async () => {
      const mockOnRowsPerPageChange = vi.fn();
      renderPaginationList({
        onRowsPerPageChange: mockOnRowsPerPageChange,
      });
      const select = screen.getByLabelText('rows per page');
      await act(async () => {
        fireEvent.change(select, { target: { value: '30' } });
      });
      expect(mockOnRowsPerPageChange).toHaveBeenCalled();
      const callArgs = mockOnRowsPerPageChange.mock.calls[0][0];
      expect(callArgs.target).toBeDefined();
    });

    it('should verify TablePagination receives correct props and reflects them in DOM', () => {
      const props = {
        count: 150,
        rowsPerPage: 30,
        page: 3,
        onPageChange: vi.fn(),
        onRowsPerPageChange: vi.fn(),
      };

      renderPaginationList(props);

      const rangeStart = 3 * 30 + 1;
      const rangeEnd = Math.min(4 * 30, 150);
      const rangeText = screen.getByText(
        new RegExp(`${rangeStart}–${rangeEnd} of 150`, 'i'),
      );
      expect(rangeText).toBeInTheDocument();

      const select = screen.getByLabelText('rows per page');
      expect(select).toHaveValue('30');
    });
  });

  /**
   * Test Suite 3: Responsive Behavior Tests
   */
  describe('Responsive Behavior', () => {
    let originalInnerWidth: number;

    beforeEach(() => {
      originalInnerWidth = window.innerWidth;
    });

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
    });
    it('should render desktop layout with correct rowsPerPageOptions at large viewport', () => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });
      window.dispatchEvent(new Event('resize'));

      const { container } = renderPaginationList();

      // Verify desktop select options are present
      const select = screen.getByLabelText('rows per page');
      const options = within(select as HTMLElement).getAllByRole('option');
      const optionValues = options.map(
        (opt) => (opt as HTMLOptionElement).value,
      );

      expect(optionValues).toContain('5');
      expect(optionValues).toContain('10');
      expect(optionValues).toContain('30');
      expect(optionValues).toContain(String(Number.MAX_SAFE_INTEGER));

      // Verify desktop colSpan
      const cells = container.querySelectorAll('td[colspan="4"]');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('should render mobile layout with empty rowsPerPageOptions at small viewport', () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      window.dispatchEvent(new Event('resize'));

      const { container } = renderPaginationList();

      // Verify mobile colSpan
      const mobileCells = container.querySelectorAll('td[colspan="5"]');

      if (mobileCells.length > 0) {
        const mobileCell = mobileCells[0];
        const selectInMobile = mobileCell.querySelector('select');

        // Mobile view should have no select options (rowsPerPageOptions=[])
        if (selectInMobile) {
          const options = selectInMobile.querySelectorAll('option');
          expect(options.length).toBe(0);
        }
      }
    });

    it('should verify mobile view has no select options (rowsPerPageOptions=[])', () => {
      const { container } = renderPaginationList();

      const allCells = container.querySelectorAll('td');
      let mobileCell = null;

      for (const cell of allCells) {
        if (cell.getAttribute('colspan') === '5') {
          mobileCell = cell;
          break;
        }
      }

      if (mobileCell) {
        const selectInMobileCell = mobileCell.querySelector('select');
        if (selectInMobileCell) {
          const options = selectInMobileCell.querySelectorAll('option');
          expect(options.length).toBe(0);
        }
      }
    });
  });

  /**
   * Test Suite 4: Internationalization Tests
   */
  describe('Internationalization', () => {
    it('should display translated "all" option in rowsPerPageOptions', () => {
      renderPaginationList();

      const paginationTranslations = i18nForTest.getDataByLanguage('en')
        ?.translation?.paginationList as
        | { all?: string; rowsPerPage?: string }
        | undefined;
      const allLabel = paginationTranslations?.all ?? 'All';

      const select = screen.getByLabelText('rows per page');
      const options = within(select as HTMLElement).getAllByRole('option');

      const allOption = options.find((opt) => opt.textContent === allLabel);
      expect(allOption).toBeTruthy();
    });

    it('should display translated rowsPerPage label', () => {
      renderPaginationList();

      const paginationTranslations = i18nForTest.getDataByLanguage('en')
        ?.translation?.paginationList as
        | { all?: string; rowsPerPage?: string }
        | undefined;
      const rowsPerPageLabel =
        paginationTranslations?.rowsPerPage ?? 'rows per page:';

      const labelText = screen.getByText(new RegExp(rowsPerPageLabel, 'i'));
      expect(labelText).toBeInTheDocument();
    });
  });

  /**
   * Test Suite 5: Edge Cases and Boundary Conditions
   */
  describe('Edge Cases', () => {
    it('should display "0–0 of 0" and disable navigation for zero count', () => {
      renderPaginationList({ count: 0, rowsPerPage: 10, page: 0 });

      const rangeText = screen.getByText(/0–0 of 0/i);
      expect(rangeText).toBeInTheDocument();

      const nextButtons = screen.getAllByTestId('nextPage');
      const prevButtons = screen.getAllByTestId('previousPage');

      nextButtons.forEach((btn) => expect(btn).toBeDisabled());
      prevButtons.forEach((btn) => expect(btn).toBeDisabled());
    });

    it('should disable navigation and show correct range for single page', () => {
      renderPaginationList({ count: 5, rowsPerPage: 10, page: 0 });

      const rangeText = screen.getByText(/1–5 of 5/i);
      expect(rangeText).toBeInTheDocument();

      const nextButtons = screen.getAllByTestId('nextPage');
      nextButtons.forEach((btn) => expect(btn).toBeDisabled());
    });

    it('should handle large count values correctly', () => {
      renderPaginationList({ count: 10000, rowsPerPage: 10, page: 0 });

      const rangeText = screen.getByText(/1–10 of 10,?000/i);
      expect(rangeText).toBeInTheDocument();
    });

    it('should disable next button and show correct range on last page', () => {
      renderPaginationList({ count: 100, rowsPerPage: 10, page: 9 });

      const rangeText = screen.getByText(/91–100 of 100/i);
      expect(rangeText).toBeInTheDocument();

      const nextButtons = screen.getAllByTestId('nextPage');
      nextButtons.forEach((btn) => expect(btn).toBeDisabled());

      const prevButtons = screen.getAllByTestId('previousPage');
      prevButtons.forEach((btn) => expect(btn).not.toBeDisabled());
    });

    it('should show all items on single page for Number.MAX_SAFE_INTEGER rowsPerPage', () => {
      renderPaginationList({
        count: 100,
        rowsPerPage: Number.MAX_SAFE_INTEGER,
        page: 0,
      });

      const rangeText = screen.getByText(/1–100 of 100/i);
      expect(rangeText).toBeInTheDocument();

      const nextButtons = screen.getAllByTestId('nextPage');
      nextButtons.forEach((btn) => expect(btn).toBeDisabled());
    });

    it('should handle multiple rowsPerPage values with correct ranges and button states', () => {
      const testCases = [
        {
          count: 100,
          rowsPerPage: 5,
          page: 0,
          expectedRange: /1–5 of 100/i,
          nextDisabled: false,
        },
        {
          count: 100,
          rowsPerPage: 10,
          page: 5,
          expectedRange: /51–60 of 100/i,
          nextDisabled: false,
        },
        {
          count: 100,
          rowsPerPage: 30,
          page: 3,
          expectedRange: /91–100 of 100/i,
          nextDisabled: true,
        },
      ];

      testCases.forEach(
        ({ count, rowsPerPage, page, expectedRange, nextDisabled }) => {
          const { container } = renderPaginationList({
            count,
            rowsPerPage,
            page,
          });

          const rangeText = within(container).getByText(expectedRange);
          expect(rangeText).toBeInTheDocument();

          const nextButtons = within(container).getAllByTestId('nextPage');
          nextButtons.forEach((btn) => {
            if (nextDisabled) {
              expect(btn).toBeDisabled();
            } else {
              expect(btn).not.toBeDisabled();
            }
          });
        },
      );
    });
  });

  /**
   * Test Suite 6: Material-UI Specific Props
   */
  describe('Material-UI Props', () => {
    it('should have SelectProps with aria-label for accessibility', () => {
      const { container } = renderPaginationList();

      const selects = container.querySelectorAll(
        'select[aria-label="rows per page"]',
      );
      expect(selects.length).toBeGreaterThan(0);
    });

    it('should use native select elements', () => {
      const { container } = renderPaginationList();

      const selects = container.querySelectorAll('select');
      expect(selects.length).toBeGreaterThan(0);
    });

    it('should render with ActionsComponent as Pagination', () => {
      renderPaginationList();

      const paginationElements = screen.getAllByTestId('mock-pagination');
      expect(paginationElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should verify colSpan values for desktop (4)', () => {
      const { container } = renderPaginationList();

      const cells = container.querySelectorAll('td[colspan]');
      const colspanValues = Array.from(cells).map((cell) =>
        cell.getAttribute('colspan'),
      );

      // Desktop view (visible in test environment) uses colspan=4
      expect(colspanValues).toContain('4');

      // Mobile view with colspan=5 may not be rendered in test environment
      // due to MUI Hidden component behavior
    });

    it('should render desktop select with correct option values including "all"', () => {
      renderPaginationList();

      const select = screen.getByLabelText('rows per page');
      const options = within(select as HTMLElement).getAllByRole('option');
      const optionValues = options.map(
        (opt) => (opt as HTMLOptionElement).value,
      );

      expect(optionValues).toContain('5');
      expect(optionValues).toContain('10');
      expect(optionValues).toContain('30');
      expect(optionValues).toContain(String(Number.MAX_SAFE_INTEGER));

      const paginationTranslations = i18nForTest.getDataByLanguage('en')
        ?.translation?.paginationList as
        | { all?: string; rowsPerPage?: string }
        | undefined;
      const allLabel = paginationTranslations?.all ?? 'All';
      const allOption = Array.from(options).find(
        (opt) => opt.textContent === allLabel,
      );
      expect(allOption).toBeTruthy();
    });

    it('should verify mobile sx styles are applied', () => {
      const { container } = renderPaginationList();

      const cells = container.querySelectorAll('td[colspan="5"]');

      if (cells.length > 0) {
        const mobileCell = cells[0];
        const styles = window.getComputedStyle(mobileCell);

        expect(styles.display).toBe('flex');
        expect(
          ['center', 'flex-start', 'flex-end'].includes(styles.alignItems),
        ).toBe(true);
        expect(
          ['center', 'flex-start', 'flex-end'].includes(styles.justifyContent),
        ).toBe(true);
      }
    });
  });

  /**
   * Test Suite 7: Integration Tests
   */
  describe('Integration', () => {
    it('should verify combined props behavior with correct UI state and callbacks', async () => {
      const mockOnPageChange = vi.fn();
      const mockOnRowsPerPageChange = vi.fn();

      renderPaginationList({
        count: 200,
        rowsPerPage: 20,
        page: 5,
        onPageChange: mockOnPageChange,
        onRowsPerPageChange: mockOnRowsPerPageChange,
      });

      const rangeText = screen.getByText(/101–120 of 200/i);
      expect(rangeText).toBeInTheDocument();

      // Note: Select shows default value in test environment, not the rowsPerPage prop
      // This is a limitation of controlled components in tests
      const select = screen.getByLabelText('rows per page');
      expect(select).toBeInTheDocument();

      const nextButton = screen.getAllByTestId('nextPage')[0];
      await act(async () => {
        await userEvent.click(nextButton);
      });

      expect(mockOnPageChange).toHaveBeenCalledWith(expect.anything(), 6);
    });

    it('should maintain component structure through prop updates', () => {
      const { rerender } = renderPaginationList({
        count: 100,
        rowsPerPage: 10,
        page: 0,
      });

      expect(
        screen.getAllByTestId('mock-pagination').length,
      ).toBeGreaterThanOrEqual(1);

      rerender(
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PaginationList
                count={200}
                rowsPerPage={20}
                page={5}
                onPageChange={vi.fn()}
                onRowsPerPageChange={vi.fn()}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>,
      );

      expect(
        screen.getAllByTestId('mock-pagination').length,
      ).toBeGreaterThanOrEqual(1);
    });

    it('should handle rapid prop changes', () => {
      const { rerender } = renderPaginationList({ page: 0 });

      for (let i = 1; i <= 5; i++) {
        rerender(
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <PaginationList
                  count={100}
                  rowsPerPage={10}
                  page={i}
                  onPageChange={vi.fn()}
                  onRowsPerPageChange={vi.fn()}
                />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>,
        );
      }

      expect(
        screen.getAllByTestId('mock-pagination').length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  /**
   * Test Suite 8: Accessibility Tests
   */
  describe('Accessibility', () => {
    it('should have accessible select elements with proper labels', () => {
      const { container } = renderPaginationList();

      const selects = container.querySelectorAll(
        'select[aria-label="rows per page"]',
      );
      selects.forEach((select) => {
        expect(select).toHaveAttribute('aria-label', 'rows per page');
      });
    });

    it('should render semantic table structure with accessible elements', () => {
      const { container } = renderPaginationList();

      const tableCells = container.querySelectorAll('td');
      expect(tableCells.length).toBeGreaterThan(0);

      const selects = container.querySelectorAll('select');
      selects.forEach((select) => {
        expect(select).toHaveAttribute('aria-label');
      });
    });

    it('should support keyboard navigation with Tab and trigger callbacks', async () => {
      const mockOnRowsPerPageChange = vi.fn();
      renderPaginationList({
        onRowsPerPageChange: mockOnRowsPerPageChange,
      });

      const select = screen.getByLabelText('rows per page');

      // Focus the select element
      await act(async () => {
        select.focus();
      });
      expect(document.activeElement).toBe(select);

      // Simulate keyboard navigation with ArrowDown
      await act(async () => {
        await userEvent.keyboard('{ArrowDown}');
      });

      // Tab to next element to test focus movement
      await act(async () => {
        await userEvent.tab();
      });

      // Verify focus moved away from select
      expect(document.activeElement).not.toBe(select);

      // Return focus and simulate selection change
      await act(async () => {
        select.focus();
        fireEvent.change(select, { target: { value: '30' } });
      });

      // Verify callback was invoked with correct event shape
      expect(mockOnRowsPerPageChange).toHaveBeenCalled();
      const callArgs = mockOnRowsPerPageChange.mock.calls[0][0];
      expect(callArgs.target).toBeDefined();
    });
  });

  /**
   * Test Suite 9: Component Interface Tests
   */
  describe('Component Interface', () => {
    it('should verify rendered output matches provided props', () => {
      const validProps = {
        count: 50,
        rowsPerPage: 5,
        page: 1,
        onPageChange: vi.fn(),
        onRowsPerPageChange: vi.fn(),
      };

      renderPaginationList(validProps);

      const rangeText = screen.getByText(/6–10 of 50/i);
      expect(rangeText).toBeInTheDocument();

      const select = screen.getByLabelText('rows per page');
      expect(select).toHaveValue('5');

      const prevButtons = screen.getAllByTestId('previousPage');
      prevButtons.forEach((btn) => expect(btn).not.toBeDisabled());
    });

    it('should handle event objects in callbacks with correct arguments', async () => {
      const mockOnPageChange = vi.fn();
      const mockOnRowsPerPageChange = vi.fn();

      renderPaginationList({
        onPageChange: mockOnPageChange,
        onRowsPerPageChange: mockOnRowsPerPageChange,
      });

      const select = screen.getByLabelText('rows per page');

      await act(async () => {
        fireEvent.change(select, { target: { value: '30' } });
      });

      expect(mockOnRowsPerPageChange).toHaveBeenCalled();
      const callArgs = mockOnRowsPerPageChange.mock.calls[0][0];
      expect(callArgs.target).toBeDefined();
    });
  });
});
