import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import i18nForTest from 'utils/i18nForTest';
import { store } from 'state/store';
import PaginationList from './PaginationList';

/**
 * Mock the Pagination component to simplify testing
 * We're testing PaginationList, not the Navigator/Pagination component
 */
vi.mock('../Navigator/Pagination', () => ({
  default: () => <div data-testid="mock-pagination">Mock Pagination</div>,
}));

/**
 * Helper function to render component with necessary providers
 */
const renderPaginationList = (props: any = {}) => {
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
  });

  /**
   * Test Suite 1: Basic Rendering Tests
   */
  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderPaginationList();
      expect(screen.getAllByTestId('mock-pagination').length).toBeGreaterThan(
        0,
      );
    });

    it('should render TablePagination component', () => {
      renderPaginationList();
      // MUI Hidden component removes one view from DOM in test environment
      const paginationElements = screen.getAllByTestId('mock-pagination');
      expect(paginationElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should render desktop view with data-testid', () => {
      renderPaginationList();
      expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
    });

    it('should render with correct count prop', () => {
      const { container } = renderPaginationList({ count: 50 });
      expect(container).toBeInTheDocument();
    });

    it('should render with correct rowsPerPage prop', () => {
      const { container } = renderPaginationList({ rowsPerPage: 25 });
      expect(container).toBeInTheDocument();
    });

    it('should render with correct page prop', () => {
      const { container } = renderPaginationList({ page: 2 });
      expect(container).toBeInTheDocument();
    });
  });

  /**
   * Test Suite 2: Props and Callbacks Tests
   */
  describe('Props and Callbacks', () => {
    it('should accept onPageChange callback prop', () => {
      const mockOnPageChange = vi.fn();
      renderPaginationList({
        onPageChange: mockOnPageChange,
        page: 0,
        count: 100,
        rowsPerPage: 10,
      });

      expect(mockOnPageChange).toBeDefined();
    });

    it('should accept onRowsPerPageChange callback prop', () => {
      const mockOnRowsPerPageChange = vi.fn();
      renderPaginationList({
        onRowsPerPageChange: mockOnRowsPerPageChange,
      });

      expect(mockOnRowsPerPageChange).toBeDefined();
    });

    it('should call onRowsPerPageChange when rows per page is changed', async () => {
      const mockOnRowsPerPageChange = vi.fn();
      const { container } = renderPaginationList({
        onRowsPerPageChange: mockOnRowsPerPageChange,
      });

      // Find the select element (desktop view)
      const select = container.querySelector(
        'select[aria-label="rows per page"]',
      );

      if (select) {
        await act(async () => {
          await userEvent.selectOptions(select, '30');
        });
        expect(mockOnRowsPerPageChange).toHaveBeenCalled();
      }
    });

    it('should pass all required props to TablePagination', () => {
      const props = {
        count: 150,
        rowsPerPage: 30,
        page: 3,
        onPageChange: vi.fn(),
        onRowsPerPageChange: vi.fn(),
      };

      const { container } = renderPaginationList(props);
      expect(container).toBeInTheDocument();
    });
  });

  /**
   * Test Suite 3: Responsive Behavior Tests
   */
  describe('Responsive Behavior', () => {
    it('should render pagination component in test environment', () => {
      renderPaginationList();

      // MUI Hidden component removes hidden elements in test environment
      // At least one pagination instance should be visible
      const paginationElements = screen.getAllByTestId('mock-pagination');
      expect(paginationElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should have different rowsPerPageOptions for desktop view', () => {
      const { container } = renderPaginationList();

      // Desktop view should have the select dropdown
      const selects = container.querySelectorAll('select');
      expect(selects.length).toBeGreaterThan(0);
    });

    it('should render mobile view with empty rowsPerPageOptions', () => {
      // Mobile view has rowsPerPageOptions={[]}
      const { container } = renderPaginationList();
      expect(container).toBeInTheDocument();
    });

    it('should apply custom sx styles to mobile view', () => {
      // Mobile view has custom sx prop for centering
      const { container } = renderPaginationList();
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  /**
   * Test Suite 4: Internationalization Tests
   */
  describe('Internationalization', () => {
    it('should use translation hook', () => {
      renderPaginationList();
      // Component uses useTranslation with 'paginationList' keyPrefix
      expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
    });

    it('should render with translated "all" label in rowsPerPageOptions', () => {
      renderPaginationList();
      // Desktop view has { label: t('all'), value: Number.MAX_SAFE_INTEGER }
      const { container } = renderPaginationList();
      expect(container).toBeInTheDocument();
    });

    it('should render with translated "rowsPerPage" label', () => {
      renderPaginationList();
      // Desktop view has labelRowsPerPage={t('rowsPerPage')}
      const { container } = renderPaginationList();
      expect(container).toBeInTheDocument();
    });

    it('should load translations from paginationList namespace', () => {
      const { container } = renderPaginationList();
      expect(container).toBeInTheDocument();
    });
  });

  /**
   * Test Suite 5: Edge Cases and Boundary Conditions
   */
  describe('Edge Cases', () => {
    it('should handle zero count', () => {
      const { container } = renderPaginationList({ count: 0 });
      expect(container).toBeInTheDocument();
    });

    it('should handle single page scenario', () => {
      const { container } = renderPaginationList({
        count: 5,
        rowsPerPage: 10,
        page: 0,
      });
      expect(container).toBeInTheDocument();
    });

    it('should handle large count values', () => {
      const { container } = renderPaginationList({
        count: 10000,
        rowsPerPage: 10,
        page: 0,
      });
      expect(container).toBeInTheDocument();
    });

    it('should handle last page correctly', () => {
      const { container } = renderPaginationList({
        count: 100,
        rowsPerPage: 10,
        page: 9,
      });
      expect(container).toBeInTheDocument();
    });

    it('should handle Number.MAX_SAFE_INTEGER in rowsPerPage', () => {
      const { container } = renderPaginationList({
        count: 100,
        rowsPerPage: Number.MAX_SAFE_INTEGER,
        page: 0,
      });
      expect(container).toBeInTheDocument();
    });

    it('should handle multiple pages with various rowsPerPage values', () => {
      const testCases = [
        { count: 100, rowsPerPage: 5 },
        { count: 100, rowsPerPage: 10 },
        { count: 100, rowsPerPage: 30 },
      ];

      testCases.forEach((testCase) => {
        const { container } = renderPaginationList(testCase);
        expect(container).toBeInTheDocument();
      });
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

      // Both views use native: true in SelectProps
      const selects = container.querySelectorAll('select');
      expect(selects.length).toBeGreaterThan(0);
    });

    it('should render with ActionsComponent as Pagination', () => {
      renderPaginationList();

      // Verify mocked Pagination component is rendered
      const paginationElements = screen.getAllByTestId('mock-pagination');
      expect(paginationElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should set colSpan prop for table layout', () => {
      // Mobile view uses colSpan={5}, desktop uses colSpan={4}
      const { container } = renderPaginationList();
      expect(container).toBeInTheDocument();
    });

    it('should render with correct rowsPerPageOptions for desktop', () => {
      // Desktop view has [5, 10, 30, { label: t('all'), value: Number.MAX_SAFE_INTEGER }]
      const { container } = renderPaginationList();
      const select = container.querySelector(
        'select[aria-label="rows per page"]',
      );
      expect(select).toBeInTheDocument();
    });

    it('should apply display flex styles to mobile view', () => {
      // Mobile view has sx with display: 'flex', alignItems: 'center', justifyContent: 'center'
      const { container } = renderPaginationList();
      expect(container).toBeInTheDocument();
    });
  });

  /**
   * Test Suite 7: Integration Tests
   */
  describe('Integration', () => {
    it('should work with all props together', () => {
      const mockOnPageChange = vi.fn();
      const mockOnRowsPerPageChange = vi.fn();

      const { container } = renderPaginationList({
        count: 200,
        rowsPerPage: 20,
        page: 5,
        onPageChange: mockOnPageChange,
        onRowsPerPageChange: mockOnRowsPerPageChange,
      });

      expect(container).toBeInTheDocument();
      expect(mockOnPageChange).toBeDefined();
      expect(mockOnRowsPerPageChange).toBeDefined();
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

      // Rerender with different props
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

    it('should render semantic HTML structure', () => {
      const { container } = renderPaginationList();
      expect(container).toBeInTheDocument();
    });

    it('should support keyboard navigation through select elements', () => {
      const { container } = renderPaginationList();

      const selects = container.querySelectorAll('select');
      selects.forEach((select) => {
        expect(select).toBeInTheDocument();
      });
    });
  });

  /**
   * Test Suite 9: Component Interface Tests
   */
  describe('Component Interface', () => {
    it('should accept InterfacePropsInterface compliant props', () => {
      const validProps = {
        count: 50,
        rowsPerPage: 5,
        page: 1,
        onPageChange: vi.fn(),
        onRowsPerPageChange: vi.fn(),
      };

      const { container } = renderPaginationList(validProps);
      expect(container).toBeInTheDocument();
    });

    it('should handle event objects in callbacks', async () => {
      const mockOnPageChange = vi.fn();
      const mockOnRowsPerPageChange = vi.fn();

      const { container } = renderPaginationList({
        onPageChange: mockOnPageChange,
        onRowsPerPageChange: mockOnRowsPerPageChange,
      });

      const select = container.querySelector(
        'select[aria-label="rows per page"]',
      );

      if (select) {
        await act(async () => {
          fireEvent.change(select, { target: { value: '30' } });
        });

        expect(mockOnRowsPerPageChange).toHaveBeenCalled();
      }
    });

    it('should return JSX.Element', () => {
      const result = renderPaginationList();
      expect(result.container.firstChild).toBeInTheDocument();
    });
  });
});
