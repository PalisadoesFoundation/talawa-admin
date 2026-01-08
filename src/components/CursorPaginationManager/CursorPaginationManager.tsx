import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import get from 'lodash/get';
import type {
  InterfaceCursorPaginationProps,
  InterfaceCursorPaginationRenderProps,
  InterfaceEdge,
} from 'types/CursorPagination/interface';

// Empty query used as fallback when no query is provided (Controlled Mode)
const EMPTY_QUERY = gql`
  query EmptyQuery {
    __typename
  }
`;

/**
 * CursorPaginationManager Component
 *
 * A reusable component that manages cursor-based pagination state and logic.
 * Supports both forward pagination (next page) and backward pagination (previous page).
 *
 * It operates in two modes:
 * 1. **Controlled Mode**: Parent provides `data` and handles loading via `onLoadMore`.
 * 2. **Smart Mode**: Component fetches data using `query` and handles pagination internally.
 */
function CursorPaginationManager<TData, TNode>({
  paginationDirection = 'forward',
  data,
  getConnection,
  queryVariables,
  itemsPerPage,
  onLoadMore,
  children,
  scrollContainerRef,
  onItemsChange,
  // Smart Mode Props
  query,
  dataPath,
  renderItem,
  keyExtractor,
  loadingComponent,
  emptyStateComponent,
  refetchTrigger = 0,
  onDataChange,
}: InterfaceCursorPaginationProps<TData, TNode>): JSX.Element {
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  // --- Smart Mode Logic ---
  const isSmartMode = !!query;

  const {
    data: queryData,
    loading: queryLoading,
    fetchMore,
    refetch,
  } = useQuery(query ?? EMPTY_QUERY, {
    skip: !isSmartMode,
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
  });

  // Effect to handle manual refetch trigger
  useEffect(() => {
    if (isSmartMode && refetchTrigger > 0) {
      refetch?.();
    }
  }, [refetchTrigger, isSmartMode, refetch]);

  const effectiveData = isSmartMode ? queryData : data;
  const isLoading = isSmartMode ? queryLoading : internalLoading;

  // Extract connection
  let connection = null;
  if (isSmartMode && dataPath) {
    connection = get(effectiveData, dataPath);
  } else if (getConnection && effectiveData) {
    connection = getConnection(effectiveData);
  }

  const edges = connection?.edges ?? [];
  const pageInfo = connection?.pageInfo;

  // Extract items
  const items = useMemo(
    () => edges.map((edge: InterfaceEdge<TNode>) => edge.node), // i18n-ignore-line
    [edges],
  );

  // Notify parent of data change
  useEffect(() => {
    if (onDataChange && items.length > 0) {
      onDataChange(items);
    }
  }, [items, onDataChange]);

  // Determine hasMore
  const hasMore = useMemo(() => {
    if (!pageInfo) return false;
    return paginationDirection === 'forward'
      ? pageInfo.hasNextPage
      : pageInfo.hasPreviousPage;
  }, [pageInfo, paginationDirection]);

  // Notify parent when items change (Controlled/Legacy)
  useEffect(() => {
    if (onItemsChange) {
      onItemsChange(items);
    }
  }, [items, onItemsChange]);

  /**
   * Handles loading more items.
   */
  const loadMore = useCallback(async (): Promise<void> => {
    if (isLoading || !hasMore || !pageInfo) return;

    setInternalLoading(true);
    setError(undefined);

    // Capture scroll position
    let currentScrollHeight = 0;
    if (paginationDirection === 'backward' && scrollContainerRef?.current) {
      currentScrollHeight = scrollContainerRef.current.scrollHeight;
    }

    try {
      const newVariables: Record<string, unknown> = { ...queryVariables };

      if (paginationDirection === 'forward') {
        newVariables.first = itemsPerPage;
        newVariables.after = pageInfo.endCursor;
        delete newVariables.last;
        delete newVariables.before;
      } else {
        newVariables.last = itemsPerPage;
        newVariables.before = pageInfo.startCursor;
        delete newVariables.first;
        delete newVariables.after;
      }

      if (isSmartMode && fetchMore) {
        await fetchMore({
          variables: newVariables,
        });
      } else if (onLoadMore) {
        await onLoadMore(newVariables);
      }

      // Restore scroll position
      if (paginationDirection === 'backward' && scrollContainerRef?.current) {
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
      setInternalLoading(false);
    }
  }, [
    isLoading,
    hasMore,
    pageInfo,
    paginationDirection,
    scrollContainerRef,
    queryVariables,
    itemsPerPage,
    onLoadMore,
    isSmartMode,
    fetchMore,
  ]);

  const renderProps: InterfaceCursorPaginationRenderProps<TNode> = {
    items,
    loading: isLoading,
    hasMore,
    loadMore,
    error,
  };

  if (isSmartMode && queryLoading && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  if (
    isSmartMode &&
    !queryLoading &&
    items.length === 0 &&
    emptyStateComponent
  ) {
    return <>{emptyStateComponent}</>;
  }

  if (renderItem) {
    return (
      <>
        {items.map((item: TNode, index: number) => (
          <React.Fragment
            key={
              keyExtractor
                ? keyExtractor(item)
                : (item as { id?: string; _id?: string }).id ||
                  (item as { id?: string; _id?: string })._id ||
                  index
            }
          >
            {renderItem(item)}
          </React.Fragment>
        ))}
        {children && children(renderProps)}
      </>
    );
  }

  return <>{children ? children(renderProps) : null}</>;
}

export default CursorPaginationManager;
