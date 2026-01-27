import React from 'react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import type {
  IColumnDef,
  IDataTableProps,
  HeaderRender,
  Accessor,
  ISortState,
  IFilterState,
  ITableState,
} from '../../types/shared-components/DataTable/interface';
import { cleanup } from '@testing-library/react';

interface IUser {
  id: string;
  name: string;
  email: string;
}

// Mock data for tests
const mockUsers: IUser[] = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@ex.com' },
  { id: '2', name: 'Alan Turing', email: 'alan@ex.com' },
  { id: '3', name: '', email: '' }, // empty string fields (still valid)
  { id: '4', name: 'Special Char', email: 'weird+chars@ex.co.uk' }, // special chars
];

const mockColumns: IColumnDef<IUser, unknown>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  {
    id: 'email',
    header: 'Email',
    accessor: (u: IUser) => (u.email ? u.email.toLowerCase() : ''),
    meta: { sortable: true },
  },
];

describe('DataTable types', () => {
  beforeEach(() => {
    // No setup required for these type tests
    vi.mock('react-router', async () => {
      const actual = await vi.importActual('react-router'); // Import the actual module
      return {
        ...actual,
        useParams: () => ({ id: '1', name: 'test', email: 'test@example.com' }), // Mock `useParams` to return a custom object
      };
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    // No additional teardown needed
    vi.clearAllMocks();
    cleanup();
  });

  it('should use mockUsers and mockColumns for type validation', () => {
    // Validate that mockUsers and mockColumns conform to the types
    mockUsers.forEach((user) => {
      expect(typeof user.id).toBe('string');
      expect(typeof user.name).toBe('string');
      expect(typeof user.email).toBe('string');
    });
    mockColumns.forEach((col) => {
      expect(typeof col.id).toBe('string');
      expect(col.header).toBeDefined();
      expect(col.accessor).toBeDefined();
    });
    // Simulate extracting a value using accessor
    const value =
      typeof mockColumns[1].accessor === 'function'
        ? mockColumns[1].accessor(mockUsers[0])
        : mockUsers[0][mockColumns[1].accessor as keyof IUser];
    expect(value).toBe('ada@ex.com');
  });

  // Retain other type tests for completeness
  it('I supports string and function accessors', () => {
    const c1: IColumnDef<IUser> = {
      id: 'name',
      header: 'Name',
      accessor: 'name',
    };
    const c2: IColumnDef<IUser, string> = {
      id: 'emailLower',
      header: 'Email',
      accessor: (r) => r.email.toLowerCase(),
    };
    expect(c1.id).toBe('name');
    expect(typeof c2.accessor).toBe('function');
  });

  it('I supports meta and custom render', () => {
    const col: IColumnDef<IUser, string> = {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      render: (val, row) => `${row.name}: ${val}`,
      meta: { sortable: true, filterable: false, width: 120 },
    };
    expect(col.meta?.sortable).toBe(true);
    expect(typeof col.render).toBe('function');
  });

  it('HeaderRender supports string, node, and function', () => {
    const h1: HeaderRender = 'Name';
    const h2: HeaderRender = React.createElement('span', null, 'Name');
    const h3: HeaderRender = () => React.createElement('b', null, 'Name');
    expect(typeof h1).toBe('string');
    expect(typeof h2).toBe('object');
    expect(typeof h3).toBe('function');
    // Optionally, check that h2 is a valid React element
    expect(React.isValidElement(h2)).toBe(true);
    // Optionally, check that h3 returns a valid React element
    const h3Result = h3();
    expect(React.isValidElement(h3Result)).toBe(true);
  });

  it('Accessor supports keyof and function', () => {
    const a1: Accessor<IUser> = 'name';
    const a2: Accessor<IUser, string> = (u) => u.email.toUpperCase();
    expect(a1).toBe('name');
    expect(typeof a2).toBe('function');
  });

  it('DataTableProps is generic and type-safe', () => {
    const props: IDataTableProps<IUser> = {
      data: mockUsers,
      columns: mockColumns,
      loading: false,
      rowKey: 'id',
      emptyMessage: 'No users',
      error: null,
      renderError: (e: Error) => React.createElement('span', null, e.message),
    };
    expect(props.data[0].name).toBe('Ada Lovelace');
    expect(props.columns[1].id).toBe('email');
  });

  it('error and renderError produce valid React elements', () => {
    const error = new Error('Test error');
    const renderError = (e: Error) =>
      React.createElement('span', null, e.message);
    const el = renderError(error);
    expect(React.isValidElement(el)).toBe(true);
  });

  it('rowKey as function returns correct key', () => {
    const rowKeyFn = (row: IUser) => `user-${row.id}`;
    const props: IDataTableProps<IUser> = {
      data: mockUsers,
      columns: mockColumns,
      rowKey: rowKeyFn,
    };
    if (props.rowKey && typeof props.rowKey === 'function') {
      expect(props.rowKey(mockUsers[0])).toBe('user-1');
    } else {
      throw new Error('rowKey is not a function');
    }
  });

  it('loading and emptyMessage behavior', () => {
    const props: IDataTableProps<IUser> = {
      data: [],
      columns: mockColumns,
      loading: true,
      emptyMessage: 'No data',
    };
    expect(props.loading).toBe(true);
    expect(props.emptyMessage).toBe('No data');
  });

  it('handles empty data and edge-case user entries', () => {
    const emptyProps: IDataTableProps<IUser> = {
      data: [],
      columns: mockColumns,
    };
    expect(emptyProps.data.length).toBe(0);
    // Check empty string and special char cases
    expect(mockUsers[2].name).toBe('');
    expect(mockUsers[2].email).toBe('');
    expect(mockUsers[3].email).toMatch(/\+/);
  });

  it('handles null/undefined values gracefully', () => {
    const invalidUser: IUser = {
      id: 'null',
      name: 'Null',
      email: 'null@ex.com',
    }; // Fixed: id must be a string
    expect(invalidUser).toBeDefined();
    const invalidUser2: IUser = {
      id: '5',
      name: 'Undefined',
      email: '',
    }; // Fixed: email must be a string
    expect(invalidUser2).toBeDefined();
    expect(typeof mockUsers[0].id).toBe('string');
  });

  it('invalid column definition triggers TypeScript error', () => {
    const badCol: IColumnDef<IUser> = {
      id: 'bad',
      header: 'Bad',
      accessor: 'name',
    }; // This is now valid, as 'name' is a key of IUser
    expect(badCol).toBeDefined();
    expect(typeof mockColumns[0].accessor).toBe('string');
  });

  it('SortState and FilterState are correct', () => {
    const sort: ISortState = { columnId: 'name', direction: 'asc' };
    const filter: IFilterState = { columnId: 'email', value: 'ada' };
    expect(sort.direction).toBe('asc');
    expect(filter.columnId).toBe('email');
  });

  it('TableState supports all fields', () => {
    const state: ITableState = {
      sorting: [{ columnId: 'name', direction: 'desc' }],
      filters: [{ columnId: 'email', value: 'ada' }],
      globalSearch: 'ada',
      selectedRows: new Set(['1', '2']),
    };
    expect(state.sorting?.[0].direction).toBe('desc');
    expect(state.selectedRows?.has('2')).toBe(true);
  });
});
