import React from 'react';
import type {
  Key,
  IBulkAction,
  IUseDataTableSelectionOptions,
} from '../../../types/shared-components/DataTable/interface';

/**
 * Hook to manage DataTable selection and bulk action logic.
 * Supports controlled and uncontrolled modes for row selection.
 * Normalizes selection to current page keys on page changes.
 *
 * @typeParam T - The row data type
 * @param options - Configuration options for selection behavior
 * @returns Object containing selection state and mutation helpers
 */
export function useDataTableSelection<T>(
  options: IUseDataTableSelectionOptions<T>,
) {
  const {
    paginatedData,
    keysOnPage,
    selectable = false,
    selectedKeys,
    onSelectionChange,
    initialSelectedKeys,
  } = options;

  // Selection state (controlled or uncontrolled)
  // Controlled mode: selectedKeys is provided (even if no handler for read-only mode)
  const isSelectionControlled = selectedKeys !== undefined;
  const [internalSelectedKeys, setInternalSelectedKeys] = React.useState<
    Set<Key>
  >(new Set(initialSelectedKeys ?? []));

  const currentSelection = React.useMemo(
    () =>
      isSelectionControlled ? new Set(selectedKeys) : internalSelectedKeys,
    [isSelectionControlled, selectedKeys, internalSelectedKeys],
  );

  const updateSelection = React.useCallback(
    (next: Set<Key>) => {
      if (isSelectionControlled) {
        // In controlled mode, call handler if it exists (no-op otherwise)
        onSelectionChange?.(next);
      } else {
        // In uncontrolled mode, update internal state
        setInternalSelectedKeys(new Set(next));
      }
    },
    [isSelectionControlled, onSelectionChange],
  );

  // Track previous keysOnPage to detect actual page changes
  const prevKeysOnPageRef = React.useRef<Key[]>([]);

  // Normalize selection on page change: only keep selections that exist on the current page
  const keysOnPageSet = React.useMemo(() => new Set(keysOnPage), [keysOnPage]);

  React.useEffect(() => {
    // Only run normalization when keysOnPage actually changes
    const keysChanged =
      prevKeysOnPageRef.current.length !== keysOnPage.length ||
      !keysOnPage.every((k, i) => prevKeysOnPageRef.current[i] === k);

    if (!keysChanged) return;
    prevKeysOnPageRef.current = keysOnPage;

    // Compute intersection of currentSelection with keysOnPage
    const normalizedSelection = new Set<Key>();
    for (const key of currentSelection) {
      if (keysOnPageSet.has(key)) {
        normalizedSelection.add(key);
      }
    }
    // Only update if there are stale keys (selections from other pages)
    if (normalizedSelection.size !== currentSelection.size) {
      updateSelection(normalizedSelection);
    }
  }, [keysOnPage, keysOnPageSet, currentSelection, updateSelection]);

  const selectedCountOnPage = React.useMemo(
    () => keysOnPage.filter((k) => currentSelection.has(k)).length,
    [keysOnPage, currentSelection],
  );

  const allSelectedOnPage =
    selectable &&
    keysOnPage.length > 0 &&
    selectedCountOnPage === keysOnPage.length;

  const someSelectedOnPage =
    selectable && selectedCountOnPage > 0 && !allSelectedOnPage;

  const toggleRowSelection = React.useCallback(
    (key: Key) => {
      const next = new Set(currentSelection);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      updateSelection(next);
    },
    [currentSelection, updateSelection],
  );

  const selectAllOnPage = React.useCallback(
    (checked: boolean) => {
      const next = new Set(currentSelection);
      if (checked) {
        keysOnPage.forEach((k) => next.add(k));
      } else {
        keysOnPage.forEach((k) => next.delete(k));
      }
      updateSelection(next);
    },
    [currentSelection, keysOnPage, updateSelection],
  );

  const clearSelection = React.useCallback(() => {
    const next = new Set(currentSelection);
    keysOnPage.forEach((k) => next.delete(k));
    updateSelection(next);
  }, [currentSelection, keysOnPage, updateSelection]);

  const runBulkAction = React.useCallback(
    (action: IBulkAction<T>) => {
      const selectedKeysOnPage = keysOnPage.filter((k) =>
        currentSelection.has(k),
      );
      const selectedRows = paginatedData.filter((_, i) =>
        currentSelection.has(keysOnPage[i]),
      );

      const isDisabled =
        typeof action.disabled === 'function'
          ? action.disabled(selectedRows, selectedKeysOnPage)
          : !!action.disabled;

      if (isDisabled) return;

      if (action.confirm && !window.confirm(action.confirm)) return;

      // Handle async bulk actions with error catching
      Promise.resolve(action.onClick(selectedRows, selectedKeysOnPage)).catch(
        (error: unknown) => {
          console.error('Bulk action failed:', error);
        },
      );
    },
    [paginatedData, currentSelection, keysOnPage],
  );

  return {
    currentSelection,
    selectedCountOnPage,
    allSelectedOnPage,
    someSelectedOnPage,
    toggleRowSelection,
    selectAllOnPage,
    clearSelection,
    runBulkAction,
  };
}
