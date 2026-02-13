import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDataTableSelection } from '../../../hooks/useDataTableSelection';

type Key = string;
type IBulkAction = any;
type IUseDataTableSelectionOptions = any;
interface TestRow {
  id: string;
  name: string;
}

describe('useDataTableSelection', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockRows: TestRow[] = [
    { id: '1', name: 'Row 1' },
    { id: '2', name: 'Row 2' },
    { id: '3', name: 'Row 3' },
  ];

  const mockKeys: Key[] = ['1', '2', '3'];

  describe('Initialization', () => {
    it('should initialize with empty selection in uncontrolled mode', () => {
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
        }),
      );

      expect(result.current.currentSelection.size).toBe(0);
      expect(result.current.selectedCountOnPage).toBe(0);
      expect(result.current.allSelectedOnPage).toBe(false);
      expect(result.current.someSelectedOnPage).toBe(false);
    });

    it('should initialize with initialSelectedKeys in uncontrolled mode', () => {
      const initialKeys = new Set<Key>(['1', '2']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      expect(result.current.currentSelection.size).toBe(2);
      expect(result.current.currentSelection.has('1')).toBe(true);
      expect(result.current.currentSelection.has('2')).toBe(true);
      expect(result.current.selectedCountOnPage).toBe(2);
    });

    it('should initialize in controlled mode when selectedKeys is provided', () => {
      const selectedKeys = new Set<Key>(['1']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          selectedKeys,
        }),
      );

      expect(result.current.currentSelection.size).toBe(1);
      expect(result.current.currentSelection.has('1')).toBe(true);
    });

    it('should initialize with empty set when selectedKeys is empty in controlled mode', () => {
      const selectedKeys = new Set<Key>();
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          selectedKeys,
        }),
      );

      expect(result.current.currentSelection.size).toBe(0);
      expect(result.current.allSelectedOnPage).toBe(false);
      expect(result.current.someSelectedOnPage).toBe(false);
    });

    it('should handle selectable=false', () => {
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: false,
        }),
      );

      expect(result.current.allSelectedOnPage).toBe(false);
      expect(result.current.someSelectedOnPage).toBe(false);
    });

    it('should handle selectable=undefined (default false)', () => {
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
        }),
      );

      expect(result.current.allSelectedOnPage).toBe(false);
      expect(result.current.someSelectedOnPage).toBe(false);
    });
  });

  describe('toggleRowSelection', () => {
    it('should add a row to selection when not selected', () => {
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
        }),
      );

      act(() => {
        result.current.toggleRowSelection('1');
      });

      expect(result.current.currentSelection.has('1')).toBe(true);
      expect(result.current.selectedCountOnPage).toBe(1);
    });

    it('should remove a row from selection when already selected', () => {
      const initialKeys = new Set<Key>(['1', '2']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      act(() => {
        result.current.toggleRowSelection('1');
      });

      expect(result.current.currentSelection.has('1')).toBe(false);
      expect(result.current.currentSelection.has('2')).toBe(true);
      expect(result.current.selectedCountOnPage).toBe(1);
    });

    it('should call onSelectionChange in controlled mode', () => {
      const onSelectionChange = vi.fn();
      const selectedKeys = new Set<Key>(['1']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          selectedKeys,
          onSelectionChange,
        }),
      );

      act(() => {
        result.current.toggleRowSelection('2');
      });

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      const newSelection = onSelectionChange.mock.calls[0][0];
      expect(newSelection.has('1')).toBe(true);
      expect(newSelection.has('2')).toBe(true);
    });

    it('should work in controlled mode without onSelectionChange (read-only)', () => {
      const selectedKeys = new Set<Key>(['1']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          selectedKeys,
        }),
      );

      act(() => {
        result.current.toggleRowSelection('2');
      });

      // In read-only controlled mode, selection shouldn't change
      expect(result.current.currentSelection.size).toBe(1);
    });

    it('should toggle multiple rows independently', () => {
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
        }),
      );

      act(() => {
        result.current.toggleRowSelection('1');
      });

      expect(result.current.currentSelection.has('1')).toBe(true);
      expect(result.current.selectedCountOnPage).toBe(1);

      act(() => {
        result.current.toggleRowSelection('2');
      });

      expect(result.current.currentSelection.has('2')).toBe(true);
      expect(result.current.selectedCountOnPage).toBe(2);

      act(() => {
        result.current.toggleRowSelection('3');
      });

      expect(result.current.currentSelection.size).toBe(3);
      expect(result.current.allSelectedOnPage).toBe(true);
    });
  });

  describe('selectAllOnPage', () => {
    it('should select all rows when checked is true', () => {
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
        }),
      );

      act(() => {
        result.current.selectAllOnPage(true);
      });

      expect(result.current.currentSelection.size).toBe(3);
      expect(result.current.allSelectedOnPage).toBe(true);
      expect(result.current.someSelectedOnPage).toBe(false);
    });

    it('should deselect all rows when checked is false', () => {
      const initialKeys = new Set<Key>(['1', '2', '3']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      act(() => {
        result.current.selectAllOnPage(false);
      });

      expect(result.current.currentSelection.size).toBe(0);
      expect(result.current.allSelectedOnPage).toBe(false);
      expect(result.current.someSelectedOnPage).toBe(false);
    });

    it('should call onSelectionChange in controlled mode', () => {
      const onSelectionChange = vi.fn();
      const selectedKeys = new Set<Key>();
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          selectedKeys,
          onSelectionChange,
        }),
      );

      act(() => {
        result.current.selectAllOnPage(true);
      });

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      const newSelection = onSelectionChange.mock.calls[0][0];
      expect(newSelection.size).toBe(3);
    });

    it('should add page keys to existing selection', () => {
      const initialKeys = new Set<Key>(['4', '5']); // Keys from another page
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      // Initially, keys not on page are normalized away
      expect(result.current.currentSelection.size).toBe(0);

      act(() => {
        result.current.selectAllOnPage(true);
      });

      // Only current page keys should be selected
      expect(result.current.currentSelection.size).toBe(3);
      expect(result.current.currentSelection.has('1')).toBe(true);
      expect(result.current.currentSelection.has('2')).toBe(true);
      expect(result.current.currentSelection.has('3')).toBe(true);
    });

    it('should remove only page keys when deselecting', () => {
      const initialKeys = new Set<Key>(['1', '2', '4', '5']); // 1,2 on page, 4,5 on other page
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      // Keys not on page (4,5) are normalized away on mount
      expect(result.current.currentSelection.size).toBe(2); // Only 1,2 remain
      expect(result.current.currentSelection.has('1')).toBe(true);
      expect(result.current.currentSelection.has('2')).toBe(true);

      act(() => {
        result.current.selectAllOnPage(false);
      });

      expect(result.current.currentSelection.size).toBe(0);
      expect(result.current.currentSelection.has('1')).toBe(false);
      expect(result.current.currentSelection.has('2')).toBe(false);
    });
  });

  describe('clearSelection', () => {
    it('should clear all selections on current page', () => {
      const initialKeys = new Set<Key>(['1', '2', '3']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.currentSelection.size).toBe(0);
      expect(result.current.selectedCountOnPage).toBe(0);
    });

    it('should only clear page selections (keys from other pages are already normalized away)', () => {
      const initialKeys = new Set<Key>(['1', '2', '4', '5']); // 1,2 on page, 4,5 on other page
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      // Keys not on page (4,5) are normalized away on mount
      expect(result.current.currentSelection.size).toBe(2); // Only 1,2 remain

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.currentSelection.size).toBe(0);
      expect(result.current.selectedCountOnPage).toBe(0);
    });

    it('should call onSelectionChange in controlled mode', () => {
      const onSelectionChange = vi.fn();
      const selectedKeys = new Set<Key>(['1', '2']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          selectedKeys,
          onSelectionChange,
        }),
      );

      act(() => {
        result.current.clearSelection();
      });

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      const newSelection = onSelectionChange.mock.calls[0][0];
      expect(newSelection.size).toBe(0);
    });
  });

  describe('Page change normalization', () => {
    it('should normalize selection when page changes', () => {
      const initialKeys = new Set<Key>(['1', '2']);
      const { result, rerender } = renderHook(
        (props: IUseDataTableSelectionOptions<TestRow>) =>
          useDataTableSelection(props),
        {
          initialProps: {
            paginatedData: mockRows,
            keysOnPage: mockKeys,
            selectable: true,
            initialSelectedKeys: initialKeys,
          } as IUseDataTableSelectionOptions<TestRow>,
        },
      );

      expect(result.current.currentSelection.size).toBe(2);

      // Simulate page change to different keys
      const newKeys: Key[] = ['4', '5', '6'];
      const newRows: TestRow[] = [
        { id: '4', name: 'Row 4' },
        { id: '5', name: 'Row 5' },
        { id: '6', name: 'Row 6' },
      ];

      rerender({
        paginatedData: newRows,
        keysOnPage: newKeys,
        selectable: true,
        initialSelectedKeys: initialKeys,
      });

      // Selection should be cleared since none of the selected keys are on the new page
      expect(result.current.currentSelection.size).toBe(0);
    });

    it('should preserve selection for keys that exist on new page', () => {
      const initialKeys = new Set<Key>(['1', '2', '3']);
      const { result, rerender } = renderHook(
        (props: IUseDataTableSelectionOptions<TestRow>) =>
          useDataTableSelection(props),
        {
          initialProps: {
            paginatedData: mockRows,
            keysOnPage: mockKeys,
            selectable: true,
            initialSelectedKeys: initialKeys,
          } as IUseDataTableSelectionOptions<TestRow>,
        },
      );

      expect(result.current.currentSelection.size).toBe(3);

      // Simulate page change but keep some keys
      const newKeys: Key[] = ['2', '3', '4'];
      const newRows: TestRow[] = [
        { id: '2', name: 'Row 2' },
        { id: '3', name: 'Row 3' },
        { id: '4', name: 'Row 4' },
      ];

      rerender({
        paginatedData: newRows,
        keysOnPage: newKeys,
        selectable: true,
        initialSelectedKeys: initialKeys,
      });

      // Only keys 2 and 3 should remain selected
      expect(result.current.currentSelection.size).toBe(2);
      expect(result.current.currentSelection.has('2')).toBe(true);
      expect(result.current.currentSelection.has('3')).toBe(true);
      expect(result.current.currentSelection.has('1')).toBe(false);
    });

    it('should not normalize when keysOnPage does not change', () => {
      const onSelectionChange = vi.fn();
      const selectedKeys = new Set<Key>(['1', '2']);
      const { rerender } = renderHook(
        (props: IUseDataTableSelectionOptions<TestRow>) =>
          useDataTableSelection(props),
        {
          initialProps: {
            paginatedData: mockRows,
            keysOnPage: mockKeys,
            selectable: true,
            selectedKeys,
            onSelectionChange,
          } as IUseDataTableSelectionOptions<TestRow>,
        },
      );

      // Rerender with same keysOnPage
      rerender({
        paginatedData: mockRows,
        keysOnPage: mockKeys,
        selectable: true,
        selectedKeys,
        onSelectionChange,
      });

      // onSelectionChange should not be called since keys didn't change
      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('should normalize in controlled mode when page changes', () => {
      const onSelectionChange = vi.fn();
      const selectedKeys = new Set<Key>(['1', '2', '3']);
      const { rerender } = renderHook(
        (props: IUseDataTableSelectionOptions<TestRow>) =>
          useDataTableSelection(props),
        {
          initialProps: {
            paginatedData: mockRows,
            keysOnPage: mockKeys,
            selectable: true,
            selectedKeys,
            onSelectionChange,
          } as IUseDataTableSelectionOptions<TestRow>,
        },
      );

      // Simulate page change
      const newKeys: Key[] = ['4', '5', '6'];
      const newRows: TestRow[] = [
        { id: '4', name: 'Row 4' },
        { id: '5', name: 'Row 5' },
        { id: '6', name: 'Row 6' },
      ];

      rerender({
        paginatedData: newRows,
        keysOnPage: newKeys,
        selectable: true,
        selectedKeys,
        onSelectionChange,
      });

      // Should call onSelectionChange with empty set
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      const newSelection = onSelectionChange.mock.calls[0][0];
      expect(newSelection.size).toBe(0);
    });

    it('should handle empty keysOnPage', () => {
      const initialKeys = new Set<Key>(['1', '2']);
      const { result, rerender } = renderHook(
        (props: IUseDataTableSelectionOptions<TestRow>) =>
          useDataTableSelection(props),
        {
          initialProps: {
            paginatedData: mockRows,
            keysOnPage: mockKeys,
            selectable: true,
            initialSelectedKeys: initialKeys,
          } as IUseDataTableSelectionOptions<TestRow>,
        },
      );

      // Simulate page with no rows
      rerender({
        paginatedData: [],
        keysOnPage: [],
        selectable: true,
        initialSelectedKeys: initialKeys,
      });

      expect(result.current.currentSelection.size).toBe(0);
      expect(result.current.selectedCountOnPage).toBe(0);
      expect(result.current.allSelectedOnPage).toBe(false);
    });
  });

  describe('allSelectedOnPage and someSelectedOnPage', () => {
    it('should return true for allSelectedOnPage when all rows are selected', () => {
      const initialKeys = new Set<Key>(['1', '2', '3']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      expect(result.current.allSelectedOnPage).toBe(true);
      expect(result.current.someSelectedOnPage).toBe(false);
    });

    it('should return true for someSelectedOnPage when some rows are selected', () => {
      const initialKeys = new Set<Key>(['1', '2']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      expect(result.current.allSelectedOnPage).toBe(false);
      expect(result.current.someSelectedOnPage).toBe(true);
    });

    it('should return false for both when no rows are selected', () => {
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
        }),
      );

      expect(result.current.allSelectedOnPage).toBe(false);
      expect(result.current.someSelectedOnPage).toBe(false);
    });

    it('should return false when selectable is false', () => {
      const initialKeys = new Set<Key>(['1', '2', '3']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: false,
          initialSelectedKeys: initialKeys,
        }),
      );

      expect(result.current.allSelectedOnPage).toBe(false);
      expect(result.current.someSelectedOnPage).toBe(false);
    });

    it('should return false when keysOnPage is empty', () => {
      const initialKeys = new Set<Key>(['1']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: [],
          keysOnPage: [],
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      expect(result.current.allSelectedOnPage).toBe(false);
      expect(result.current.someSelectedOnPage).toBe(false);
    });
  });

  describe('runBulkAction', () => {
    it('should execute bulk action with selected rows and keys', () => {
      const onClick = vi.fn();
      const action: IBulkAction<TestRow> = {
        id: 'test-action',
        label: 'Test Action',
        onClick,
      };

      const initialKeys = new Set<Key>(['1', '2']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      act(() => {
        result.current.runBulkAction(action);
      });

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(
        [mockRows[0], mockRows[1]], // Selected rows
        ['1', '2'], // Selected keys
      );
    });

    it('should not execute action when disabled is true', () => {
      const onClick = vi.fn();
      const action: IBulkAction<TestRow> = {
        id: 'test-action',
        label: 'Test Action',
        onClick,
        disabled: true,
      };

      const initialKeys = new Set<Key>(['1']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      act(() => {
        result.current.runBulkAction(action);
      });

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not execute action when disabled function returns true', () => {
      const onClick = vi.fn();
      const disabledFn = vi.fn(() => true);
      const action: IBulkAction<TestRow> = {
        id: 'test-action',
        label: 'Test Action',
        onClick,
        disabled: disabledFn,
      };

      const initialKeys = new Set<Key>(['1']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      act(() => {
        result.current.runBulkAction(action);
      });

      expect(disabledFn).toHaveBeenCalledWith([mockRows[0]], ['1']);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should execute action when disabled function returns false', () => {
      const onClick = vi.fn();
      const disabledFn = vi.fn(() => false);
      const action: IBulkAction<TestRow> = {
        id: 'test-action',
        label: 'Test Action',
        onClick,
        disabled: disabledFn,
      };

      const initialKeys = new Set<Key>(['1']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      act(() => {
        result.current.runBulkAction(action);
      });

      expect(disabledFn).toHaveBeenCalledWith([mockRows[0]], ['1']);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should prompt for confirmation when confirm is provided', () => {
      const onClick = vi.fn();
      const action: IBulkAction<TestRow> = {
        id: 'test-action',
        label: 'Test Action',
        onClick,
        confirm: 'Are you sure?',
      };

      const initialKeys = new Set<Key>(['1']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      // Mock window.confirm to return false
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      act(() => {
        result.current.runBulkAction(action);
      });

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure?');
      expect(onClick).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });

    it('should execute action when user confirms', () => {
      const onClick = vi.fn();
      const action: IBulkAction<TestRow> = {
        id: 'test-action',
        label: 'Test Action',
        onClick,
        confirm: 'Are you sure?',
      };

      const initialKeys = new Set<Key>(['1']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      // Mock window.confirm to return true
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      act(() => {
        result.current.runBulkAction(action);
      });

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure?');
      expect(onClick).toHaveBeenCalledTimes(1);

      confirmSpy.mockRestore();
    });

    it('should handle async bulk actions', async () => {
      const onClick = vi.fn().mockResolvedValue(undefined);
      const action: IBulkAction<TestRow> = {
        id: 'test-action',
        label: 'Test Action',
        onClick,
      };

      const initialKeys = new Set<Key>(['1']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      await act(async () => {
        result.current.runBulkAction(action);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should handle async bulk action errors', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const error = new Error('Action failed');
      const onClick = vi.fn().mockRejectedValue(error);
      const action: IBulkAction<TestRow> = {
        id: 'test-action',
        label: 'Test Action',
        onClick,
      };

      const initialKeys = new Set<Key>(['1']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      await act(async () => {
        result.current.runBulkAction(action);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Bulk action failed:',
        error,
      );

      consoleErrorSpy.mockRestore();
    });

    it('should execute action with empty selection', () => {
      const onClick = vi.fn();
      const action: IBulkAction<TestRow> = {
        id: 'test-action',
        label: 'Test Action',
        onClick,
      };

      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
        }),
      );

      act(() => {
        result.current.runBulkAction(action);
      });

      expect(onClick).toHaveBeenCalledWith([], []);
    });

    it('should only include rows that are selected on current page', () => {
      const onClick = vi.fn();
      const action: IBulkAction<TestRow> = {
        id: 'test-action',
        label: 'Test Action',
        onClick,
      };

      // Select keys including some not on current page
      const initialKeys = new Set<Key>(['1', '2', '4', '5']);
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
          initialSelectedKeys: initialKeys,
        }),
      );

      act(() => {
        result.current.runBulkAction(action);
      });

      // Should only include rows 1 and 2 (on current page)
      expect(onClick).toHaveBeenCalledWith([mockRows[0], mockRows[1]], [
        '1',
        '2',
      ]);
    });
  });

  describe('Return values stability', () => {
    it('should maintain function reference stability across renders', () => {
      const { result, rerender } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
        }),
      );

      const initialToggleRowSelection = result.current.toggleRowSelection;
      const initialSelectAllOnPage = result.current.selectAllOnPage;
      const initialClearSelection = result.current.clearSelection;
      const initialRunBulkAction = result.current.runBulkAction;

      rerender();

      expect(result.current.toggleRowSelection).toBe(initialToggleRowSelection);
      expect(result.current.selectAllOnPage).toBe(initialSelectAllOnPage);
      expect(result.current.clearSelection).toBe(initialClearSelection);
      expect(result.current.runBulkAction).toBe(initialRunBulkAction);
    });
  });

  describe('Edge cases', () => {
    it('should handle numeric keys', () => {
      const numericKeys: Key[] = [1, 2, 3];
      const numericRows: TestRow[] = [
        { id: '1', name: 'Row 1' },
        { id: '2', name: 'Row 2' },
        { id: '3', name: 'Row 3' },
      ];

      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: numericRows,
          keysOnPage: numericKeys,
          selectable: true,
        }),
      );

      act(() => {
        result.current.toggleRowSelection(1);
      });

      expect(result.current.currentSelection.has(1)).toBe(true);
      expect(result.current.selectedCountOnPage).toBe(1);
    });

    it('should handle string keys', () => {
      const stringKeys: Key[] = ['key1', 'key2', 'key3'];
      const stringRows: TestRow[] = [
        { id: 'key1', name: 'Row 1' },
        { id: 'key2', name: 'Row 2' },
        { id: 'key3', name: 'Row 3' },
      ];

      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: stringRows,
          keysOnPage: stringKeys,
          selectable: true,
        }),
      );

      act(() => {
        result.current.toggleRowSelection('key1');
      });

      expect(result.current.currentSelection.has('key1')).toBe(true);
      expect(result.current.selectedCountOnPage).toBe(1);
    });

    it('should handle mixed string and numeric keys', () => {
      const mixedKeys: Key[] = [1, 'key2', 3];
      const mixedRows: TestRow[] = [
        { id: '1', name: 'Row 1' },
        { id: 'key2', name: 'Row 2' },
        { id: '3', name: 'Row 3' },
      ];

      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mixedRows,
          keysOnPage: mixedKeys,
          selectable: true,
        }),
      );

      act(() => {
        result.current.toggleRowSelection(1);
      });

      expect(result.current.currentSelection.has(1)).toBe(true);
      expect(result.current.selectedCountOnPage).toBe(1);

      act(() => {
        result.current.toggleRowSelection('key2');
      });

      expect(result.current.currentSelection.has(1)).toBe(true);
      expect(result.current.currentSelection.has('key2')).toBe(true);
      expect(result.current.selectedCountOnPage).toBe(2);
    });

    it('should handle large selection sets efficiently', () => {
      const largeKeys: Key[] = Array.from({ length: 1000 }, (_, i) => i);
      const largeRows: TestRow[] = largeKeys.map((key) => ({
        id: String(key),
        name: `Row ${key}`,
      }));

      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: largeRows,
          keysOnPage: largeKeys,
          selectable: true,
        }),
      );

      act(() => {
        result.current.selectAllOnPage(true);
      });

      expect(result.current.currentSelection.size).toBe(1000);
      expect(result.current.allSelectedOnPage).toBe(true);
    });

    it('should handle rapid selection changes', () => {
      const { result } = renderHook(() =>
        useDataTableSelection({
          paginatedData: mockRows,
          keysOnPage: mockKeys,
          selectable: true,
        }),
      );

      act(() => {
        result.current.toggleRowSelection('1');
        result.current.toggleRowSelection('1');
        result.current.toggleRowSelection('2');
        result.current.toggleRowSelection('2');
        result.current.toggleRowSelection('3');
      });

      // Row 1 and 2 toggled twice (back to unselected), only row 3 selected
      expect(result.current.currentSelection.size).toBe(1);
      expect(result.current.currentSelection.has('3')).toBe(true);
    });
  });
});
