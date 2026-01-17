import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@apollo/client';
import type {
  InterfaceCursorPaginationManagerProps,
  InterfaceConnectionData,
  PaginationVariables,
} from 'types/CursorPagination/interface';
import type { DefaultConnectionPageInfo } from 'types/pagination';
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
 *         \<div key={user.id}\>
 *           \<h3\>{user.name}\</h3\>
 *           \<p\>{user.email}\</p\>
 *         \</div\>
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
  props: InterfaceCursorPaginationManagerProps<TNode, TVariables>,
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
    tableMode = false,
    clientSideFilter,
  } = props;

  const { t } = useTranslation('common');

  // Internal state
  const [items, setItems] = useState<TNode[]>([]);
  const [pageInfo, setPageInfo] = useState<DefaultConnectionPageInfo | null>(
    null,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const previousRefetchTrigger = useRef(refetchTrigger);
  const generationRef = useRef(0);
  const isMounted = useRef(true);

  // Handle component unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Apollo Client hook
  const { data, loading, error, fetchMore, refetch } = useQuery<
    TData,
    TVariables
  >(query, {
    variables: {
      ...queryVariables,
      first: itemsPerPage,
      after: null,
    } as PaginationVariables<TVariables>,
    notifyOnNetworkStatusChange: true,
  });

  // Data synchronization effect
  useEffect(() => {
    if (!data) return;

    const connectionData = extractDataFromPath<TNode>(data, dataPath);

    if (connectionData) {
      const newNodes = extractNodes(connectionData.edges);

      // Apply client-side filter if provided
      const filteredNodes = clientSideFilter
        ? newNodes.filter(clientSideFilter)
        : newNodes;

      setItems(filteredNodes);
      setPageInfo(connectionData.pageInfo || null);

      if (onDataChange) {
        onDataChange(filteredNodes);
      }
    }
  }, [data, dataPath, onDataChange, clientSideFilter]);

  // Load more handler
  const handleLoadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage || isLoadingMore || loading) {
      return;
    }

    setIsLoadingMore(true);
    const currentGeneration = generationRef.current;

    try {
      const result = await fetchMore({
        variables: {
          ...queryVariables,
          first: itemsPerPage,
          after: pageInfo.endCursor,
        } as PaginationVariables<TVariables>,
      });

      // Check if this request is stale or component unmounted
      if (currentGeneration !== generationRef.current || !isMounted.current) {
        return;
      }

      const connectionData = extractDataFromPath<TNode>(result.data, dataPath);

      if (connectionData) {
        const newNodes = extractNodes(connectionData.edges);

        // Apply client-side filter if provided
        const filteredNewNodes = clientSideFilter
          ? newNodes.filter(clientSideFilter)
          : newNodes;

        setItems((prevItems) => {
          const updatedItems = [...prevItems, ...filteredNewNodes];
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
      console.error(t('errorLoadingData'), err);
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
    clientSideFilter,
  ]);

  // Refetch handler
  const handleRefetch = useCallback(async () => {
    // Increment generation to invalidate any pending fetchMore requests
    generationRef.current += 1;
    setPageInfo(null);
    setIsLoadingMore(false);
    setIsRefetching(true);

    try {
      await refetch({
        ...queryVariables,
        first: itemsPerPage,
        after: null,
      } as PaginationVariables<TVariables>);
    } catch (err) {
      console.error(t('errorLoadingData'), err);
    } finally {
      setIsRefetching(false);
    }
  }, [refetch, queryVariables, itemsPerPage]);

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

  // Loading state (initial load or refetching)
  if ((loading || isRefetching) && !items.length) {
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
  if (!loading && !isRefetching && !items.length) {
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

  if (tableMode) {
    return (
      <>
        {items.map((item, index) => {
          const key = keyExtractor ? keyExtractor(item, index) : index;
          return (
            <React.Fragment key={key}>{renderItem(item, index)}</React.Fragment>
          );
        })}
        {pageInfo?.hasNextPage && (
          <tr>
            <td colSpan={100} className={styles.loadMoreCell}>
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
            </td>
          </tr>
        )}
      </>
    );
  }

  return (
    <div data-testid="cursor-pagination-manager">
      <div className={styles.itemsContainer}>
        {items.map((item, index) => {
          const key = keyExtractor ? keyExtractor(item, index) : index;
          return <div key={key}>{renderItem(item, index)}</div>;
        })}
      </div>
      {pageInfo?.hasNextPage && (
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
    </div>
  );
}

export default CursorPaginationManager;
