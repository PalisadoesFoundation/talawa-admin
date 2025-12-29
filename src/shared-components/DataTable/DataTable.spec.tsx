import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataTable } from './DataTable';

describe('DataTable', () => {
  it('coerces non-string/number rowKey property to string', () => {
    type Row = { boolKey: boolean; name: string };
    const cols = [
      { id: 'name', header: 'Name', accessor: (row: Row) => row.name },
    ];
    const data: Row[] = [
      { boolKey: true, name: 'TrueRow' },
      { boolKey: false, name: 'FalseRow' },
    ];
    // rowKey points to a boolean property, which will be coerced to string
    render(<DataTable<Row> data={data} columns={cols} rowKey="boolKey" />);
    expect(screen.getByText('TrueRow')).toBeInTheDocument();
    expect(screen.getByText('FalseRow')).toBeInTheDocument();
  });

  it('gets cell value using string accessor', () => {
    const cols = [{ id: 'foo', header: 'Foo', accessor: 'foo' as const }];
    const data = [{ foo: 'bar' }];
    render(<DataTable data={data} columns={cols} />);
    expect(screen.getByText('bar')).toBeInTheDocument();
  });

  it('uses default idx as row key when rowKey is undefined', () => {
    const cols = [
      { id: 'id', header: 'ID', accessor: (row: { id: number }) => row.id },
    ];
    const data = [{ id: 1 }, { id: 2 }];
    render(<DataTable data={data} columns={cols} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('uses idx as row key when rowKey is string but property missing', () => {
    type Row = { notId: number };
    const cols = [
      {
        id: 'notId',
        header: 'NotId',
        accessor: (row: { notId: number }) => row.notId,
      },
    ];
    const data: Row[] = [{ notId: 5 }];
    // @ts-expect-error - intentionally passing invalid rowKey to assert fallback to index
    render(<DataTable<Row> data={data} columns={cols} rowKey="id" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders column header as function', () => {
    const cols = [
      {
        id: 'name',
        header: () => 'Dynamic Header',
        accessor: (row: { name: string }) => row.name,
      },
    ];
    render(<DataTable data={[{ name: 'Test' }]} columns={cols} />);
    expect(screen.getByText('Dynamic Header')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders cell with undefined render and value', () => {
    type Row = { foo?: string };
    const cols = [
      { id: 'foo', header: 'Foo', accessor: (row: Row) => row.foo },
    ];
    render(<DataTable<Row> data={[{} as Row]} columns={cols} />);
    const cell = screen.getByRole('cell');
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveTextContent('');
  });

  it('renders cell with string accessor', () => {
    const cols = [
      { id: 'bar', header: 'Bar', accessor: (row: { bar: number }) => row.bar },
    ];
    render(<DataTable data={[{ bar: 123 }]} columns={cols} />);
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('renders headers and rows', () => {
    const cols = [
      {
        id: 'name',
        header: 'Name',
        accessor: (row: { name: string }) => row.name,
      },
    ];
    render(<DataTable data={[{ name: 'Ada' }]} columns={cols} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('renders loading state with TableLoader', () => {
    const cols = [
      { id: 'name', header: 'Name', accessor: 'name' },
      { id: 'age', header: 'Age', accessor: 'age' },
    ];
    render(<DataTable data={[]} columns={cols} loading />);
    expect(screen.getByTestId('TableLoader')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    const cols = [{ id: 'name', header: 'Name', accessor: 'name' }];
    render(
      <DataTable
        data={[]}
        columns={cols}
        loading={false}
        emptyMessage="Nothing here!"
      />,
    );
    expect(screen.getByText('Nothing here!')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const cols = [{ id: 'name', header: 'Name', accessor: 'name' }];
    const error = new Error('Something went wrong');
    render(<DataTable data={[]} columns={cols} error={error} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders custom error with renderError', () => {
    const cols = [{ id: 'name', header: 'Name', accessor: 'name' }];
    const error = new Error('fail');
    render(
      <DataTable
        data={[]}
        columns={cols}
        error={error}
        renderError={(e) => <span>Custom: {e.message}</span>}
      />,
    );
    expect(screen.getByText('Custom: fail')).toBeInTheDocument();
  });

  it('renders custom cell with render', () => {
    const cols = [
      {
        id: 'name',
        header: 'Name',
        accessor: (row: { name: string }) => row.name,
        render: (value: unknown) => (
          <span data-testid="custom-cell">{String(value).toUpperCase()}</span>
        ),
      },
    ];
    render(<DataTable data={[{ name: 'ada' }]} columns={cols} />);
    expect(screen.getByTestId('custom-cell')).toHaveTextContent('ADA');
  });

  it('uses rowKey function for row keys', () => {
    const cols = [
      { id: 'id', header: 'ID', accessor: (row: { id: number }) => row.id },
    ];
    const data = [{ id: 42 }];
    const rowKey = (row: { id: number }) => `row-${row.id}`;
    render(<DataTable data={data} columns={cols} rowKey={rowKey} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('uses rowKey string for row keys', () => {
    const cols = [
      { id: 'id', header: 'ID', accessor: (row: { id: number }) => row.id },
    ];
    const data = [{ id: 99 }];
    render(<DataTable data={data} columns={cols} rowKey="id" />);
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('handles accessor as function', () => {
    const cols = [
      {
        id: 'double',
        header: 'Double',
        accessor: (row: { value: number }) => row.value * 2,
      },
    ];
    render(<DataTable data={[{ value: 5 }]} columns={cols} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
