/**
 * Unit tests for DataTableTable component.
 *
 * Covers rendering, sorting, selection, custom rows/cells, actions, loading state,
 * ARIA attributes, and keyboard interactions to achieve full branch coverage.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { DataTableTable } from './DataTableTable';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';

type Row = { id: string; name: string; value?: number };

/**
 * Builds default props for DataTableTable tests with optional overrides.
 *
 * @param overrides - Partial props to merge over defaults
 * @returns Props object suitable for DataTableTable<Row>
 */
function defaultProps(
  overrides: Partial<Parameters<typeof DataTableTable<Row>>[0]> = {},
) {
  const columns: IColumnDef<Row, unknown>[] = [
    { id: 'name', header: 'Name', accessor: 'name' as const },
    { id: 'value', header: 'Value', accessor: (row: Row) => row.value ?? 0 },
  ];
  const data: Row[] = [
    { id: '1', name: 'Ada', value: 10 },
    { id: '2', name: 'Bob', value: 20 },
  ];
  const tCommon = vi.fn((key: string, options?: Record<string, unknown>) => {
    if (key === 'selectAllOnPage') return 'Select all on page';
    if (key === 'selectRow') return `Select row ${options?.rowKey ?? ''}`;
    if (key === 'actions') return 'Actions';
    return key;
  });
  return {
    columns,
    sortedRows: data,
    startIndex: 0,
    getKey: (row: Row, idx: number) => row.id ?? String(idx),
    currentSelection: new Set<string | number>(),
    toggleRowSelection: vi.fn(),
    tCommon,
    selectAllOnPage: vi.fn(),
    handleHeaderClick: vi.fn(),
    effectiveRowActions: [],
    effectiveSelectable: false,
    hasRowActions: false,
    someSelectedOnPage: false,
    allSelectedOnPage: false,
    ...overrides,
  };
}

