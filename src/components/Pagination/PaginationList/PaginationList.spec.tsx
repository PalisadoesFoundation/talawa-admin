import React from 'react';
import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

vi.mock('@mui/material', async () => {
  const actual =
    await vi.importActual<typeof import('@mui/material')>('@mui/material');

  return {
    ...actual,
    useMediaQuery: vi.fn(),
  };
});

import { useMediaQuery } from '@mui/material';

import PaginationList from './PaginationList';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockedUseMediaQuery = vi.mocked(useMediaQuery);

describe('PaginationList', () => {
  const theme = createTheme();

  const renderComponent = (overrides = {}): void => {
    const props = {
      count: 25,
      rowsPerPage: 5,
      page: 0,
      onPageChange: vi.fn(),
      onRowsPerPageChange: vi.fn(),
      ...overrides,
    };

    render(
      <ThemeProvider theme={theme}>
        <PaginationList {...props} />
      </ThemeProvider>,
    );
  };

  beforeEach(() => {
    mockedUseMediaQuery.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders mobile pagination when screen is small', () => {
    mockedUseMediaQuery.mockReturnValue(true);

    renderComponent();

    expect(screen.getByTestId('table-pagination-mobile')).toBeInTheDocument();
    expect(
      screen.queryByTestId('table-pagination-desktop'),
    ).not.toBeInTheDocument();
  });

  it('renders desktop pagination when screen is not small', () => {
    mockedUseMediaQuery.mockReturnValue(false);

    renderComponent();

    expect(screen.getByTestId('table-pagination-desktop')).toBeInTheDocument();
    expect(
      screen.queryByTestId('table-pagination-mobile'),
    ).not.toBeInTheDocument();
  });

  it('shows translated label for rows per page on desktop view', () => {
    mockedUseMediaQuery.mockReturnValue(false);

    renderComponent();

    expect(screen.getByText('rowsPerPage')).toBeInTheDocument();
  });
});
