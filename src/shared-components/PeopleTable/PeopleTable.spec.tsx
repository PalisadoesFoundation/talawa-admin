import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PeopleTable from './PeopleTable';
import { GridColDef } from '@mui/x-data-grid';
import userEvent from '@testing-library/user-event';
import styles from './PeopleTable.module.css';

describe('PeopleTable Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
  ];

  const mockRows = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  let defaultProps: React.ComponentProps<typeof PeopleTable>;

  beforeEach(() => {
    defaultProps = {
      rows: mockRows,
      columns: mockColumns,
      loading: false,
      rowCount: 10,
      paginationModel: { page: 0, pageSize: 5 },
      onPaginationModelChange: vi.fn(),
      pageSizeOptions: [5, 10],
    };
  });

  it('renders the table with columns and rows', () => {
    render(<PeopleTable {...defaultProps} />);

    // Check headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();

    // Check rows
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('applies the tableContainer CSS class', () => {
    const { container } = render(<PeopleTable {...defaultProps} />);
    expect(container.querySelector(`.${styles.tableContainer}`)).toBeTruthy();
  });

  it('displays loading state', () => {
    render(<PeopleTable {...defaultProps} loading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles pagination change', async () => {
    const user = userEvent.setup();
    render(<PeopleTable {...defaultProps} />);

    const nextButton = screen.getByRole('button', {
      name: /go to next page/i,
    });
    await user.click(nextButton);

    await waitFor(() => {
      // Check that the function was called with the expected object as the first argument
      expect(defaultProps.onPaginationModelChange).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          pageSize: 5,
        }),
        expect.anything(), // Ignore the second argument (details)
      );
    });
  });

  it('handles page size change', async () => {
    const user = userEvent.setup();
    render(<PeopleTable {...defaultProps} />);

    // Open the page size dropdown
    const pageSizeSelect = screen.getByRole('combobox', {
      name: /rows per page/i,
    });
    await user.click(pageSizeSelect);

    // Select a new page size (e.g., 10)
    const option10 = screen.getByRole('option', { name: '10' });
    await user.click(option10);

    await waitFor(() => {
      expect(defaultProps.onPaginationModelChange).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 0,
          pageSize: 10,
        }),
        expect.anything(),
      );
    });
  });

  it('handles rows with _id instead of id', () => {
    const rowsWithUnderscoreId = [
      { _id: '3', name: 'Alice', email: 'alice@example.com' },
    ];
    render(<PeopleTable {...defaultProps} rows={rowsWithUnderscoreId} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('uses a custom getRowId when provided', () => {
    const getRowId = vi.fn((row: { customId: string }) => row.customId);

    render(
      <PeopleTable
        {...defaultProps}
        rows={[
          { customId: 'c1', name: 'Custom User', email: 'c1@example.com' },
        ]}
        getRowId={getRowId}
      />,
    );

    expect(screen.getByText('Custom User')).toBeInTheDocument();
    expect(getRowId).toHaveBeenCalled();
  });

  it('throws when a row is missing both id and _id', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    const expectedErrorMessage =
      'PeopleTable: Row is missing a unique identifier (_id or id).';

    try {
      expect(() =>
        render(
          <PeopleTable
            {...defaultProps}
            rows={[{ name: 'No Id User', email: 'noid@example.com' }]}
          />,
        ),
      ).toThrow(expectedErrorMessage);
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it('renders with custom slots', () => {
    render(
      <PeopleTable
        {...defaultProps}
        rows={[]}
        rowCount={0}
        slots={{ noRowsOverlay: () => <div>No Data Available</div> }}
      />,
    );

    expect(screen.getByText('No Data Available')).toBeInTheDocument();
  });

  it('uses default pageSizeOptions when not provided', async () => {
    const user = userEvent.setup();

    // Intentionally omit `pageSizeOptions` to use the component default.
    const {
      pageSizeOptions: omittedPageSizeOptions,
      ...propsWithoutPageSizeOptions
    } = defaultProps;
    void omittedPageSizeOptions;

    render(<PeopleTable {...propsWithoutPageSizeOptions} />);

    const pageSizeSelect = screen.getByRole('combobox', {
      name: /rows per page/i,
    });
    await user.click(pageSizeSelect);

    expect(screen.getByRole('option', { name: '20' })).toBeInTheDocument();
  });

  describe('DataGrid prop passthrough (module-mocked)', () => {
    afterEach(() => {
      vi.doUnmock('@mui/x-data-grid');
      vi.resetModules();
    });

    it('passes server pagination mode and paginationMeta through to DataGrid', async () => {
      let capturedProps: Record<string, unknown> | undefined;

      vi.resetModules();
      vi.doMock('@mui/x-data-grid', () => {
        const mockDataGrid = (props: Record<string, unknown>) => {
          capturedProps = props;
          return null;
        };

        return { DataGrid: mockDataGrid };
      });

      const { default: IsolatedPeopleTable } = await import('./PeopleTable');

      render(
        <IsolatedPeopleTable
          rows={mockRows}
          columns={mockColumns as unknown as GridColDef[]}
          loading={false}
          rowCount={10}
          paginationModel={{ page: 0, pageSize: 5 }}
          onPaginationModelChange={vi.fn()}
          paginationMeta={{ hasNextPage: false }}
        />,
      );

      expect(capturedProps).toBeTruthy();
      expect(capturedProps?.paginationMode).toBe('server');
      expect(capturedProps?.paginationMeta).toEqual({ hasNextPage: false });
    });

    it('provides a theme-based sx styling function to DataGrid', async () => {
      let capturedProps: Record<string, unknown> | undefined;

      vi.resetModules();
      vi.doMock('@mui/x-data-grid', () => {
        const mockDataGrid = (props: Record<string, unknown>) => {
          capturedProps = props;
          return null;
        };

        return { DataGrid: mockDataGrid };
      });

      const { default: IsolatedPeopleTable } = await import('./PeopleTable');

      render(
        <IsolatedPeopleTable
          rows={mockRows}
          columns={mockColumns as unknown as GridColDef[]}
          loading={false}
          rowCount={10}
          paginationModel={{ page: 0, pageSize: 5 }}
          onPaginationModelChange={vi.fn()}
        />,
      );

      const sx = capturedProps?.sx as
        | undefined
        | ((theme: {
            palette: { divider: string; text: { primary: string } };
          }) => Record<string, unknown>);
      expect(typeof sx).toBe('function');

      const styleObject = sx?.({
        palette: { divider: '#ddd', text: { primary: '#111' } },
      });

      expect(styleObject).toEqual(
        expect.objectContaining({
          border: 0,
          '& .MuiDataGrid-columnHeaders': expect.any(Object),
          '& .MuiDataGrid-cell': expect.any(Object),
          '& .MuiDataGrid-row': expect.any(Object),
          '& .MuiDataGrid-row:hover': expect.any(Object),
        }),
      );
    });
  });
});
