import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  type InterfaceConnectionData,
  type InterfaceCursorPaginationManagerProps,
  type PaginationVariables,
} from 'types/CursorPagination/interface';
import type { DefaultConnectionPageInfo } from 'types/AdminPortal/pagination';
import styles from './CursorPaginationManager.module.css';
import { useTranslation } from 'react-i18next';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import EmptyState from 'shared-components/EmptyState/EmptyState';

/**
 * Extracts connection data from a nested GraphQL response using a dot-separated path.
 *
 * @param data - The complete GraphQL response
 * @param path - Dot-separated path to connection (e.g., "organization.members")
 * @returns Connection data with edges and pageInfo, or null if not found
 */
function extractDataFromPath<TNode>(
  data: unknown,
  path: string,
): InterfaceConnectionData<TNode> | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  const segments = path.split('.');
  let current: unknown = data;

  for (const segment of segments) {
    if (!current || typeof current !== 'object') {
      return null;
    }
    current = (current as Record<string, unknown>)[segment];
  }

  // Validate connection structure (edges required, pageInfo optional)
  if (
    current &&
    typeof current === 'object' &&
    'edges' in current &&
    Array.isArray(current.edges)
  ) {
    return current as InterfaceConnectionData<TNode>;
  }

  return null;
}

/**
 * Extracts nodes from edges array
 */
function extractNodes<TNode>(
  edges: Array<{ cursor: string; node: TNode }>,
): TNode[] {
  return edges.map((edge) => edge.node);
}

/**
 * CursorPaginationManager - A reusable component for cursor-based pagination
 *
 * Manages cursor-based pagination state and integrates with Apollo Client.
 * Extracts data from nested GraphQL responses and provides "Load More" functionality.
 *
 * @typeParam TData - The complete GraphQL query response type
 * @typeParam TNode - The type of individual items
 * @typeParam TVariables - The GraphQL query variables type
 *
 * @example
 * ```tsx
 * import { CursorPaginationManager } from 'components/CursorPaginationManager/CursorPaginationManager';
 * import { gql } from '@apollo/client';
 *
 * const GET_USERS_QUERY = gql`
 *   query GetUsers($first: Int!, $after: String) {
 *     users(first: $first, after: $after) {
 *       edges {
 *         cursor
 *         node {
 *           id
 *           name
 *           email
 *         }
 *       }
 *       pageInfo {
 *         hasNextPage
 *         hasPreviousPage
 *         startCursor
 *         endCursor
 *       }
 *     }
 *   }
 * `;
 *
 * function UsersList() {
 *   return (
 *     <CursorPaginationManager
 *       query={GET_USERS_QUERY}
 *       dataPath="users"
 *       itemsPerPage={10}
 *       renderItem={(user) => (
 *         <div key={user.id}>
 *           <h3>{user.name}</h3>
 *           <p>{user.email}</p>
 *         </div>
 *       )}
 *     />
 *   );
 * }
 * ```
 *
 * @remarks
 * **Integration Requirements:**
 * - GraphQL query MUST follow Relay cursor pagination spec (edges, node, pageInfo)
 * - Query MUST accept `first: Int!` and `after: String` variables
 * - pageInfo MUST include: hasNextPage, hasPreviousPage, startCursor, endCursor
 * - Use `dataPath` prop to specify where connection data is in response (e.g., "users" or "organization.members")
 *
 * **Features:**
 * - Automatic loading, empty, and error states using shared components
 * - "Load More" button with cursor-based pagination
 * - Manual refetch via `refetchTrigger` prop
 * - Custom loading/empty states via props
 * - Data change callbacks via `onDataChange`
 */
export function CursorPaginationManager<
  TData,
  TNode,
  TVariables extends Record<string, unknown> = Record<string, unknown>, //i18n-ignore-line