describe('DataTableTable', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  /* ------------------------------------------------------------------
   * Basic rendering
   * ------------------------------------------------------------------ */

  it('renders table with data-testid and applies tableClassNames', () => {
    const props = defaultProps({ tableClassNames: 'custom-table' });
    const { container } = render(<DataTableTable<Row> {...props} />);
    const table = screen.getByTestId('datatable');
    expect(table).toBeInTheDocument();
    expect(container.querySelector('table.custom-table')).toBeInTheDocument();
  });

  it('renders caption with ariaLabel when provided', () => {
    const props = defaultProps({ ariaLabel: 'Users table' });
    render(<DataTableTable<Row> {...props} />);
    const caption = document.querySelector('caption');
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveTextContent('Users table');
  });

  it('does not render caption when ariaLabel is not provided', () => {
    const props = defaultProps();
    render(<DataTableTable<Row> {...props} />);
    expect(document.querySelector('caption')).toBeNull();
  });

  it('sets aria-busy on table when ariaBusy is true', () => {
    const props = defaultProps({ ariaBusy: true });
    render(<DataTableTable<Row> {...props} />);
    expect(screen.getByTestId('datatable')).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('does not set aria-busy to true when ariaBusy is false', () => {
    const props = defaultProps({ ariaBusy: false });
    render(<DataTableTable<Row> {...props} />);
    const table = screen.getByTestId('datatable');
    expect(table.getAttribute('aria-busy')).not.toBe('true');
  });

  it('renders empty table body when sortedRows is empty', () => {
    const props = defaultProps({ sortedRows: [] });
    const { container } = render(<DataTableTable<Row> {...props} />);
    const table = screen.getByTestId('datatable');
    expect(table).toBeInTheDocument();
    const dataRows = container.querySelectorAll(
      'tbody tr[data-testid^="datatable-row-"]',
    );
    expect(dataRows).toHaveLength(0);
  });

  it('renders no column headers when columns is empty', () => {
    const props = defaultProps({
      columns: [],
      effectiveSelectable: false,
      hasRowActions: false,
    });
    render(<DataTableTable<Row> {...props} />);
    const columnHeaders = screen.queryAllByRole('columnheader');
    expect(columnHeaders).toHaveLength(0);
  });

  /* ------------------------------------------------------------------
   * Columns: headers and sort indicators
   * ------------------------------------------------------------------ */

  it('renders column headers from column definitions', () => {
    const props = defaultProps();
    render(<DataTableTable<Row> {...props} />);
    expect(screen.getByRole('button', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /value/i })).toBeInTheDocument();
  });

  it('renders sortable column with role button, tabIndex 0, and sort indicator', () => {
    const props = defaultProps({
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
          meta: { sortable: true },
        },
        { id: 'value', header: 'Value', accessor: 'value' as const },
      ],
    });
    render(<DataTableTable<Row> {...props} />);
    const nameHeader = screen.getByRole('button', { name: /name/i });
    expect(nameHeader).toHaveAttribute('tabIndex', '0');
    expect(nameHeader).toHaveAttribute('role', 'button');
    expect(nameHeader.textContent).toMatch(/⇅/);
  });

  it('renders non-sortable column without role, tabIndex, or sort indicator', () => {
    const props = defaultProps({
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
          meta: { sortable: false },
        },
      ],
    });
    render(<DataTableTable<Row> {...props} />);
    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    expect(nameHeader).not.toHaveAttribute('role', 'button');
    expect(nameHeader).not.toHaveAttribute('tabIndex');
    expect(nameHeader.textContent).not.toMatch(/⇅|▲|▼/);
  });

  it('applies aria-sort ascending when column is active and activeSortDir is asc', () => {
    const props = defaultProps({
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
          meta: { sortable: true },
        },
      ],
      activeSortBy: 'name',
      activeSortDir: 'asc',
    });
    render(<DataTableTable<Row> {...props} />);
    const nameHeader = screen.getByRole('button', { name: /name/i });
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    expect(nameHeader.textContent).toMatch(/▲/);
  });

  it('applies aria-sort descending when column is active and activeSortDir is desc', () => {
    const props = defaultProps({
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
          meta: { sortable: true },
        },
      ],
      activeSortBy: 'name',
      activeSortDir: 'desc',
    });
    render(<DataTableTable<Row> {...props} />);
    const nameHeader = screen.getByRole('button', { name: /name/i });
    expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    expect(nameHeader.textContent).toMatch(/▼/);
  });

  it('does not set aria-sort on inactive sortable column', () => {
    const props = defaultProps({
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
          meta: { sortable: true },
        },
        {
          id: 'value',
          header: 'Value',
          accessor: 'value' as const,
          meta: { sortable: true },
        },
      ],
      activeSortBy: 'name',
      activeSortDir: 'asc',
    });
    render(<DataTableTable<Row> {...props} />);
    const valueHeader = screen.getByRole('button', { name: /value/i });
    expect(valueHeader).not.toHaveAttribute('aria-sort');
  });

  it('applies column meta width when provided', () => {
    const widthValue = 'var(--data-table-col-width)';
    const props = defaultProps({
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
          meta: { width: widthValue },
        },
      ],
    });
    render(<DataTableTable<Row> {...props} />);
    const th = screen.getByRole('button', { name: /name/i });
    expect(th).toHaveStyle({ width: widthValue });
  });

  it('renders header from function when header is a function', () => {
    const props = defaultProps({
      columns: [
        {
          id: 'name',
          header: () => 'Dynamic Header',
          accessor: 'name' as const,
        },
      ],
    });
    render(<DataTableTable<Row> {...props} />);
    expect(screen.getByText('Dynamic Header')).toBeInTheDocument();
  });

  /* ------------------------------------------------------------------
   * Header click and keyboard (Enter/Space)
   * ------------------------------------------------------------------ */

  it('calls handleHeaderClick when sortable header is clicked', async () => {
    const user = userEvent.setup();
    const handleHeaderClick = vi.fn();
    const col = {
      id: 'name',
      header: 'Name',
      accessor: 'name' as const,
      meta: { sortable: true },
    };
    const props = defaultProps({
      columns: [col],
      handleHeaderClick,
    });
    render(<DataTableTable<Row> {...props} />);
    await user.click(screen.getByRole('button', { name: /name/i }));
    expect(handleHeaderClick).toHaveBeenCalledWith(col);
  });

  it('calls handleHeaderClick when Enter is pressed on sortable header', async () => {
    const user = userEvent.setup();
    const handleHeaderClick = vi.fn();
    const col = {
      id: 'name',
      header: 'Name',
      accessor: 'name' as const,
      meta: { sortable: true },
    };
    const props = defaultProps({
      columns: [col],
      handleHeaderClick,
    });
    render(<DataTableTable<Row> {...props} />);
    const header = screen.getByRole('button', { name: /name/i });
    header.focus();
    await user.keyboard('{Enter}');
    expect(handleHeaderClick).toHaveBeenCalledWith(col);
  });

  it('calls handleHeaderClick when Space is pressed on sortable header', async () => {
    const user = userEvent.setup();
    const handleHeaderClick = vi.fn();
    const col = {
      id: 'name',
      header: 'Name',
      accessor: 'name' as const,
      meta: { sortable: true },
    };
    const props = defaultProps({
      columns: [col],
      handleHeaderClick,
    });
    render(<DataTableTable<Row> {...props} />);
    const header = screen.getByRole('button', { name: /name/i });
    header.focus();
    await user.keyboard(' ');
    expect(handleHeaderClick).toHaveBeenCalledWith(col);
  });

  it('does not call handleHeaderClick when non-sortable header is clicked', async () => {
    const user = userEvent.setup();
    const handleHeaderClick = vi.fn();
    const props = defaultProps({
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
          meta: { sortable: false },
        },
      ],
      handleHeaderClick,
    });
    render(<DataTableTable<Row> {...props} />);
    await user.click(screen.getByRole('columnheader', { name: /name/i }));
    expect(handleHeaderClick).not.toHaveBeenCalled();
  });

  it('does not trigger sort on other keys on sortable header', async () => {
    const user = userEvent.setup();
    const handleHeaderClick = vi.fn();
    const props = defaultProps({
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
          meta: { sortable: true },
        },
      ],
      handleHeaderClick,
    });
    render(<DataTableTable<Row> {...props} />);
    const header = screen.getByRole('button', { name: /name/i });
    header.focus();
    await user.keyboard('a');
    expect(handleHeaderClick).not.toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------
   * Selection: header and row checkboxes
   * ------------------------------------------------------------------ */

  it('renders header select-all checkbox when effectiveSelectable is true', () => {
    const props = defaultProps({ effectiveSelectable: true });
    render(<DataTableTable<Row> {...props} />);
    const checkbox = screen.getByTestId('select-all-checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('aria-label', 'Select all on page');
  });

  it('header checkbox shows checked when allSelectedOnPage is true', () => {
    const props = defaultProps({
      effectiveSelectable: true,
      allSelectedOnPage: true,
      someSelectedOnPage: false,
    });
    render(<DataTableTable<Row> {...props} />);
    const checkbox = screen.getByTestId(
      'select-all-checkbox',
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('header checkbox shows mixed aria-checked when someSelectedOnPage is true', () => {
    const props = defaultProps({
      effectiveSelectable: true,
      allSelectedOnPage: false,
      someSelectedOnPage: true,
    });
    render(<DataTableTable<Row> {...props} />);
    const checkbox = screen.getByTestId('select-all-checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  });

  it('calls selectAllOnPage with true when header checkbox is checked', async () => {
    const user = userEvent.setup();
    const selectAllOnPage = vi.fn();
    const props = defaultProps({
      effectiveSelectable: true,
      selectAllOnPage,
    });
    render(<DataTableTable<Row> {...props} />);
    await user.click(screen.getByTestId('select-all-checkbox'));
    expect(selectAllOnPage).toHaveBeenCalledWith(true);
  });

  it('calls selectAllOnPage with false when header checkbox is unchecked', async () => {
    const user = userEvent.setup();
    const selectAllOnPage = vi.fn();
    const props = defaultProps({
      effectiveSelectable: true,
      allSelectedOnPage: true,
      selectAllOnPage,
    });
    render(<DataTableTable<Row> {...props} />);
    await user.click(screen.getByTestId('select-all-checkbox'));
    expect(selectAllOnPage).toHaveBeenCalledWith(false);
  });

  it('renders row checkboxes when effectiveSelectable is true and uses default rows', () => {
    const props = defaultProps({ effectiveSelectable: true });
    render(<DataTableTable<Row> {...props} />);
    expect(screen.getByTestId('select-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('select-row-2')).toBeInTheDocument();
  });

  it('row checkbox reflects currentSelection and calls toggleRowSelection on change', async () => {
    const user = userEvent.setup();
    const toggleRowSelection = vi.fn();
    const props = defaultProps({
      effectiveSelectable: true,
      currentSelection: new Set(['1']),
      toggleRowSelection,
    });
    render(<DataTableTable<Row> {...props} />);
    const row1Cb = screen.getByTestId('select-row-1') as HTMLInputElement;
    const row2Cb = screen.getByTestId('select-row-2') as HTMLInputElement;
    expect(row1Cb.checked).toBe(true);
    expect(row2Cb.checked).toBe(false);
    await user.click(row2Cb);
    expect(toggleRowSelection).toHaveBeenCalledWith('2');
  });

  it('row has data-selected attribute when selected', () => {
    const props = defaultProps({
      effectiveSelectable: true,
      currentSelection: new Set(['1']),
    });
    render(<DataTableTable<Row> {...props} />);
    const row1 = screen.getByTestId('datatable-row-1');
    const row2 = screen.getByTestId('datatable-row-2');
    expect(row1).toHaveAttribute('data-selected', 'true');
    expect(row2).toHaveAttribute('data-selected', 'false');
  });

  it('uses tCommon for selectRow with rowKey in options', () => {
    const tCommon = vi.fn((key: string, options?: Record<string, unknown>) => {
      if (key === 'selectRow') return `Select row ${options?.rowKey ?? ''}`;
      if (key === 'selectAllOnPage') return 'Select all on page';
      if (key === 'actions') return 'Actions';
      return key;
    });
    const props = defaultProps({
      effectiveSelectable: true,
      tCommon,
    });
    render(<DataTableTable<Row> {...props} />);
    const row1Cb = screen.getByTestId('select-row-1');
    expect(row1Cb).toHaveAttribute('aria-label', 'Select row 1');
    expect(tCommon).toHaveBeenCalledWith('selectRow', { rowKey: '1' });
  });

  /* ------------------------------------------------------------------
   * Default row rendering vs custom renderRow
   * ------------------------------------------------------------------ */

  it('renders default rows with getKey and cell values', () => {
    const props = defaultProps();
    render(<DataTableTable<Row> {...props} />);
    expect(screen.getByTestId('datatable-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('datatable-row-2')).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('uses startIndex in getKey for default rows', () => {
    const getKey = vi.fn((row: Row, idx: number) => row.id ?? String(idx));
    const props = defaultProps({ startIndex: 5, getKey });
    render(<DataTableTable<Row> {...props} />);
    expect(getKey).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', name: 'Ada' }),
      5,
    );
    expect(getKey).toHaveBeenCalledWith(
      expect.objectContaining({ id: '2', name: 'Bob' }),
      6,
    );
  });

  it('renders custom rows when renderRow is provided', () => {
    const renderRow = vi.fn((row: Row, index: number) => (
      <tr key={row.id} data-testid={`custom-row-${row.id}`}>
        <td>
          Custom: {row.name} (index {index})
        </td>
      </tr>
    ));
    const props = defaultProps({ renderRow });
    render(<DataTableTable<Row> {...props} />);
    expect(screen.getByTestId('custom-row-1')).toHaveTextContent(
      'Custom: Ada (index 0)',
    );
    expect(screen.getByTestId('custom-row-2')).toHaveTextContent(
      'Custom: Bob (index 1)',
    );
    expect(renderRow).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', name: 'Ada' }),
      0,
    );
    expect(renderRow).toHaveBeenCalledWith(
      expect.objectContaining({ id: '2', name: 'Bob' }),
      1,
    );
  });

  it('uses getKey as Fragment key when renderRow is provided', () => {
    const getKey = vi.fn((row: Row) => row.id);
    const renderRow = (row: Row) => (
      <tr key={row.id}>
        <td>{row.name}</td>
      </tr>
    );
    const props = defaultProps({ renderRow, getKey });
    render(<DataTableTable<Row> {...props} />);
    expect(getKey).toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------
   * Custom renderCell per column
   * ------------------------------------------------------------------ */

  it('uses column render function when provided for cell content', () => {
    const props = defaultProps({
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
          render: (value: unknown) => (
            <span data-testid="custom-cell">{String(value).toUpperCase()}</span>
          ),
        },
        { id: 'value', header: 'Value', accessor: 'value' as const },
      ],
    });
    render(<DataTableTable<Row> {...props} />);
    const customCells = screen.getAllByTestId('custom-cell');
    expect(customCells[0]).toHaveTextContent('ADA');
    expect(customCells[1]).toHaveTextContent('BOB');
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('passes value and row to column render function', () => {
    const renderFn = vi.fn((value: unknown, row: Row) => (
      <span data-testid="cell-with-row">
        {row.name}-{String(value)}
      </span>
    ));
    const props = defaultProps({
      columns: [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name' as const,
          render: renderFn,
        },
      ],
    });
    render(<DataTableTable<Row> {...props} />);
    expect(renderFn).toHaveBeenCalledWith(
      'Ada',
      expect.objectContaining({ id: '1', name: 'Ada' }),
    );
    const cells = screen.getAllByTestId('cell-with-row');
    expect(cells[0]).toHaveTextContent('Ada-Ada');
    expect(cells[1]).toHaveTextContent('Bob-Bob');
  });

  it('renders default renderCellValue when column has no render', () => {
    const props = defaultProps({
      columns: [
        { id: 'name', header: 'Name', accessor: 'name' as const },
        { id: 'value', header: 'Value', accessor: (row: Row) => row.value },
      ],
    });
    render(<DataTableTable<Row> {...props} />);
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders empty string for null/undefined cell value via default renderCellValue', () => {
    const props = defaultProps({
      columns: [
        { id: 'name', header: 'Name', accessor: 'name' as const },
        {
          id: 'value',
          header: 'Value',
          accessor: (row: Row) => row.value,
        },
      ],
      sortedRows: [
        { id: '1', name: 'Ada', value: 10 },
        { id: '2', name: 'Bob' },
      ] as Row[],
    });
    render(<DataTableTable<Row> {...props} />);
    const valueCells = screen.getAllByTestId('datatable-cell-value');
    expect(valueCells).toHaveLength(2);
    expect(valueCells[0]).toHaveTextContent('10');
    expect(valueCells[1]).toBeInTheDocument();
    expect(valueCells[1]).toHaveTextContent('');
  });

  /* ------------------------------------------------------------------
   * hasRowActions and ActionsCell
   * ------------------------------------------------------------------ */

  it('renders actions column header when hasRowActions is true', () => {
    const props = defaultProps({
      hasRowActions: true,
      tCommon: vi.fn((key: string) => (key === 'actions' ? 'Actions' : key)),
    });
    render(<DataTableTable<Row> {...props} />);
    expect(
      screen.getByRole('columnheader', { name: 'Actions' }),
    ).toBeInTheDocument();
  });

  it('renders ActionsCell in each row when hasRowActions is true', () => {
    const onClick = vi.fn();
    const props = defaultProps({
      hasRowActions: true,
      effectiveRowActions: [{ id: 'edit', label: 'Edit', onClick }],
    });
    render(<DataTableTable<Row> {...props} />);
    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    expect(editButtons).toHaveLength(2);
  });

  it('ActionsCell receives row and effectiveRowActions', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const props = defaultProps({
      hasRowActions: true,
      effectiveRowActions: [{ id: 'open', label: 'Open', onClick }],
    });
    render(<DataTableTable<Row> {...props} />);
    await user.click(screen.getAllByRole('button', { name: 'Open' })[0]);
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', name: 'Ada' }),
    );
  });

  /* ------------------------------------------------------------------
   * Loading state (loadingMore) and LoadingMoreRows
   * ------------------------------------------------------------------ */

  it('renders LoadingMoreRows when loadingMore is true', () => {
    const props = defaultProps({
      loadingMore: true,
      skeletonRows: 3,
    });
    render(<DataTableTable<Row> {...props} />);
    const renderedSkeletonRows = document.querySelectorAll(
      '[data-testid^="skeleton-append-"]',
    );
    expect(renderedSkeletonRows).toHaveLength(3);
  });

  it('passes columns, effectiveSelectable, hasRowActions, skeletonRows to LoadingMoreRows', () => {
    const props = defaultProps({
      loadingMore: true,
      effectiveSelectable: true,
      hasRowActions: true,
      skeletonRows: 2,
    });
    render(<DataTableTable<Row> {...props} />);
    const renderedSkeletonRows = document.querySelectorAll(
      '[data-testid^="skeleton-append-"]',
    );
    expect(renderedSkeletonRows).toHaveLength(2);
    const firstRow = renderedSkeletonRows[0];
    const cells = firstRow?.querySelectorAll('td');
    expect(cells?.length).toBe(4); // select + 2 columns + actions
  });

  it('does not render LoadingMoreRows when loadingMore is false', () => {
    const props = defaultProps({ loadingMore: false });
    render(<DataTableTable<Row> {...props} />);
    expect(
      document.querySelectorAll('[data-testid^="skeleton-append-"]'),
    ).toHaveLength(0);
  });

  /* ------------------------------------------------------------------
   * headerCheckboxRef
   * ------------------------------------------------------------------ */

  it('passes headerCheckboxRef to header checkbox input when effectiveSelectable', () => {
    const headerCheckboxRef = { current: null as HTMLInputElement | null };
    const props = defaultProps({
      effectiveSelectable: true,
      headerCheckboxRef,
    });
    render(<DataTableTable<Row> {...props} />);
    const checkbox = screen.getByTestId('select-all-checkbox');
    expect(headerCheckboxRef.current).toBe(checkbox);
  });

  /* ------------------------------------------------------------------
   * Column without meta (sortable default)
   * ------------------------------------------------------------------ */

  it('treats column as sortable when meta is undefined (default)', () => {
    const props = defaultProps({
      columns: [{ id: 'name', header: 'Name', accessor: 'name' as const }],
    });
    render(<DataTableTable<Row> {...props} />);
    const nameHeader = screen.getByRole('button', { name: /name/i });
    expect(nameHeader).toBeInTheDocument();
    expect(nameHeader).toHaveAttribute('role', 'button');
  });

  /* ------------------------------------------------------------------
   * Data cells have correct data-testid
   * ------------------------------------------------------------------ */

  it('renders data cells with data-testid datatable-cell-{col.id}', () => {
    const props = defaultProps();
    render(<DataTableTable<Row> {...props} />);
    const nameCells = screen.getAllByTestId('datatable-cell-name');
    const valueCells = screen.getAllByTestId('datatable-cell-value');
    expect(nameCells).toHaveLength(2);
    expect(valueCells).toHaveLength(2);
  });
});
