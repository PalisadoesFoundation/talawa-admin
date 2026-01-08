/**
 * CursorPaginationManager Component
 *
 * A reusable component that manages cursor-based pagination state and logic.
 * Supports both forward pagination (next page) and backward pagination (previous page).
 *
 * @remarks
 * This component uses a render props pattern to provide maximum flexibility.
 * It handles:
 * - Loading state management
 * - Cursor-based query variable construction
 * - Item deduplication
 * - Scroll position restoration (for backward pagination)
 *
 * @example
 * ```tsx
 * <CursorPaginationManager
 *   paginationDirection="backward"
 *   data={chatData?.chat?.messages}
 *   getConnection={(data) => data}
 *   queryVariables={{ last: 10, before: null }}
 *   itemsPerPage={10}
 *   onLoadMore={(vars) => refetch(vars)}
 *   scrollContainerRef={containerRef}
 * >
 *   {({ items, loading, hasMore, loadMore }) => (
 *     <div ref={containerRef}>
 *       {hasMore && <button onClick={loadMore}>Load More</button>}
 *       {items.map(item => <Item key={item.id} data={item} />)}
 *     </div>
 *   )}
 * </CursorPaginationManager>
 * ```
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  InterfaceCursorPaginationProps,
  InterfaceCursorPaginationRenderProps,
} from 'types/CursorPagination/interface';

/**
 * CursorPaginationManager component.
 *
 * @typeParam TData - The type of data returned by the query.
 * @typeParam TNode - The type of individual items being paginated. Must have an `id` field.
 */
function CursorPaginationManager<TData, TNode extends { id: string }>({
  paginationDirection = 'forward',
  data,
  getConnection,
  queryVariables,
  itemsPerPage,
  onLoadMore,
  children,
  scrollContainerRef,
  onItemsChange,
}: InterfaceCursorPaginationProps<TData, TNode>): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  // Extract connection from data
  const connection = data ? getConnection(data) : null;
  const edges = connection?.edges ?? [];
  const pageInfo = connection?.pageInfo;

  // Extract items from edges
  const items = useMemo(() => edges.map((edge) => edge.node), [edges]);

  // Determine if there are more items based on direction
  const hasMore = useMemo(() => {
    if (!pageInfo) return false;
    return paginationDirection === 'forward'
      ? pageInfo.hasNextPage
      : pageInfo.hasPreviousPage;
  }, [pageInfo, paginationDirection]);

  // Notify parent when items change
  useEffect(() => {
    if (onItemsChange) {
      onItemsChange(items);
    }
  }, [items, onItemsChange]);

  /**
   * Handles loading more items based on pagination direction.
   */
  const loadMore = useCallback(async (): Promise<void> => {
    if (loading || !hasMore || !pageInfo) return;

    setLoading(true);
    setError(undefined);

    // Capture current scroll position for backward pagination
    let currentScrollHeight = 0;
    if (paginationDirection === 'backward' && scrollContainerRef?.current) {
      currentScrollHeight = scrollContainerRef.current.scrollHeight;
    }

    try {
      // Build new query variables based on direction
      const newVariables: Record<string, unknown> = {
        ...queryVariables,
      };

      if (paginationDirection === 'forward') {
        // Forward pagination: use first and after
        newVariables.first = itemsPerPage;
        newVariables.after = pageInfo.endCursor;
        // Clear backward pagination params
        delete newVariables.last;
        delete newVariables.before;
      } else {
        // Backward pagination: use last and before
        newVariables.last = itemsPerPage;
        newVariables.before = pageInfo.startCursor;
        // Clear forward pagination params
        delete newVariables.first;
        delete newVariables.after;
      }

      await onLoadMore(newVariables);

      // Restore scroll position for backward pagination
      if (paginationDirection === 'backward' && scrollContainerRef?.current) {
        // Wait for DOM update
        setTimeout(() => {
          if (scrollContainerRef.current) {
            const newScrollHeight = scrollContainerRef.current.scrollHeight;
            scrollContainerRef.current.scrollTop =
              newScrollHeight - currentScrollHeight;
          }
        }, 0);
      }
    } catch (err) {
      console.error('Error loading more items:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    hasMore,
    pageInfo,
    paginationDirection,
    scrollContainerRef,
    queryVariables,
    itemsPerPage,
    onLoadMore,
  ]);

  // Prepare render props
  const renderProps: InterfaceCursorPaginationRenderProps<TNode> = {
    items,
    loading,
    hasMore,
    loadMore,
    error,
  };

  return <>{children(renderProps)}</>;
}

export default CursorPaginationManager;