>(
  props: InterfaceCursorPaginationManagerProps<TData, TNode, TVariables>,
): React.ReactElement {
  const {
    query,
    queryVariables,
    dataPath,
    itemsPerPage = 10,
    renderItem,
    keyExtractor,
    loadingComponent,
    emptyStateComponent,
    onDataChange,
    refetchTrigger,
    paginationType = 'forward',
    variableKeyMap,
    onQueryResult,
    onContentScroll,
    actionRef,
    infiniteScroll = false,
    scrollThreshold = 50,
    className,
  } = props;

  const { t } = useTranslation('common');

  // Internal state
  const [items, setItems] = useState<TNode[]>([]);
  const [pageInfo, setPageInfo] = useState<DefaultConnectionPageInfo | null>(
    null,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollStateRef = useRef<{
    scrollHeight: number;
    scrollTop: number;
  } | null>(null);
  const previousRefetchTrigger = useRef(refetchTrigger);
  const generationRef = useRef(0);
  const isMounted = useRef(true);
  const itemsRef = useRef<TNode[]>([]);

  // Handle component unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Sync itemsRef with items state
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Imperative Handle
  React.useImperativeHandle(
    actionRef,
    () => ({
      addItem: (item: TNode, position: 'start' | 'end' = 'end') => {
        setItems((prev) => {
          const newItems =
            position === 'start' ? [item, ...prev] : [...prev, item];
          if (onDataChange) onDataChange(newItems);
          return newItems;
        });
      },
      removeItem: (predicate: (item: TNode) => boolean) => {
        setItems((prev) => {
          const newItems = prev.filter((item) => !predicate(item));
          if (onDataChange) onDataChange(newItems);
          return newItems;
        });
      },
      updateItem: (
        predicate: (item: TNode) => boolean,
        updater: (item: TNode) => TNode,
      ) => {
        setItems((prev) => {
          const newItems = prev.map((item) =>
            predicate(item) ? updater(item) : item,
          );
          if (onDataChange) onDataChange(newItems);
          return newItems;
        });
      },
      getItems: () => itemsRef.current,
    }),
    [onDataChange],
  );

  // Apollo Client hook
  const { data, loading, error, fetchMore, refetch } = useQuery<
    TData,
    TVariables
  >(query, {
    variables: (() => {
      const vars: Record<string, unknown> = { ...queryVariables };
      if (paginationType === 'backward') {
        const lastKey = variableKeyMap?.last || 'last';
        const beforeKey = variableKeyMap?.before || 'before';
        vars[lastKey] = itemsPerPage;
        vars[beforeKey] = null;
      } else {
        const firstKey = variableKeyMap?.first || 'first';
        const afterKey = variableKeyMap?.after || 'after';
        vars[firstKey] = itemsPerPage;
        vars[afterKey] = null;
      }
      return vars as PaginationVariables<TVariables>;
    })(),
    notifyOnNetworkStatusChange: true,
  });

  // Data synchronization effect
  useEffect(() => {
    if (!data) return;

    if (onQueryResult) {
      onQueryResult(data);
    }

    const connectionData = extractDataFromPath<TNode>(data, dataPath);

    if (connectionData) {
      const newNodes = extractNodes(connectionData.edges);
      setItems(newNodes);
      setPageInfo(connectionData.pageInfo || null);

      if (onDataChange) {
        onDataChange(newNodes);
      }
    }
  }, [data, dataPath, onDataChange]);

  // Load more handler
  const handleLoadMore = useCallback(async () => {
    const hasMore =
      paginationType === 'backward'
        ? pageInfo?.hasPreviousPage
        : pageInfo?.hasNextPage;

    if (!hasMore || isLoadingMore || loading) {
      return;
    }

    setIsLoadingMore(true);
    const currentGeneration = generationRef.current;

    if (paginationType === 'backward' && containerRef.current) {
      scrollStateRef.current = {
        scrollHeight: containerRef.current.scrollHeight,
        scrollTop: containerRef.current.scrollTop,
      };
    }

    try {
      const variables: Record<string, unknown> = { ...queryVariables };
      if (paginationType === 'backward') {
        const lastKey = variableKeyMap?.last || 'last';
        const beforeKey = variableKeyMap?.before || 'before';
        variables[lastKey] = itemsPerPage;
        variables[beforeKey] = pageInfo?.startCursor;
      } else {
        const firstKey = variableKeyMap?.first || 'first';
        const afterKey = variableKeyMap?.after || 'after';
        variables[firstKey] = itemsPerPage;
        variables[afterKey] = pageInfo?.endCursor;
      }

      const result = await fetchMore({
        variables: variables as PaginationVariables<TVariables>,
      });

      // Check if this request is stale or component unmounted
      if (currentGeneration !== generationRef.current || !isMounted.current) {
        return;
      }

      const connectionData = extractDataFromPath<TNode>(result.data, dataPath);

      if (connectionData) {
        const newNodes = extractNodes(connectionData.edges);
        setItems((prevItems) => {
          const updatedItems =
            paginationType === 'backward'
              ? [...newNodes, ...prevItems]
              : [...prevItems, ...newNodes];

          if (onDataChange) {
            onDataChange(updatedItems);
          }
          return updatedItems;
        });
        setPageInfo(connectionData.pageInfo || null);
      }
      if (isMounted.current) {
        setIsLoadingMore(false);
      }
    } catch (err) {
      console.error('Error loading more items:', err);
      if (currentGeneration === generationRef.current && isMounted.current) {
        setIsLoadingMore(false);
      }
    }
  }, [
    pageInfo,
    isLoadingMore,
    loading,
    fetchMore,
    queryVariables,
    itemsPerPage,
    dataPath,
    onDataChange,
    paginationType,
    variableKeyMap,
    onContentScroll,
  ]);

  // Scroll Restoration Layout Effect
  React.useLayoutEffect(() => {
    if (
      paginationType === 'backward' &&
      scrollStateRef.current &&
      containerRef.current
    ) {
      const { scrollHeight, scrollTop } = scrollStateRef.current;
      const newScrollHeight = containerRef.current.scrollHeight;
      const heightDiff = newScrollHeight - scrollHeight;

      containerRef.current.scrollTop = scrollTop + heightDiff;

      scrollStateRef.current = null;
    }
  }, [items, paginationType]);

  // Infinite Scroll Handler
  useEffect(() => {
    if (!infiniteScroll || !containerRef.current) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;

      if (paginationType === 'backward') {
        if (target.scrollTop <= scrollThreshold) {
          handleLoadMore();
        }
      } else {
        if (
          target.scrollHeight - target.scrollTop - target.clientHeight <=
          scrollThreshold
        ) {
          handleLoadMore();
        }
      }
    };

    const el = containerRef.current;
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [infiniteScroll, paginationType, scrollThreshold, handleLoadMore]);

  // Refetch handler
  const handleRefetch = useCallback(async () => {
    // Increment generation to invalidate any pending fetchMore requests
    generationRef.current += 1;
    setItems([]);
    setPageInfo(null);
    setIsLoadingMore(false);

    try {
      const vars: Record<string, unknown> = { ...queryVariables };
      if (paginationType === 'backward') {
        const lastKey = variableKeyMap?.last || 'last';
        const beforeKey = variableKeyMap?.before || 'before';
        vars[lastKey] = itemsPerPage;
        vars[beforeKey] = null;
      } else {
        const firstKey = variableKeyMap?.first || 'first';
        const afterKey = variableKeyMap?.after || 'after';
        vars[firstKey] = itemsPerPage;
        vars[afterKey] = null;
      }

      await refetch(vars as PaginationVariables<TVariables>);
    } catch (err) {
      console.error('Error refetching data:', err);
    }
  }, [refetch, queryVariables, itemsPerPage, paginationType, variableKeyMap]);

  // Watch for refetchTrigger changes
  useEffect(() => {
    if (
      refetchTrigger !== undefined &&
      refetchTrigger !== previousRefetchTrigger.current
    ) {
      previousRefetchTrigger.current = refetchTrigger;
      void handleRefetch();
    }
  }, [refetchTrigger, handleRefetch]);

  // Error state (no items yet)
  if (error && !items.length) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        data-testid="cursor-pagination-error"
        className={styles.stateMessage}
      >
        <p>{error.message}</p>
        <button
          type="button"
          onClick={handleRefetch}
          className={styles.loadMoreButton}
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  // Loading state (initial load)
  if (loading && !items.length) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    return (
      <LoadingState
        isLoading={true}
        variant="inline"
        size="lg"
        data-testid="cursor-pagination-loading"
      >
        <div />
      </LoadingState>
    );
  }

  // Empty state
  if (!loading && !items.length) {
    if (emptyStateComponent) {
      return <>{emptyStateComponent}</>;
    }
    return (
      <EmptyState
        message="noResultsFound"
        dataTestId="cursor-pagination-empty"
      />
    );
  }

  // Success state: render items and load more button
  return (
    <div
      data-testid="cursor-pagination-manager"
      className={className}
      ref={containerRef}
      onScroll={onContentScroll}
    >
      {!infiniteScroll &&
        paginationType === 'backward' &&
        pageInfo?.hasPreviousPage && (
          <div className={styles.loadMoreSection}>
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={styles.loadMoreButton}
              aria-label={t('loadOlderMessages')}
              data-testid="load-more-button-top"
            >
              {isLoadingMore ? t('loading') : t('loadOlderMessages')}
            </button>
          </div>
        )}

      {infiniteScroll && paginationType === 'backward' && isLoadingMore && (
        <div className={styles.loadMoreSection}>
          <span className={styles.loadingText}>{t('loading')}...</span>
        </div>
      )}

      <div className={styles.itemsContainer}>
        {items.map((item, index) => {
          const key = keyExtractor ? keyExtractor(item, index) : index;
          return <div key={key}>{renderItem(item, index)}</div>;
        })}
      </div>

      {!infiniteScroll &&
        paginationType === 'forward' &&
        pageInfo?.hasNextPage && (
          <div className={styles.loadMoreSection}>
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={styles.loadMoreButton}
              aria-label={t('loadMoreItems')}
              data-testid="load-more-button"
            >
              {isLoadingMore ? t('loading') : t('loadMore')}
            </button>
          </div>
        )}

      {infiniteScroll && paginationType === 'forward' && isLoadingMore && (
        <div className={styles.loadMoreSection}>
          <span className={styles.loadingText}>{t('loading')}...</span>
        </div>
      )}
    </div>
  );
}

export default CursorPaginationManager;
