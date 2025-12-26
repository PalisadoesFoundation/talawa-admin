import React from 'react';
import { describe, it, expect } from 'vitest';
import type {
  IColumnDef,
  IDataTableProps,
  HeaderRender,
  Accessor,
  ISortState,
  IFilterState,
  ITableState,
} from './types';

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
      renderError: (e) => React.createElement('span', null, e.message),
    };
    expect(props.data[0].name).toBe('Ada Lovelace');
    expect(props.columns[1].id).toBe('email');
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
