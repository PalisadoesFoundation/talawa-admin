import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useDataTableSelection } from './useDataTableSelection';
import type { IBulkAction } from 'types/shared-components/DataTable/hooks';

type TestRow = { id: string };

const keys = ['1', '2', '3'];
const data: TestRow[] = [{ id: '1' }, { id: '2' }, { id: '3' }];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('useDataTableSelection', () => {
  it('runs bulk action when not disabled', async () => {
    const hook = renderHook(() =>
      useDataTableSelection<TestRow>({
        paginatedData: data,
        keysOnPage: keys,
        selectable: true,
      }),
    );

    const action: IBulkAction<TestRow> = {
      id: 'delete',
      label: 'Delete',
      disabled: () => false,
      onClick: vi.fn(async (_rows, _keys) => {}),
    };

    act(() => {
      hook.result.current.selectAllOnPage(true);
    });

    await act(async () => {
      await hook.result.current.runBulkAction(action);
    });

    expect(action.onClick).toHaveBeenCalledWith(data, keys);
  });

  it('does not run bulk action when disabled function returns true', async () => {
    const hook = renderHook(() =>
      useDataTableSelection<TestRow>({
        paginatedData: data,
        keysOnPage: keys,
        selectable: true,
      }),
    );

    const action: IBulkAction<TestRow> = {
      id: 'delete',
      label: 'Delete',
      disabled: () => true,
      onClick: vi.fn(async (_rows, _keys) => {}),
    };

    act(() => {
      hook.result.current.selectAllOnPage(true);
    });

    await act(async () => {
      await hook.result.current.runBulkAction(action);
    });

    expect(action.onClick).not.toHaveBeenCalled();
  });

  it('catches errors in async bulk actions', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const hook = renderHook(() =>
      useDataTableSelection<TestRow>({
        paginatedData: data,
        keysOnPage: keys,
        selectable: true,
      }),
    );

    const action: IBulkAction<TestRow> = {
      id: 'delete',
      label: 'Delete',
      disabled: () => false,
      onClick: async () => {
        throw new Error('fail');
      },
    };

    act(() => {
      hook.result.current.selectAllOnPage(true);
    });

    const mockPromise = Promise.reject(new Error('fail'));
    vi.spyOn(Promise, 'resolve').mockReturnValue(mockPromise);

    await act(async () => {
      hook.result.current.runBulkAction(action);
      await mockPromise.catch(() => {});
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Bulk action failed:',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });

  it('initializes with initialSelectedKeys in uncontrolled mode', () => {
    const { result } = renderHook(() =>
      useDataTableSelection<TestRow>({
        paginatedData: data,
        keysOnPage: keys,
        selectable: true,
        initialSelectedKeys: new Set(['1']),
      }),
    );

    expect(result.current.currentSelection.has('1')).toBe(true);
    expect(result.current.selectedCountOnPage).toBe(1);
  });

  it('toggles row selection correctly', () => {
    const { result } = renderHook(() =>
      useDataTableSelection<TestRow>({
        paginatedData: data,
        keysOnPage: keys,
        selectable: true,
      }),
    );

    act(() => {
      result.current.toggleRowSelection('1');
    });

    expect(result.current.currentSelection.has('1')).toBe(true);

    act(() => {
      result.current.toggleRowSelection('1');
    });

    expect(result.current.currentSelection.has('1')).toBe(false);
  });

  it('selects and deselects all rows on page', () => {
    const { result } = renderHook(() =>
      useDataTableSelection<TestRow>({
        paginatedData: data,
        keysOnPage: keys,
        selectable: true,
      }),
    );

    act(() => {
      result.current.selectAllOnPage(true);
    });

    expect(result.current.selectedCountOnPage).toBe(3);
    expect(result.current.allSelectedOnPage).toBe(true);

    act(() => {
      result.current.selectAllOnPage(false);
    });

    expect(result.current.selectedCountOnPage).toBe(0);
  });

  it('clears selection only for current page', () => {
    const { result } = renderHook(() =>
      useDataTableSelection<TestRow>({
        paginatedData: data,
        keysOnPage: keys,
        selectable: true,
        initialSelectedKeys: new Set(['1', '2']),
      }),
    );

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedCountOnPage).toBe(0);
  });

  it('computes someSelectedOnPage correctly', () => {
    const { result } = renderHook(() =>
      useDataTableSelection<TestRow>({
        paginatedData: data,
        keysOnPage: keys,
        selectable: true,
      }),
    );

    act(() => {
      result.current.toggleRowSelection('1');
    });

    expect(result.current.someSelectedOnPage).toBe(true);
    expect(result.current.allSelectedOnPage).toBe(false);
  });

  it('calls onSelectionChange in controlled mode', () => {
    const onSelectionChange = vi.fn();

    const { result } = renderHook(() =>
      useDataTableSelection<TestRow>({
        paginatedData: data,
        keysOnPage: keys,
        selectable: true,
        selectedKeys: new Set<string>(),
        onSelectionChange,
      }),
    );

    act(() => {
      result.current.toggleRowSelection('1');
    });

    expect(onSelectionChange).toHaveBeenCalled();
  });

  it('normalizes selection when page changes', () => {
    const { result, rerender } = renderHook(
      ({ keysOnPage }) =>
        useDataTableSelection<TestRow>({
          paginatedData: data,
          keysOnPage,
          selectable: true,
          initialSelectedKeys: new Set(['1', '2']),
        }),
      {
        initialProps: { keysOnPage: ['1', '2', '3'] },
      },
    );
    rerender({ keysOnPage: ['1'] });

    expect(result.current.currentSelection.has('2')).toBe(false);
    expect(result.current.currentSelection.has('1')).toBe(true);
  });

  it('does not normalize when keysOnPage does not change', () => {
    const { result, rerender } = renderHook(
      ({ keysOnPage }) =>
        useDataTableSelection<TestRow>({
          paginatedData: data,
          keysOnPage,
          selectable: true,
          initialSelectedKeys: new Set(['1']),
        }),
      {
        initialProps: { keysOnPage: ['1', '2', '3'] },
      },
    );

    rerender({ keysOnPage: ['1', '2', '3'] });

    expect(result.current.currentSelection.has('1')).toBe(true);
  });

  it('does not execute action when confirm is cancelled', () => {
    const actionFn = vi.fn();

    const action: IBulkAction<TestRow> = {
      id: 'bulk-test',
      label: 'Bulk Test',
      confirm: 'Are you sure?',
      onClick: actionFn,
    };

    vi.spyOn(window, 'confirm').mockReturnValue(false);

    const { result } = renderHook(() =>
      useDataTableSelection<TestRow>({
        paginatedData: data,
        keysOnPage: keys,
        selectable: true,
        initialSelectedKeys: new Set(['1']),
      }),
    );

    act(() => {
      result.current.runBulkAction(action);
    });

    expect(window.confirm).toHaveBeenCalledWith('Are you sure?');
    expect(actionFn).not.toHaveBeenCalled();
  });

  it('executes action when confirm returns true', async () => {
    const actionFn = vi.fn().mockResolvedValue(undefined);

    const action: IBulkAction<TestRow> = {
      id: 'bulk-test',
      label: 'Bulk Test',
      confirm: 'Are you sure?',
      onClick: actionFn,
    };

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { result } = renderHook(() =>
      useDataTableSelection<TestRow>({
        paginatedData: data,
        keysOnPage: keys,
        selectable: true,
        initialSelectedKeys: new Set(['1']),
      }),
    );

    await act(async () => {
      result.current.runBulkAction(action);
    });

    expect(window.confirm).toHaveBeenCalledWith('Are you sure?');
    expect(actionFn).toHaveBeenCalled();
  });

  it('passes only selected rows on current page to action', async () => {
    const actionFn = vi.fn().mockResolvedValue(undefined);

    const action: IBulkAction<TestRow> = {
      id: 'bulk-test',
      label: 'Bulk Test',
      onClick: actionFn,
    };

    const { result } = renderHook(() =>
      useDataTableSelection<TestRow>({
        paginatedData: data,
        keysOnPage: ['1', '2'],
        selectable: true,
        initialSelectedKeys: new Set(['1', '3']),
      }),
    );

    await act(async () => {
      result.current.runBulkAction(action);
    });

    const [rows, selectedKeys] = actionFn.mock.calls[0];

    expect(selectedKeys).toEqual(['1']);
    expect(rows).toHaveLength(1);
  });
});
