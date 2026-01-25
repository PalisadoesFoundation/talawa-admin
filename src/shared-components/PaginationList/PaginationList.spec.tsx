import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PaginationList from './PaginationList';
import { describe, expect, it, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

// Mock the Pagination component
vi.mock('components/Pagination/Navigator/Pagination', () => ({
  default: ({
    onPageChange,
    page,
    count,
    rowsPerPage,
  }: {
    onPageChange: (event: unknown, page: number) => void;
    page: number;
    count: number;
    rowsPerPage: number;
  }) => (
    <div data-testid="pagination-navigator">
      <button
        type="button"
        data-testid="prev-button"
        onClick={() => onPageChange(null, page - 1)}
        disabled={page === 0}
      >
        Previous
      </button>
      <span data-testid="page-info">
        Page {page + 1} of {Math.ceil(count / rowsPerPage)}
      </span>
      <button
        type="button"
        data-testid="next-button"
        onClick={() => onPageChange(null, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        Next
      </button>
    </div>
  ),
}));

describe('PaginationList', () => {
  const originalMatchMedia = window.matchMedia;
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });
  const defaultProps = {
    count: 100,
    rowsPerPage: 10,
    page: 0,
    onPageChange: vi.fn(),
    onRowsPerPageChange: vi.fn(),
  };

  const renderWithProviders = (props = defaultProps) => {
    return render(
      <ThemeProvider theme={createTheme()}>
        <I18nextProvider i18n={i18nForTest}>
          <PaginationList {...props} />
        </I18nextProvider>
      </ThemeProvider>,
    );
  };

  // Helper function to mock window.matchMedia
  const mockMatchMedia = (isSmallScreen: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches:
          query === '(max-width: 600px)' ? isSmallScreen : !isSmallScreen,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  };

  it('renders pagination for large screens with all options', () => {
    mockMatchMedia(false); // false = large screen

    renderWithProviders();

    expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
    expect(screen.getByLabelText('rows per page')).toBeInTheDocument();
    expect(screen.getByText('rows per page')).toBeInTheDocument();
  });

  it('renders pagination for small screens with limited options', () => {
    mockMatchMedia(true); // true = small screen

    renderWithProviders();

    // For small screens, check that the pagination renders without rows per page options
    expect(screen.getByText('1–10 of 100')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-navigator')).toBeInTheDocument();
  });

  it('calls onPageChange when page navigation occurs', async () => {
    const user = userEvent.setup();
    mockMatchMedia(false); // false = large screen

    renderWithProviders();

    const nextButton = screen.getByTestId('next-button');
    await user.click(nextButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(null, 1);
  });

  it('displays correct page information', () => {
    mockMatchMedia(false); // false = large screen

    renderWithProviders({ ...defaultProps, page: 2 });

    expect(screen.getByText('Page 3 of 10')).toBeInTheDocument();
  });

  it('handles edge case with zero count', () => {
    mockMatchMedia(false); // false = large screen

    renderWithProviders({ ...defaultProps, count: 0 });

    expect(screen.getByText('Page 1 of 0')).toBeInTheDocument();
  });

  it('handles edge case with count less than rowsPerPage', () => {
    mockMatchMedia(false); // false = large screen

    renderWithProviders({ ...defaultProps, count: 5, rowsPerPage: 10 });

    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });
});
