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

    await act(async () => {
      hook.result.current.runBulkAction(action);
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Bulk action failed:',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
